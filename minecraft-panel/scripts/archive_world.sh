#!/bin/bash

# === CONFIG ===
WORLD_DIR="$HOME/minecraft-server/world"
BACKUP_DIR="$HOME/minecraft-server/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="world_backup_$TIMESTAMP.tar.gz"

# === CREATE BACKUP ===
echo "📦 Creating backup of Minecraft world..."
mkdir -p "$BACKUP_DIR"

# Tar and gzip the world directory
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$WORLD_DIR" .

if [ $? -eq 0 ]; then
  echo "✅ Backup created: $BACKUP_DIR/$ARCHIVE_NAME"
else
  echo "❌ Backup failed!"
  exit 1
fi

