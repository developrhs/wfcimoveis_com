<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

function table_exists(PDO $pdo, string $table): bool
{
  $query = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?');
  $query->execute([$table]);
  return (int)$query->fetchColumn() > 0;
}

function first_value(array $row, array $keys, mixed $default = null): mixed
{
  foreach ($keys as $key) {
    foreach ($row as $column => $value) {
      if (strtolower((string)$column) === strtolower($key) && $value !== null && $value !== '') return $value;
    }
  }
  return $default;
}

function direct_property(array $row, int $fallbackId): array
{
  $id = first_value($row, ['tb_property_code', 'tb_property_id', 'id', 'codigo', 'code', 'property_id', 'imovel_id'], (string)$fallbackId);
  $priceCents = first_value($row, ['tb_property_price_cents', 'price_cents', 'valor_centavos', 'preco_centavos', 'valor_cents']);
  if ($priceCents === null) {
    $price = first_value($row, ['price', 'preco', 'valor', 'valor_venda'], 0);
    $priceCents = is_numeric($price) ? (float)$price * (str_contains((string)$price, '.') ? 100 : 1) : 0;
  }
  return [
    'id' => (string)$id,
    'title' => (string)first_value($row, ['tb_property_title', 'title', 'titulo', 'nome', 'description', 'descricao'], 'Imóvel WFC'),
    'type' => (string)first_value($row, ['tb_property_type_id', 'type', 'tipo', 'property_type', 'tipo_imovel'], 'Imóvel'),
    'saleType' => (string)first_value($row, ['tb_sale_type_id', 'saleType', 'sale_type', 'tipoVenda', 'tipo_venda', 'modalidade'], 'Consulte'),
    'location' => (string)first_value($row, ['tb_property_location', 'location', 'localizacao', 'localização', 'endereco', 'endereço', 'bairro', 'cidade'], ''),
    'price' => (int)round((float)$priceCents),
    'status' => (string)first_value($row, ['tb_property_status', 'status', 'situacao', 'situação'], 'disponivel'),
    'available' => (int)first_value($row, ['tb_property_available_quantity', 'available', 'disponivel', 'disponíveis', 'estoque', 'quantidade'], 1),
    'total' => first_value($row, ['tb_property_total_quantity', 'total', 'estoque_total', 'quantidade_total']),
    'bedrooms' => (int)first_value($row, ['tb_property_bedroom', 'bedrooms', 'quartos', 'dormitorios', 'dormitórios'], 0),
    'baths' => (int)first_value($row, ['tb_property_bathroom', 'baths', 'banheiros', 'wc'], 0),
    'area' => (string)first_value($row, ['tb_property_area', 'area', 'metragem', 'area_m2', 'metros_quadrados'], ''),
    'image' => first_value($row, ['image', 'imagem', 'foto', 'image_url', 'imagem_url', 'foto_url']),
    'tag' => (string)first_value($row, ['tag', 'destaque', 'label'], 'WFC Imóveis'),
  ];
}

try {
  require_method('GET');
  $pdo = db();
  $items = [];

  if (table_exists($pdo, 'wfc_sync_records')) {
    $query = $pdo->query("SELECT entity_id,payload_json,version,updated_at FROM wfc_sync_records WHERE entity_type='imovel' AND operation='UPSERT' ORDER BY updated_at DESC LIMIT 500");
    while ($row = $query->fetch()) {
      $payload = json_decode((string)$row['payload_json'], true);
      if (!is_array($payload)) continue;
      $payload['id'] = (string)$row['entity_id'];
      $payload['_version'] = (int)$row['version'];
      $payload['_updatedAt'] = (new DateTimeImmutable($row['updated_at']))->format(DATE_ATOM);
      $items[] = $payload;
    }
  } elseif (table_exists($pdo, 'tb_property')) {
    // Compatibilidade com a base existente antes da primeira sincronização.
    $query = $pdo->query('SELECT * FROM `tb_property` ORDER BY 1 DESC LIMIT 500');
    $fallbackId = 1;
    while ($row = $query->fetch()) {
      $items[] = direct_property($row, $fallbackId++);
    }
  }

  json_response(['items' => $items]);
} catch (Throwable $e) {
  error_log('[wfc] public-properties: ' . $e->getMessage());
  json_response(['error' => 'Não foi possível carregar os imóveis.'], 500);
}
?>
