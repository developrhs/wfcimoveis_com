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
