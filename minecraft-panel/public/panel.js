const socket = io();
const consoleOutput = document.getElementById('console');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

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

if (startBtn) {
  startBtn.onclick = () => {
    socket.emit('start-server');
    consoleOutput.textContent += "🔄 Starting server...\n";
    setServerRunning(true);
  };
}

if (stopBtn) {
  stopBtn.onclick = () => {
    socket.emit('stop-server');
    consoleOutput.textContent += "🛑 Stopping server...\n";
    setServerRunning(false);
  };
}

socket.on('console-output', (msg) => {
  consoleOutput.textContent += msg;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
});

