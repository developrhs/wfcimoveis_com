<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name('wfc_session');
    session_set_cookie_params(['httponly'=>true,'secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),'samesite'=>'Lax','path'=>'/sistema/']);
    session_start();
}

function json_response(array $data, int $status = 200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); exit; }
function body_json(): array { $raw=file_get_contents('php://input'); $data=json_decode($raw ?: '{}', true); return is_array($data) ? $data : []; }
function require_method(string $method): void { if ($_SERVER['REQUEST_METHOD'] !== $method) json_response(['error'=>'Método não permitido.'],405); }
function current_user(): ?array { return $_SESSION['wfc_user'] ?? null; }
function require_auth(): array { $u=current_user(); if (!$u) json_response(['error'=>'Sessão expirada.'],401); return $u; }
function safe_user(array $row): array { return ['id'=>(int)$row['tb_user_id'],'username'=>$row['tb_user_username'],'email'=>$row['tb_user_email'],'name'=>$row['tb_user_name'] ?? $row['tb_user_username'],'role'=>$row['tb_user_role'],'status'=>$row['tb_user_status']]; }

function require_sync_permission(): array { $u=require_auth(); if (!in_array((string)($u['role'] ?? ''), ['Administrador','admin','Corretor'], true)) json_response(['error'=>'Sem permissão para sincronizar dados.'],403); return $u; }
function ensure_sync_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS wfc_sync_records (
      entity_type VARCHAR(40) NOT NULL,
      entity_id VARCHAR(120) NOT NULL,
      version BIGINT UNSIGNED NOT NULL DEFAULT 1,
      operation ENUM('UPSERT','DELETE') NOT NULL DEFAULT 'UPSERT',
      payload_json JSON NOT NULL,
      updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (entity_type, entity_id), INDEX idx_wfc_sync_updated (updated_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}
function sync_entity_type(string $type): string { $allowed=['imovel','cliente','agente','venda','usuario','prova_social']; if (!in_array($type,$allowed,true)) json_response(['error'=>'Tipo de entidade não permitido.'],422); return $type; }
function sync_payload(mixed $payload): string { if (!is_array($payload)) json_response(['error'=>'Payload inválido.'],422); try { $json=json_encode($payload, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR); } catch (Throwable) { json_response(['error'=>'Payload JSON inválido.'],422); } if (strlen($json)>500000) json_response(['error'=>'Payload excede o limite.'],413); return $json; }
