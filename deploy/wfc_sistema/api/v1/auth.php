<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$action = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));

/** Busca o usuário em schemas legados ou no schema novo sem expor credenciais ao cliente. */
function find_login_user(PDO $pdo, string $identity): ?array
{
    foreach (['tb_user', 'users'] as $table) {
        try {
            $columns = $pdo->query("SHOW COLUMNS FROM `{$table}`")->fetchAll(PDO::FETCH_COLUMN);
        } catch (Throwable) {
            continue;
        }
        if (!$columns) continue;
        $pick = static function (array $names) use ($columns): ?string {
            foreach ($names as $name) if (in_array($name, $columns, true)) return $name;
            return null;
        };
        $id = $pick(['tb_user_id', 'id']);
        $username = $pick(['tb_user_username', 'username', 'user_name', 'login', 'openId']);
        $email = $pick(['tb_user_email', 'email']);
        $password = $pick(['tb_user_password', 'password', 'password_hash', 'senha', 'senha_hash']);
        if (!$id || !$username || !$password) continue;
        $name = $pick(['tb_user_name', 'name', 'full_name', 'nome']);
        $role = $pick(['tb_user_role', 'role', 'perfil', 'profile']);
        $status = $pick(['tb_user_status', 'status', 'active', 'ativo']);
        $where = $email ? "`{$username}` = :identity OR `{$email}` = :identity" : "`{$username}` = :identity";
        $select = ["`{$id}` AS tb_user_id", "`{$username}` AS tb_user_username", "`{$password}` AS tb_user_password"];
        $select[] = $email ? "`{$email}` AS tb_user_email" : "'' AS tb_user_email";
        $select[] = $name ? "`{$name}` AS tb_user_name" : "`{$username}` AS tb_user_name";
        $select[] = $role ? "`{$role}` AS tb_user_role" : "'user' AS tb_user_role";
        if ($status === 'active' || $status === 'ativo') {
            $select[] = "IF(`{$status}` IN (1, '1', 'active', 'ativo'), 'active', 'inactive') AS tb_user_status";
        } else {
            $select[] = $status ? "`{$status}` AS tb_user_status" : "'active' AS tb_user_status";
        }
        $query = $pdo->prepare('SELECT ' . implode(',', $select) . ' FROM `' . $table . '` WHERE ' . $where . ' LIMIT 1');
        $query->execute(['identity' => $identity]);
        $row = $query->fetch();
        if (is_array($row)) return $row;
    }
    return null;
}

try {
    if ($action === 'login') {
        require_method('POST');
        require_same_origin();
        if (login_is_rate_limited()) {
            json_response(['error' => 'Muitas tentativas. Aguarde alguns minutos e tente novamente.', 'code' => 'RATE_LIMITED'], 429);
        }
        $input = body_json();
        $identity = trim((string) ($input['identity'] ?? ''));
        $password = (string) ($input['password'] ?? '');

        if ($identity === '' || $password === '') {
            json_response(['error' => 'Informe usuário e senha.', 'code' => 'VALIDATION_ERROR'], 422);
        }
        if (strlen($identity) > 190 || strlen($password) > 4096) {
            json_response(['error' => 'Usuário ou senha inválidos.', 'code' => 'INVALID_CREDENTIALS'], 401);
        }

        $row = find_login_user(db(), $identity);
        $valid = is_array($row)
            && password_verify($password, (string) ($row['tb_user_password'] ?? ''))
            && strtolower((string) ($row['tb_user_status'] ?? '')) === 'active';
        if (!$valid) {
            register_failed_login();
            json_response(['error' => 'Usuário ou senha inválidos.', 'code' => 'INVALID_CREDENTIALS'], 401);
        }

        try {
            $user = safe_user($row);
        } catch (DomainException) {
            error_log('[wfc] auth: unsupported role for user id ' . (int) ($row['tb_user_id'] ?? 0));
            json_response(['error' => 'Usuário sem perfil de acesso válido.', 'code' => 'ROLE_NOT_ALLOWED'], 403);
        }
        clear_failed_logins();
        establish_user_session($user);
        json_response(['user' => $user]);
    }

    if ($action === 'me') {
        require_method('GET');
        json_response(['user' => require_auth()]);
    }

    if ($action === 'logout') {
        require_method('POST');
        require_same_origin();
        destroy_current_session();
        json_response(['success' => true]);
    }

    json_response(['error' => 'Rota não encontrada.', 'code' => 'NOT_FOUND'], 404);
} catch (PDOException $error) {
    error_log('[wfc] auth database: ' . $error->getMessage());
    json_response(['error' => 'Banco de autenticação indisponível.', 'code' => 'AUTH_DATABASE_UNAVAILABLE'], 503);
} catch (Throwable $error) {
    error_log('[wfc] auth: ' . $error->getMessage());
    json_response(['error' => 'Serviço temporariamente indisponível.', 'code' => 'AUTH_UNAVAILABLE'], 500);
}
