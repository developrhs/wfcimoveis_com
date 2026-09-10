<?php
declare(strict_types=1);

// Opcional: no HostGator, crie api/config/local.php com os valores reais.
// Esse arquivo é bloqueado pelo .htaccess e não deve ser versionado.
$localConfig = __DIR__ . '/local.php';
if (is_file($localConfig)) require $localConfig;

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $host = getenv('WFC_DB_HOST') ?: (defined('WFC_DB_HOST') ? WFC_DB_HOST : 'localhost');
    $name = getenv('WFC_DB_NAME') ?: (defined('WFC_DB_NAME') ? WFC_DB_NAME : 'cwcimo17_wfc_imoveis');
    $user = getenv('WFC_DB_USER') ?: (defined('WFC_DB_USER') ? WFC_DB_USER : '');
    $pass = getenv('WFC_DB_PASS') ?: (defined('WFC_DB_PASS') ? WFC_DB_PASS : '');
    if ($user === '' || $pass === '') throw new RuntimeException('Banco não configurado.');
    $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
