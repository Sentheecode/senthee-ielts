#!/usr/bin/env bash
set -euo pipefail

if [ ! -f docker-compose.yml ]; then
  echo "Run this script from the project root."
  exit 1
fi

if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Edit DEEPSEEK_API_KEY when you are ready."
fi

docker compose up -d --build
docker compose ps
