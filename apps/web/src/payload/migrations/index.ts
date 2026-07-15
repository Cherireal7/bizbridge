import * as migration_20260609_135059_sync_payload_schema from './20260609_135059_sync_payload_schema';

export const migrations = [
  {
    up: migration_20260609_135059_sync_payload_schema.up,
    down: migration_20260609_135059_sync_payload_schema.down,
    name: '20260609_135059_sync_payload_schema'
  },
];
