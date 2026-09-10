<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
$action = basename($_SERVER['SCRIPT_NAME']);
try {
  if ($action === 'login') {
    require_method('POST'); $in=body_json(); $identity=trim((string)($in['identity']??'')); $password=(string)($in['password']??'');
    if ($identity==='' || $password==='') json_response(['error'=>'Informe usuário e senha.'],422);
    $q=db()->prepare('SELECT * FROM tb_user WHERE tb_user_username = :identity OR tb_user_email = :identity LIMIT 1'); $q->execute(['identity'=>$identity]); $row=$q->fetch();
    if (!$row || !password_verify($password,(string)($row['tb_user_password']??'')) || ($row['tb_user_status']??'') !== 'active') json_response(['error'=>'Usuário ou senha inválidos.'],401);
    session_regenerate_id(true); $_SESSION['wfc_user']=safe_user($row); json_response(['user'=>$_SESSION['wfc_user']]);
  }
  if ($action === 'me') { require_method('GET'); $u=current_user(); if (!$u) json_response(['error'=>'Não autenticado.'],401); json_response(['user'=>$u]); }
  if ($action === 'logout') { require_method('POST'); $_SESSION=[]; if (ini_get('session.use_cookies')) { $p=session_get_cookie_params(); setcookie(session_name(),'',['expires'=>time()-42000,'path'=>$p['path'],'secure'=>$p['secure'],'httponly'=>$p['httponly'],'samesite'=>'Lax']); } session_destroy(); json_response(['success'=>true]); }
  json_response(['error'=>'Rota não encontrada.'],404);
} catch (Throwable $e) { error_log('[wfc] auth: '.$e->getMessage()); json_response(['error'=>'Serviço temporariamente indisponível.'],500); }
