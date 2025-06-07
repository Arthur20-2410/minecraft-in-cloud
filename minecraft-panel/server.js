const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
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

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Minecraft panel live at http://localhost:${PORT}`);
});

