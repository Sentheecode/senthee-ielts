#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-senthee-ielts}"

if [ ! -f package.json ]; then
  echo "Run this script from the project root."
  exit 1
fi

if [ ! -f .env.local ] && [ -f .env ]; then
  cp .env .env.local
fi

npm ci
npm run build

if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
  pm2 reload "${APP_NAME}" --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
pm2 status "${APP_NAME}"
