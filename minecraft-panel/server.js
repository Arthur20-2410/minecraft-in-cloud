const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const { exec } = require('child_process');

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'minecraft-in-cloud',
  resave: false,
  saveUninitialized: true,
}));

// Path to users file
const usersFile = path.join(__dirname, 'users.json');
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch (e) {
    console.error('Error reading users.json:', e);
    return [];
  }
};

// LOGIN - POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const match = users.find(u => u.username === username && u.password === password);

  if (match) {
    req.session.user = match.username;
    return res.redirect('/panel.html');
  }

  // Inject error directly into login page
  fs.readFile(path.join(__dirname, 'public', 'login.html'), 'utf8', (err, html) => {
    if (err) return res.status(500).send('Error loading login page');
    const errorMsg = `
      <script>
        setTimeout(() => {
          const err = document.createElement('div');
          err.textContent = '❌ Invalid login. Please try again.';
          err.style.color = 'red';
          err.style.marginTop = '1em';
          document.querySelector('form')?.after(err);
        }, 100);
      </script>
    `;
    res.send(html + errorMsg);
  });
});

// CREATE ACCOUNT - POST
app.post('/create', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  if (users.some(u => u.username === username)) {
    return res.send('❌ Username already exists. Try logging in.');
  }

  // Save new user
  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  // Redirect to login after success
  res.redirect('/login.html');
});

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// STATUS endpoint for panel.js
app.get('/status', (req, res) => {
  exec('pgrep -f server.jar', (err, stdout) => {
    if (stdout.trim()) {
      res.json({ status: 'running' });
    } else {
      res.json({ status: 'stopped' });
    }
  });
});

// SOCKET.IO START/STOP HANDLERS
io.on('connection', (socket) => {
  console.log("✅ WebSocket client connected");

  socket.on('start-server', () => {
    const scriptPath = path.join(__dirname, 'scripts', 'start.sh');
    const child = exec(`bash ${scriptPath}`);

    child.stdout.on('data', data => socket.emit('console-output', data));
    child.stderr.on('data', data => socket.emit('console-output', `[ERR] ${data}`));
    child.on('close', code => socket.emit('console-output', `Server exited with code ${code}\n`));
  });

  socket.on('stop-server', () => {
    const scriptPath = path.join(__dirname, 'scripts', 'stop.sh');
    const child = exec(`bash ${scriptPath}`);

    child.stdout.on('data', data => socket.emit('console-output', data));
    child.stderr.on('data', data => socket.emit('console-output', `[ERR] ${data}`));
    child.on('close', code => socket.emit('console-output', `Stopped (code ${code})\n`));
  });
});

// START SERVER
http.listen(PORT, () => {
  console.log(`✅ Minecraft panel live at http://localhost:${PORT}`);
});

