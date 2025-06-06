# Minecraft in the Cloud 
**Live Website:** [https://minecraftincloud.com](https://minecraftincloud.com)

 **Video Explainer:** 

 **Student:** Arthur Faye  
 **Student Number:** 35605248  

---

## Project :

Over the years, I hosted different types of servers on my computer,
including a good number of Minecraft Servers for me and my friends!
As much fun as it was,
these setups often came with frustrating issues.
From my computer going into sleep mode every 12 hours to security concerns because of opening ports on my home network for my friends to access from outside LAN,
hosting from home wasn’t ideal.
This is why this project involves deploying a Minecraft Java Edition multiplayer server on the cloud, using Amazon EC2.
The goal is to have a stable and secure environment where me and some friends can play together in a shared survival world.
By hosting the server in the cloud, we avoid the typical issues of running a server from a home network, such as limited bandwidth, downtime, or exposure to local security risks.

he server will be set up on a Linux-based EC2 instance, with the necessary configuration for port access and resource allocation. The Minecraft server software will be managed manually, allowing full control over gameplay settings and potential mods. The project website  served from the same EC2 instance will be updated when the server will be running to have statistics about the memory usage for example. With Amazon EC2, we can easily upgrade the machine the server runs on to meet the needed power for a few friends.

This project combines fun with functionality, giving me a chance to improve my Linux server skills and learn about AWS cloud infrastructure. The goal is to create a one-year or long-term multiplayer server depending of how good amazon EC2 is to support a minecraft server



---

## Main Website Features

Secure login/logout  
Live server status detection  
Start/Stop buttons (server-safe)  
Real-time server console (Socket.IO)  
HTTPS with Let's Encrypt  
DNS via Namecheap → `minecraftincloud.com`

---

## Stack & Tools

- **Node.js** (Express.js, Socket.IO)
- **Apache2** (reverse proxy for HTTPS)
- **PM2** (process manager for Node)
- **AWS EC2** (Ubuntu 22.04 instance)
- **Certbot + Let's Encrypt** (SSL setup)
- **Namecheap** (domain + DNS A record)
- **Minecraft Java Edition Server**

---

##  Scripts
TO be added


---

## Website Login Details

> Username: `admin`  
> Password: `letmein`  

Accessible only via the web panel. Session-based login required to access `/panel.html`.

---

##  DNS + SSL

- **Domain:** [minecraftincloud.com](https://minecraftincloud.com)
- **DNS Setup:** A record → EC2 public IP
- **SSL/TLS:** Certbot used with Apache reverse proxy
- **Proxy Config:** Apache passes port 80/443 to Node.js on port 3000

---

## Project Structure

```bash
minecraft-panel/
├── public/
│   ├── index.html      # Login page
│   ├── panel.html      # Control panel UI
│   ├── panel.js        # JS logic with socket.io
│   └── style.css       # Shared styling
├── server.js           # Backend Node.js logic
├── start.sh            # Bash script to start Minecraft
├── stop.sh             # Bash script to stop Minecraft
├── users.json          # Credentials file
├── package.json
├── package-lock.json
└── README.md

