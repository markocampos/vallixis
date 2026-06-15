#!/bin/bash
set -e

# Use a persistent backup directory instead of /tmp
BACKUP_DIR="${BACKUP_DIR:-/opt/vallixis/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_$TIMESTAMP.sql"
GZIP_FILE="$BACKUP_FILE.gz"

echo "=== Vallixis Backup ==="
# Ensure the backup directory exists
mkdir -p "$BACKUP_DIR"

# PostgreSQL backup
if [ -n "$DATABASE_URL" ]; then
  echo "Starting database backup..."
  pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
  
  # Compress the backup to save space
  gzip -f "$BACKUP_FILE"
  echo "✓ Database backed up and compressed to $GZIP_FILE"

  # Optional: Upload to AWS S3 if S3_BUCKET is configured
  if [ -n "$S3_BUCKET" ]; then
    echo "Uploading backup to S3 bucket: $S3_BUCKET..."
    if command -v aws &> /dev/null; then
      aws s3 cp "$GZIP_FILE" "s3://$S3_BUCKET/backups/db_$TIMESTAMP.sql.gz"
      echo "✓ Backup successfully uploaded to S3."
    else
      echo "⚠ AWS CLI not installed. Skipping S3 upload."
    fi
  fi
else
  echo "⚠ DATABASE_URL not set, skipping database backup."
  exit 1
fi

echo "✓ Backup process complete."
