#!/bin/bash
set -e
cd /home/ubuntu/vallixis/frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p 2>/dev/null || true
echo "Tailwind installed"
