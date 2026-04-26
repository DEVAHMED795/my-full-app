// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@libsql/client");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["https://my-full-app-2ujc.vercel.app", "http://localhost:5173"],
  credentials: true
}));

// Function to create the table if it doesn't exist
async function setupDatabase() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Cloud database table is ready.");
    } catch (err) {
        console.error("❌ Error setting up cloud database:", err);
    }
}
setupDatabase();

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// POST - Save message (FIXED BigInt issue)
app.post("/api/data", async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required." });
    }

    try {
        const result = await db.execute({
            sql: "INSERT INTO messages (name, message) VALUES (?, ?)",
            args: [name, message],
        });
        // Convert BigInt to Number
        const id = Number(result.lastInsertRowid);
        res.json({ success: true, id: id, name, message });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to save message." });
    }
});

// GET - All messages (FIXED BigInt issue)
app.get("/api/messages", async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM messages ORDER BY created_at DESC");
        // Convert any BigInt values to Numbers
        const rows = result.rows.map(row => ({
            ...row,
            id: Number(row.id)
        }));
        res.json(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to fetch messages." });
    }
});

// DELETE - Remove message (FIXED BigInt issue)
app.delete("/api/messages/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.execute({
            sql: "DELETE FROM messages WHERE id = ?",
            args: [id],
        });
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Message not found." });
        }
        res.json({ success: true, id: parseInt(id) });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete message." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
