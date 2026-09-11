CREATE TABLE IF NOT EXISTS wfc_sync_records (
  entity_type VARCHAR(40) NOT NULL,
  entity_id VARCHAR(120) NOT NULL,
  version BIGINT UNSIGNED NOT NULL DEFAULT 1,
  operation ENUM('UPSERT','DELETE') NOT NULL DEFAULT 'UPSERT',
  payload_json JSON NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (entity_type, entity_id),
  INDEX idx_wfc_sync_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
