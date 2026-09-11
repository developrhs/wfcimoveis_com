<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
try {
  require_method('GET'); require_sync_permission(); $pdo=db(); ensure_sync_schema($pdo); $since=trim((string)($_GET['since']??''));
  if($since!==''&&!preg_match('/^\d{4}-\d{2}-\d{2}T/', $since)) json_response(['error'=>'Cursor since inválido.'],422);
  $sql='SELECT entity_type,entity_id,version,operation,payload_json,updated_at FROM wfc_sync_records'; $params=[]; if($since!==''){$sql.=' WHERE updated_at > ?';$params[]=(new DateTimeImmutable($since))->format('Y-m-d H:i:s.u');} $sql.=' ORDER BY updated_at,entity_type,entity_id LIMIT 500'; $p=$pdo->prepare($sql);$p->execute($params);$items=[];while($r=$p->fetch())$items[]=['entityType'=>$r['entity_type'],'entityId'=>$r['entity_id'],'version'=>(int)$r['version'],'operation'=>$r['operation'],'payload'=>json_decode((string)$r['payload_json'],true),'updatedAt'=>(new DateTimeImmutable($r['updated_at']))->format(DATE_ATOM)];json_response(['items'=>$items,'serverTime'=>(new DateTimeImmutable())->format(DATE_ATOM)]);
} catch(Throwable $e){error_log('[wfc] sync-pull: '.$e->getMessage());json_response(['error'=>'Não foi possível carregar a sincronização.'],500);}
?>
