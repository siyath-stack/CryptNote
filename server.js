// server.js - CryptNote Backend Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data and serve static files from /public
app.use(express.json());
app.use(express.static('public'));

// Master password and server-side storage for diary entries
const MASTER_PASSWORD = "mysecretpassword";
let diaryEntries = [
  {
    id: 1,
    timestamp: "2026-10-20 09:00 AM",
    content: "Welcome to CryptNote! Your diary entries are stored securely on the server."
  }
];

// Helper function to format entry timestamps
function formatTimestamp(date = new Date()) {
  return date.toISOString().replace('T', ' ').substring(0, 16);
}

// Route 1: Validate master password
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === MASTER_PASSWORD) {
    res.json({ success: true, message: "Access granted" });
  } else {
    res.status(401).json({ success: false, message: "Incorrect password" });
  }
});

// Route 2: Get diary entries (Server-side password check)
app.get('/api/entries', (req, res) => {
  const { password } = req.headers;
  if (password === MASTER_PASSWORD) {
    res.json({ success: true, entries: diaryEntries });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
});

// Route 3: Submit a new entry
app.post('/api/entries', (req, res) => {
  const { password, content } = req.body;
  if (password !== MASTER_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: "Entry cannot be empty" });
  }

  const newEntry = {
    id: diaryEntries.length + 1,
    timestamp: formatTimestamp(),
    content: content.trim()
  };

  diaryEntries.unshift(newEntry);
  res.json({ success: true, entry: newEntry });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = { formatTimestamp };