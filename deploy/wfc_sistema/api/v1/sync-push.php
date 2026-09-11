<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
try {
  require_method('POST'); require_sync_permission(); $pdo=db(); ensure_sync_schema($pdo); $in=body_json(); $items=$in['items']??[];
  if (!is_array($items) || count($items)>100) json_response(['error'=>'Lote de sincronização inválido.'],422);
  $accepted=[]; $conflicts=[];
  $pdo->beginTransaction();
  foreach($items as $item){
    $type=sync_entity_type((string)($item['entityType']??'')); $id=trim((string)($item['entityId']??'')); $operation=strtoupper((string)($item['operation']??'UPSERT')); $base=(int)($item['baseVersion']??0); if($id===''||!in_array($operation,['UPSERT','DELETE'],true)) json_response(['error'=>'Item de sincronização inválido.'],422); $payload=$operation==='DELETE'?[]:($item['payload']??[]); $json=sync_payload($payload);
    $q=$pdo->prepare('SELECT version FROM wfc_sync_records WHERE entity_type=? AND entity_id=? FOR UPDATE'); $q->execute([$type,$id]); $current=$q->fetchColumn(); $currentVersion=$current===false?0:(int)$current;
    if($currentVersion!==$base && $currentVersion!==0){$conflicts[]=['entityType'=>$type,'entityId'=>$id,'serverVersion'=>$currentVersion,'clientBaseVersion'=>$base];continue;}
    $next=$currentVersion+1; $sql="INSERT INTO wfc_sync_records(entity_type,entity_id,version,operation,payload_json) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE version=VALUES(version),operation=VALUES(operation),payload_json=VALUES(payload_json),updated_at=CURRENT_TIMESTAMP(6)"; $p=$pdo->prepare($sql); $p->execute([$type,$id,$next,$operation,$json]); $accepted[]=['entityType'=>$type,'entityId'=>$id,'version'=>$next];
  }
  $pdo->commit(); json_response(['accepted'=>$accepted,'conflicts'=>$conflicts]);
} catch(Throwable $e){if(isset($pdo)&&$pdo->inTransaction())$pdo->rollBack();error_log('[wfc] sync-push: '.$e->getMessage());json_response(['error'=>'Não foi possível sincronizar o lote.'],500);}
?>
