// server.js - CryptNote Backend Server with Local JSON Persistence
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'entries.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

const MASTER_PASSWORD = "mysecretpassword";

// Helper function: Load entries from entries.json (or initialize default if file doesn't exist)
function loadEntriesFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading entries file:", err);
  }
  
  // Default entry if file is missing/new
  return [
    {
      id: 1,
      timestamp: "2026-10-20 09:00",
      content: "Welcome to CryptNote! Your diary entries are now permanently saved to file."
    }
  ];
}

// Helper function: Save entries array to entries.json
function saveEntriesToFile(entries) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving entries to file:", err);
  }
}

// Load saved entries on server start
let diaryEntries = loadEntriesFromFile();

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

// Route 2: Get diary entries
app.get('/api/entries', (req, res) => {
  const { password } = req.headers;
  if (password === MASTER_PASSWORD) {
    res.json({ success: true, entries: diaryEntries });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
});

// Route 3: Submit a new entry and persist it to entries.json
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
  saveEntriesToFile(diaryEntries); // Save permanently to JSON file

  res.json({ success: true, entry: newEntry });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { formatTimestamp };