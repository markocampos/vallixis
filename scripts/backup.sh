#!/bin/bash
set -e

BACKUP_DIR="/tmp/vallixis/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Vallixis Backup ==="
mkdir -p "$BACKUP_DIR"

# PostgreSQL backup
if [ -n "$DATABASE_URL" ]; then
  pg_dump "$DATABASE_URL" > "$BACKUP_DIR/db_$TIMESTAMP.sql"
  echo "✓ Database backed up to $BACKUP_DIR/db_$TIMESTAMP.sql"
else
  echo "⚠ DATABASE_URL not set, skipping database backup"
fi

echo "✓ Backup complete"
