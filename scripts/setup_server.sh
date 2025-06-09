#!/bin/bash

echo "🔧 Updating system..."
sudo apt update && sudo apt upgrade -y

echo "🔧 Installing Node.js and npm..."
sudo apt install -y nodejs npm

echo "🔧 Installing Apache2..."
sudo apt install -y apache2

echo "🔧 Installing PM2..."
sudo npm install -g pm2

echo "🔧 Setting up Apache reverse proxy..."
sudo a2enmod proxy proxy_http
sudo tee /etc/apache2/sites-available/000-default.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName minecraftincloud.com
    ServerAlias www.minecraftincloud.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

echo "🔧 Restarting Apache..."
sudo systemctl restart apache2

echo "🚀 Starting Node.js app with PM2..."
cd ~/minecraft-panel
pm2 start server.js --name minecraft-panel
pm2 startup
pm2 save

echo "✅ Server setup complete."
