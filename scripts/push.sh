#!/bin/bash
set -e

# Use the provided commit message, or a default one with a timestamp if none is provided
COMMIT_MSG="${1:-Auto-update $(date +%Y-%m-%d_%H:%M:%S)}"

echo "=== Vallixis Git Push ==="

# Stage all changes
git add .

# Commit changes (don't fail if there's nothing new to commit)
git commit -m "$COMMIT_MSG" || echo "No new changes to commit."

# Push to the remote repository
git push

echo "✓ Successfully pushed to remote repository!"
