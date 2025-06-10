#!/bin/bash

# === CONFIG ===
BACKUP_FILE="$1"  # full path to the backup archive as argument
WORLD_DIR="$HOME/minecraft-server/world"
BACKUP_DIR="$HOME/minecraft-server/backups"
ARCHIVE_DIR="$HOME/minecraft-server/backups/previous_worlds"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# === CHECK BACKUP FILE ===
if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Please provide the full path to the backup archive to load."
  echo "Usage: ./load_backup.sh /full/path/to/world_backup_*.tar.gz"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file does not exist: $BACKUP_FILE"
  exit 1
fi

# === BACKUP CURRENT WORLD ===
echo "🛑 Stopping server before switching worlds..."
pm2 stop minecraft-panel

echo "📁 Saving current world..."
mkdir -p "$ARCHIVE_DIR"
mv "$WORLD_DIR" "$ARCHIVE_DIR/world_backup_$TIMESTAMP"

# === EXTRACT NEW BACKUP ===
echo "📦 Extracting backup..."
mkdir -p "$WORLD_DIR"
tar -xzf "$BACKUP_FILE" -C "$WORLD_DIR"

if [ $? -eq 0 ]; then
  echo "✅ Backup loaded successfully."
else
  echo "❌ Failed to extract backup."
  exit 1
fi

# === RESTART SERVER ===
echo "🚀 Restarting server..."
pm2 start minecraft-panel

echo "✅ World switched. Old world saved at $ARCHIVE_DIR/world_backup_$TIMESTAMP"

