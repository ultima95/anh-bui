#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
node /app/migrate.js

echo "[entrypoint] Starting Next.js server..."
exec node server.js
