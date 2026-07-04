#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/senthee-ielts}"
IMAGE_NAME="${IMAGE_NAME:-senthee-ielts}"
PORT="${PORT:-3000}"

echo "Deploying Senthee IELTS to ${APP_DIR} on port ${PORT}"

mkdir -p "${APP_DIR}"
cd "${APP_DIR}"

if [ ! -f package.json ]; then
  echo "Run this script from a directory containing the project files, or copy the project to ${APP_DIR} first."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker first."
  exit 1
fi

docker build -t "${IMAGE_NAME}:latest" .
docker rm -f "${IMAGE_NAME}" >/dev/null 2>&1 || true
docker run -d \
  --name "${IMAGE_NAME}" \
  --restart unless-stopped \
  -p "${PORT}:3000" \
  --env-file .env \
  "${IMAGE_NAME}:latest"

echo "Ready: http://SERVER_IP:${PORT}"
