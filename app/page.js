"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Add message to chat
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  // ✅ Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage("user", input);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok || !data.reply) {
        throw new Error("Failed response");
      }

      addMessage("bot", data.reply);

    } catch (error) {
      console.error(error);
      addMessage("bot", "Something went wrong");
    }

    setInput("");
  };

  // ✅ Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", background: "#0b1220", minHeight: "100vh", color: "white" }}>
      <h1>Cortex AI</h1>

      <div style={{ marginTop: "20px", minHeight: "300px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                background: msg.role === "user" ? "#3b82f6" : "#1f2937",
                padding: "10px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}