#!/bin/bash
set -e

SITE_ID="${1:-}"
# Use env vars if provided, otherwise default to a generic production API URL
DEPLOY_API_URL="${DEPLOY_API_URL:-https://api.vallixis.com/v1/deploy}"
DEPLOY_API_KEY="${DEPLOY_API_KEY:-}"

echo "=== Vallixis Deploy ==="

if [ -z "$SITE_ID" ]; then
  echo "Usage: bash scripts/deploy.sh <site-id>"
  exit 1
fi

if [ -z "$DEPLOY_API_KEY" ]; then
  echo "⚠ DEPLOY_API_KEY environment variable is missing."
  echo "Please set it before deploying to authenticate with the API. (e.g. export DEPLOY_API_KEY='your-key')"
  exit 1
fi

echo "Triggering deployment for site: $SITE_ID..."

# Make a POST request to the deployment API
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$DEPLOY_API_URL" \
  -H "Authorization: Bearer $DEPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"siteId\": \"$SITE_ID\"}")

HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
  echo "✓ Deploy successfully triggered for $SITE_ID"
  echo "API Response: $BODY"
else
  echo "✗ Failed to trigger deployment. HTTP Status: $HTTP_STATUS"
  echo "API Response: $BODY"
  exit 1
fi
