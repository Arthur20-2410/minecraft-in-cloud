#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups
PROJECT_DIR=~/minecraft-panel
MINECRAFT_DIR=~/minecraft-server

mkdir -p $BACKUP_DIR

echo "🛑 Stopping server for backup..."
pm2 stop minecraft-panel

echo "📦 Backing up project and server..."
tar -czf $BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz $PROJECT_DIR $MINECRAFT_DIR

echo "🚀 Restarting server..."
pm2 start minecraft-panel

echo "✅ Backup complete: $BACKUP_DIR/project_backup_$TIMESTAMP.tar.gz"
