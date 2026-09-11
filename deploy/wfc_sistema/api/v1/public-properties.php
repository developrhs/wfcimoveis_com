<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
try {
  require_method('GET'); $pdo=db(); ensure_sync_schema($pdo); $p=$pdo->query("SELECT entity_id,payload_json,version,updated_at FROM wfc_sync_records WHERE entity_type='imovel' AND operation='UPSERT' ORDER BY updated_at DESC LIMIT 500"); $items=[]; while($r=$p->fetch()){ $payload=json_decode((string)$r['payload_json'],true); if(!is_array($payload))continue; $payload['id']=(string)$r['entity_id']; $payload['_version']=(int)$r['version']; $payload['_updatedAt']=(new DateTimeImmutable($r['updated_at']))->format(DATE_ATOM); $items[]=$payload; } json_response(['items'=>$items]);
} catch(Throwable $e){error_log('[wfc] public-properties: '.$e->getMessage());json_response(['error'=>'Não foi possível carregar os imóveis.'],500);}
?>
