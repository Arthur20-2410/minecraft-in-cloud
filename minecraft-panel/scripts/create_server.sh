#!/bin/bash

SERVER_DIR=~/minecraft-server
JAR_URL="https://piston-data.mojang.com/v1/objects/e6ec2f64e6080b9b5d9b471b291c33cc7f509733/server.jar"
JAR_FILE="$SERVER_DIR/server.jar"

echo "📁 Creating server directory at $SERVER_DIR..."
mkdir -p "$SERVER_DIR"
cd "$SERVER_DIR" || exit 1

echo "🌐 Downloading Minecraft server jar..."
curl -o server.jar "$JAR_URL"

java -Xmx512M -Xms512M -jar server.jar nogui

echo "✅ Accepting EULA..."
echo "eula=true" > eula.txt

java -Xmx512M -Xms512M -jar server.jar nogui &

echo "✅ Minecraft server setup complete in $SERVER_DIR and Server is running !"

