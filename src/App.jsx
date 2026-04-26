import { useState, useEffect } from "react";
const API_URL = "https://my-full-app-1.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch messages from backend when component loads
  const fetchMessages = async () => {
    const res = await fetch(`${API_URL}/api/messages`);
    const data = await res.json();
    setMessages(data);
  };

  // Load messages on first render
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
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
  };

  // Handle form submit (send new message)
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      fetchMessages(); // Refresh the list
    } else {
      setResponse("Error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React + Backend + SQLite</h1>

      {/* Form to send new message */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ margin: "5px", padding: "8px" }}
        />
        <br />
        <textarea
          placeholder="Your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <button type="submit">Send</button>
        <p>{response}</p>
      </form>

      {/* Display list of saved messages */}
      <hr />
      <h2>Saved Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet. Send one!</p>
      ) : (
        messages.map((m) => (
          <div key={m.id} style={{ border: "1px solid #ccc", margin: "10px auto", padding: "10px", width: "300px", textAlign: "left" }}>
            <strong>{m.name}</strong> <small>({m.created_at})</small>
            <p>{m.message}</p>
            <button 
              onClick={() => handleDelete(m.id)} 
              style={{ backgroundColor: "#ff4444", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
