<?php
declare(strict_types=1);

// Diagnóstico local/CLI. Nunca expor este arquivo como endpoint HTTP.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("Not found\n");
}

require_once __DIR__ . '/../config/database.php';

function line(string $label, mixed $value): void
{
    if (is_array($value)) $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo str_pad($label, 30, ' ') . ': ' . (string) $value . PHP_EOL;
}
function section(string $title): void { echo PHP_EOL . "== {$title} ==" . PHP_EOL; }

try {
    section('Conexão PDO');
    $pdo = db();
    line('status', 'OK');
    line('database', (string) $pdo->query('SELECT DATABASE()')->fetchColumn());
    line('server', (string) $pdo->query('SELECT VERSION()')->fetchColumn());
    line('mysql user', (string) $pdo->query('SELECT CURRENT_USER()')->fetchColumn());

    section('Tabelas esperadas');
    $expected = ['tb_user', 'tb_property', 'tb_client', 'wfc_sync_records', 'users', 'imoveis', 'clientes'];
    $available = [];
    // Não usar SHOW TABLES LIKE ?; o MySQL 5.7 rejeita placeholder nesse comando.
    foreach ($pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $table) $available[(string) $table] = true;
    foreach ($expected as $table) line($table, isset($available[$table]) ? 'EXISTS' : 'MISSING');

    foreach (['tb_user', 'users'] as $table) {
        if (!isset($available[$table])) continue;
        section("Colunas {$table}");
        foreach ($pdo->query("SHOW COLUMNS FROM `{$table}`")->fetchAll(PDO::FETCH_ASSOC) as $column) {
            line((string) ($column['Field'] ?? ''), (string) ($column['Type'] ?? ''));
        }
    }

    section('Consultas SQL diretas');
    if (isset($available['tb_property'])) line('tb_property count', $pdo->query('SELECT COUNT(*) FROM `tb_property`')->fetchColumn());
    else line('tb_property count', 'SKIPPED (table missing)');
    if (isset($available['wfc_sync_records'])) {
        line('sync total', $pdo->query('SELECT COUNT(*) FROM `wfc_sync_records`')->fetchColumn());
        line('sync imovel UPSERT', $pdo->query("SELECT COUNT(*) FROM `wfc_sync_records` WHERE entity_type = 'imovel' AND operation = 'UPSERT'")->fetchColumn());
    } else line('wfc_sync_records', 'SKIPPED (table missing)');

    section('Resultado');
    line('status', 'OK');
    line('observação', 'conexão e inspeção concluídas sem consultar senhas ou hashes');
    exit(0);
} catch (Throwable $error) {
    section('Resultado');
    line('status', 'ERROR');
    line('exception', get_class($error));
    line('message', $error->getMessage());
    echo PHP_EOL . "Verifique api/config/local.php, permissões do usuário MySQL e o nome do banco.\n";
    exit(1);
}
