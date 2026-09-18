<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
$action = basename($_SERVER['SCRIPT_NAME']);

/** Resolve o usuário sem assumir que o banco foi migrado para um único schema. */
function find_login_user(PDO $pdo, string $identity): ?array {
  $tables = ['tb_user', 'users'];
  foreach ($tables as $table) {
    try {
      $columns = $pdo->query("SHOW COLUMNS FROM `{$table}`")->fetchAll(PDO::FETCH_COLUMN);
    } catch (Throwable $e) {
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
    if (!$id || !$username || !$password || (!$email && !$username)) continue;
    $name = $pick(['tb_user_name', 'name', 'full_name', 'nome']);
    $role = $pick(['tb_user_role', 'role', 'perfil', 'profile']);
    $status = $pick(['tb_user_status', 'status', 'active', 'ativo']);
    $where = $email ? "`{$username}` = :identity OR `{$email}` = :identity" : "`{$username}` = :identity";
    $select = ["`{$id}` AS tb_user_id", "`{$username}` AS tb_user_username", "`{$password}` AS tb_user_password"];
    $select[] = $email ? "`{$email}` AS tb_user_email" : "'' AS tb_user_email";
    $select[] = $name ? "`{$name}` AS tb_user_name" : "`{$username}` AS tb_user_name";
    $select[] = $role ? "`{$role}` AS tb_user_role" : "'user' AS tb_user_role";
    if ($status) $select[] = ($status === 'active' || $status === 'ativo') ? "IF(`{$status}` = 1, 'active', 'inactive') AS tb_user_status" : "`{$status}` AS tb_user_status"; else $select[] = "'active' AS tb_user_status";
    $q = $pdo->prepare('SELECT '.implode(',', $select).' FROM `'.$table.'` WHERE '.$where.' LIMIT 1');
    $q->execute(['identity' => $identity]);
    $row = $q->fetch();
    if ($row !== false) return $row;
  }
  return null;
}

try {
  if ($action === 'login') {
    require_method('POST'); $in=body_json(); $identity=trim((string)($in['identity']??'')); $password=(string)($in['password']??'');
    if ($identity==='' || $password==='') json_response(['error'=>'Informe usuário e senha.'],422);
    $row=find_login_user(db(), $identity);
    if (!$row || !password_verify($password,(string)$row['tb_user_password']) || (string)$row['tb_user_status'] !== 'active') json_response(['error'=>'Usuário ou senha inválidos.'],401);
    session_regenerate_id(true); $_SESSION['wfc_user']=safe_user($row); json_response(['user'=>$_SESSION['wfc_user']]);
  }
  if ($action === 'me') { require_method('GET'); $u=current_user(); if (!$u) json_response(['error'=>'Não autenticado.'],401); json_response(['user'=>$u]); }
  if ($action === 'logout') { require_method('POST'); $_SESSION=[]; if (ini_get('session.use_cookies')) { $p=session_get_cookie_params(); setcookie(session_name(),'',['expires'=>time()-42000,'path'=>$p['path'],'secure'=>$p['secure'],'httponly'=>$p['httponly'],'samesite'=>'Lax']); } session_destroy(); json_response(['success'=>true]); }
  json_response(['error'=>'Rota não encontrada.'],404);
} catch (PDOException $e) {
  error_log('[wfc] auth database: '.$e->getMessage());
  json_response(['error'=>'Banco de autenticação indisponível.','code'=>'AUTH_DATABASE_UNAVAILABLE'],503);
} catch (Throwable $e) { error_log('[wfc] auth: '.$e->getMessage()); json_response(['error'=>'Serviço temporariamente indisponível.','code'=>'AUTH_UNAVAILABLE'],500); }
