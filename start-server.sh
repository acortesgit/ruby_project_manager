#!/bin/bash

# Script para iniciar el servidor Rails en Docker
# Uso: ./start-server.sh

# Desactivar conversión de rutas de Git Bash para Docker
export MSYS_NO_PATHCONV=1

# Obtener la ruta actual en formato Windows
WIN_PATH=$(pwd -W)

# Conectarse a la misma red Docker que PostgreSQL y Redis
docker run --rm -it \
  -v "${WIN_PATH}:/rails" \
  -w /rails \
  -p 3000:3000 \
  --network training_app_app-network \
  -e RAILS_ENV=development \
  -e DB_HOST=training_app-postgres-training-1 \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=training_app_development \
  -e REDIS_URL=redis://training_app-redis-training-1:6379/0 \
  training_app-web \
  bundle exec rails server -b 0.0.0.0

