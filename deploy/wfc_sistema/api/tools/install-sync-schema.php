<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("Not found\n");
}

require_once __DIR__ . '/../config/database.php';

try {
    $pdo = db();
    $pdo->exec("CREATE TABLE IF NOT EXISTS `wfc_sync_records` (
        `entity_type` VARCHAR(40) NOT NULL,
        `entity_id` VARCHAR(120) NOT NULL,
        `version` BIGINT UNSIGNED NOT NULL DEFAULT 1,
        `operation` ENUM('UPSERT','DELETE') NOT NULL DEFAULT 'UPSERT',
        `payload_json` JSON NOT NULL,
        `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (`entity_type`, `entity_id`),
        INDEX `idx_wfc_sync_updated` (`updated_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $exists = (int) $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'wfc_sync_records'")->fetchColumn();
    if ($exists !== 1) throw new RuntimeException('A tabela não foi encontrada após a criação.');

    echo "status     : OK\n";
    echo "database   : " . $pdo->query('SELECT DATABASE()')->fetchColumn() . "\n";
    echo "table      : wfc_sync_records\n";
    echo "operation  : CREATE TABLE IF NOT EXISTS concluída\n";
    exit(0);
} catch (Throwable $error) {
    fwrite(STDERR, "status     : ERROR\n");
    fwrite(STDERR, "exception  : " . get_class($error) . "\n");
    fwrite(STDERR, "message    : " . $error->getMessage() . "\n");
    exit(1);
}
