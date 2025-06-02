const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const { Server } = require('socket.io');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'minecraft-cloud',
  resave: false,
  saveUninitialized: true
}));

// --- Routes ---

// Serve login page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'letmein') {
    req.session.loggedIn = true;
    res.redirect('/panel.html');
  } else {
    res.send('❌ Invalid login. Please try again.');
  }
});

// Protect panel.html
app.get('/panel.html', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'panel.html'));
  } else {
    res.redirect('/');
  }
});

// Optional: logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// --- Socket.IO logic ---
let mcProcess = null;

io.on('connection', (socket) => {
  console.log('✅ WebSocket client connected');

  socket.on('start-server', () => {
    if (!mcProcess) {
      // Adjust this path if start.sh is elsewhere
      mcProcess = spawn('bash', ['start.sh'], {
        cwd: '/home/ubuntu/minecraft-panel' // or '/home/ubuntu/minecraft-server'
      });

      socket.emit('console-output', '🔧 Starting Minecraft server...\n');

      mcProcess.stdout.on('data', (data) => {
        socket.emit('console-output', data.toString());
      });

      mcProcess.stderr.on('data', (data) => {
        socket.emit('console-output', `[ERR] ${data.toString()}`);
      });

      mcProcess.on('close', (code) => {
        socket.emit('console-output', `Server stopped (exit code ${code})\n`);
        mcProcess = null;
      });
    } else {
      socket.emit('console-output', '⚠️ Server already running.\n');
    }
  });

  socket.on('stop-server', () => {
    if (mcProcess) {
      mcProcess.kill('SIGINT');
      socket.emit('console-output', '🛑 Stopping server...\n');
      mcProcess = null;
    } else {
      socket.emit('console-output', '⚠️ No server is currently running.\n');
    }
  });
});

app.get('/status', (req, res) => {
  if (mcProcess) {
    res.json({ status: 'running' });
  } else {
    res.json({ status: 'stopped' });
  }
});


// --- Start server ---
server.listen(3000, () => {
  console.log('🟢 Control panel running at http://localhost:3000');
});

