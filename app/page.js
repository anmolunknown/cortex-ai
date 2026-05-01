"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // ✅ Load chat from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("chat");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  // ✅ Save chat to localStorage
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const updatedChat = [...chat, userMessage];

    setChat(updatedChat);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: updatedChat }),
      });

      const data = await res.json();

      setChat([...updatedChat, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setChat([
        ...updatedChat,
        { role: "assistant", text: "Something went wrong 😢" },
      ]);
    }

    setLoading(false);
  }

  function clearChat() {
    setChat([]);
    localStorage.removeItem("chat");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cortex AI</h1>

      <button onClick={clearChat} style={styles.clearBtn}>
        Clear Chat
      </button>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#2563eb" : "#1f2937",
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, background: "#1f2937" }}>
            🤖 AI is thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  title: {
    marginBottom: "10px",
  },
  clearBtn: {
    marginBottom: "10px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    width: "120px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    borderRadius: "10px",
    background: "#020617",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "10px",
    maxWidth: "70%",
    whiteSpace: "pre-wrap",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    resize: "none",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};