<?php
declare(strict_types=1);
require_once __DIR__.'/bootstrap.php';
try { require_method('GET'); db(); json_response(['ok'=>true,'service'=>'wfc-api']); }
catch (Throwable $e) { error_log('[wfc] health: '.$e->getMessage()); json_response(['ok'=>false,'error'=>'Serviço indisponível.'],503); }
