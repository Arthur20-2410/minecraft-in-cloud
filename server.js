const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "minecraftSecret",
    resave: false,
    saveUninitialized: true
}));

const users = JSON.parse(fs.readFileSync("users.json"));

// Login handler
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.redirect("/panel.html");
    } else {
        res.send("Login failed.");
    }
});

// Panel route
app.get("/panel.html", (req, res) => {
    if (!req.session.user) return res.redirect("/");
    res.sendFile(__dirname + "/public/panel.html");
});

// Start server route
app.post("/start", (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized");
    exec("bash ./start.sh", (err) => {
        if (err) return res.status(500).send("Start failed");
        res.send("Minecraft server starting...");
    });
});

// Stop server route
app.post("/stop", (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized");
    exec("bash ./stop.sh", (err) => {
        if (err) return res.status(500).send("Stop failed");
        res.send("Minecraft server stopping...");
    });
});

app.listen(PORT, () => {
    console.log(`Control panel running at http://localhost:${PORT}`);
});

