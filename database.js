// server/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create (or connect to) a database file named 'app_data.db' in the server folder
const db = new sqlite3.Database(path.join(__dirname, 'app_data.db'), (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
    // Create a table for messages if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("❌ Error creating table:", err.message);
      } else {
        console.log("✅ Messages table is ready.");
      }
    });
  }
});

module.exports = db;