#!/bin/bash
# Backup world before stopping
~/minecraft-panel/scripts/archive_world.sh

pkill -f "server.jar"

