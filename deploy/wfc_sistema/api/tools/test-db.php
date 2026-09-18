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
    if (is_array($value)) {
        $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    echo str_pad($label, 30, ' ') . ": " . (string)$value . PHP_EOL;
}

function section(string $title): void
{
    echo PHP_EOL . "== {$title} ==" . PHP_EOL;
}

try {
    section('Conexão PDO');
    $pdo = db();
    line('status', 'OK');
    line('database', (string)$pdo->query('SELECT DATABASE()')->fetchColumn());
    line('server', (string)$pdo->query('SELECT VERSION()')->fetchColumn());
    line('mysql user', (string)$pdo->query('SELECT CURRENT_USER()')->fetchColumn());

    section('Tabelas esperadas');
    $tables = ['tb_property', 'tb_client', 'tb_user', 'wfc_sync_records'];
    $tableExists = [];
    // SHOW TABLES LIKE não aceita placeholders no MySQL 5.7; information_schema aceita.
    $tableStatement = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?');
    foreach ($tables as $table) {
        $tableStatement->execute([$table]);
        $exists = (int)$tableStatement->fetchColumn() > 0;
        $tableExists[$table] = $exists;
        line($table, $exists ? 'EXISTS' : 'MISSING');
    }

    section('Consultas SQL diretas');
    if ($tableExists['tb_property']) {
        line('tb_property count', $pdo->query('SELECT COUNT(*) FROM `tb_property`')->fetchColumn());
    } else {
        line('tb_property count', 'SKIPPED (table missing)');
    }

    if ($tableExists['wfc_sync_records']) {
        line('sync total', $pdo->query('SELECT COUNT(*) FROM `wfc_sync_records`')->fetchColumn());
        line('sync imovel UPSERT', $pdo->query("SELECT COUNT(*) FROM `wfc_sync_records` WHERE entity_type = 'imovel' AND operation = 'UPSERT'")->fetchColumn());
        $grouped = $pdo->query('SELECT entity_type, operation, COUNT(*) AS total FROM `wfc_sync_records` GROUP BY entity_type, operation ORDER BY entity_type, operation')->fetchAll();
        foreach ($grouped as $row) {
            line('sync group', sprintf('%s / %s = %s', $row['entity_type'], $row['operation'], $row['total']));
        }
    } else {
        line('wfc_sync_records', 'SKIPPED (table missing)');
    }

    section('Resultado');
    if (!$tableExists['wfc_sync_records']) {
        echo "A conexão funciona, mas a tabela de sincronização ainda não existe.\n";
        echo "Execute a sincronização ou crie a tabela com api/config/sync_schema.sql.\n";
        exit(2);
    }
    echo "Conexão e consultas SQL concluídas com sucesso.\n";
    exit(0);
} catch (Throwable $error) {
    section('Resultado');
    line('status', 'ERROR');
    line('exception', get_class($error));
    line('message', $error->getMessage());
    echo PHP_EOL . "Verifique api/config/local.php, permissões do usuário MySQL e o nome do banco.\n";
    exit(1);
}
