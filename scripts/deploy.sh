#!/bin/bash
set -e

SITE_ID="${1:-}"
echo "=== Vallixis Deploy ==="

if [ -z "$SITE_ID" ]; then
  echo "Usage: bash scripts/deploy.sh <site-id>"
  exit 1
fi

echo "Deploying site: $SITE_ID"
# TODO: Phase 1 — trigger deployment via API
echo "Deploy triggered for $SITE_ID"
