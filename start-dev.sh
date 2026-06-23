#!/bin/bash
ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="$ROOT/.tools/node-v22.16.0-darwin-arm64/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js no encontrado."
  echo "   Instálalo desde https://nodejs.org"
  exit 1
fi

cd "$ROOT"

# Detener servidor anterior si existe
if lsof -ti :3000 >/dev/null 2>&1; then
  echo "🔄 Deteniendo servidor anterior en puerto 3000..."
  kill $(lsof -ti :3000) 2>/dev/null
  sleep 1
fi

if [ ! -d node_modules ]; then
  echo "📦 Instalando dependencias..."
  npm install
fi

echo "🚀 Iniciando WIA Instagram Growth OS..."
echo "   → http://localhost:3000"
echo ""
npm run dev
