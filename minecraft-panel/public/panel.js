const socket = io();
const consoleOutput = document.getElementById('console');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const backupSelect = document.getElementById('backupSelect');
const loadBackupBtn = document.getElementById('loadBackupBtn');

// Helper: disable/enable buttons
function setServerRunning(running) {
  if (running) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    startBtn.textContent = "Server is running...";
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    startBtn.textContent = "Start Server";
  }
}

// Load status on page load
fetch('/status')
  .then(res => res.json())
  .then(data => {
    if (data.status === 'running') {
      consoleOutput.textContent += "✅ Server is already running.\n";
      setServerRunning(true);
    } else {
      consoleOutput.textContent += "🟡 Server is not running.\n";
      setServerRunning(false);
    }
  });

// Start server button
if (startBtn) {
  startBtn.onclick = () => {
    socket.emit('start-server');
    consoleOutput.textContent += "🔄 Starting server...\n";
    setServerRunning(true);
  };
}

// Stop server button
if (stopBtn) {
  stopBtn.onclick = () => {
    socket.emit('stop-server');
    consoleOutput.textContent += "🛑 Stopping server...\n";
    setServerRunning(false);
  };
}

// Receive console output
socket.on('console-output', (msg) => {
  consoleOutput.textContent += msg;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
});

// Load list of backups
fetch('/api/backups')
  .then(res => res.json())
  .then(backups => {
    backups.forEach(b => {
      const option = document.createElement('option');
      option.value = b.file;
      option.textContent = b.name;
      backupSelect.appendChild(option);
    });
  });

// Load selected backup
if (loadBackupBtn) {
  loadBackupBtn.onclick = () => {
    const selectedFile = backupSelect.value;
    if (!selectedFile) return;

    consoleOutput.textContent += `🔁 Loading backup: ${selectedFile}\n`;

    fetch(`/api/load-backup?file=${encodeURIComponent(selectedFile)}`)
      .then(res => res.text())
      .then(text => {
        consoleOutput.textContent += text + '\n';
      })
      .catch(err => {
        consoleOutput.textContent += `❌ Error loading backup: ${err.message}\n`;
      });
  };
}

