#!/bin/bash

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Usage: ./redeploy.sh <backup_file.tar.gz>"
  exit 1
fi

echo "🛑 Stopping current server..."
pm2 stop minecraft-panel

echo "🧹 Removing current directories..."
rm -rf ~/minecraft-panel ~/minecraft-server

echo "📦 Extracting backup..."
tar -xzf $BACKUP_FILE -C ~/

echo "🚀 Restarting server..."
cd ~/minecraft-panel
pm2 start server.js --name minecraft-panel

echo "✅ Redeployment complete."

