import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://my-full-app-1.onrender.com"; 

function App() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message: msg }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse("Sent!");
        setName("");
        setMsg("");
        fetchMessages();
      } else {
        setResponse("Error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setResponse("Failed to send");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(messages.filter((m) => m.id !== id));
        setResponse("Deleted!");
        setTimeout(() => setResponse(""), 2000);
      } else {
        setResponse("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setResponse("Failed to delete");
    }
  };

  return (
    <div className="app-container">
      <h1> AHMED MADE HIS FIRST LIVE APP</h1>
      
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="input-field"
          placeholder="Your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
        />
        <button className="submit-btn" type="submit">
          Send Message
        </button>
        {response && <div className="status">{response}</div>}
      </form>

      <h2>📨 Saved Messages</h2>
      {messages.length === 0 ? (
        <div className="empty-state">
          No messages yet. Send one above!
        </div>
      ) : (
        <div className="messages-grid">
          {messages.map((m) => (
            <div key={m.id} className="message-card">
              <div className="message-header">
                <span className="message-name">{m.name}</span>
                <span className="message-date">{m.created_at}</span>
              </div>
              <div className="message-text">{m.message}</div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(m.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
