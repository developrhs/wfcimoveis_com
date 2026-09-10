<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
try {
  require_method('GET'); require_auth(); $pdo=db();
  $count=function(string $table) use($pdo): int { return (int)$pdo->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn(); };
  json_response(['data'=>['properties'=>$count('tb_property'),'clients'=>$count('tb_client'),'users'=>$count('tb_user')]]);
} catch (Throwable $e) { error_log('[wfc] summary: '.$e->getMessage()); json_response(['error'=>'Não foi possível carregar o resumo.'],500); }
