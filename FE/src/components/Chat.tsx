import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api";

export default function Chat() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Auto scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const onSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    const newHistory = [...history, { role: "user", content: msg }];
    setHistory(newHistory);
    setLoading(true);
    try {
      const { reply } = await sendMessage(msg, newHistory);
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
    } catch (e) {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: `⚠️ Lỗi: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 🟧 Header */}
      <header
        style={{
          background: "linear-gradient(90deg,#f97316,#fb923c)",
          padding: "18px 24px",
          color: "white",
          fontWeight: 700,
          fontSize: "22px",
          textAlign: "center",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        🏺 GoMii AI Stylist – Trợ Lý Tư Vấn Thiết Kế Gốm
      </header>

      {/* 💬 Chat area */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          scrollBehavior: "smooth",
        }}
      >
        {/* Gợi ý ban đầu */}
        {history.length === 0 && (
          <div
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "15px",
            }}
          >
            💡 Hãy mô tả phong cách bạn muốn:
            <br />
            Ví dụ: <i>“Mình muốn bình hoa cao 25cm phong cách tối giản...”</i>
          </div>
        )}

        {/* Tin nhắn */}
        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                backgroundColor:
                  msg.role === "user" ? "#f97316" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#111827",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  color: msg.role === "user" ? "#fff" : "#f97316",
                }}
              >
                {msg.role === "user" ? "Bạn" : "GoMii AI 🏺"}
              </div>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Trạng thái đang xử lý */}
        {loading && (
          <div
            style={{
              color: "#9ca3af",
              fontStyle: "italic",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            GoMii AI đang suy nghĩ...
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* 🧡 Input area */}
      <footer
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "10px",
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "20px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "15px",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#f97316")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
        <button
          onClick={onSend}
          disabled={loading}
          style={{
            background: loading
              ? "#fbbf24"
              : "linear-gradient(90deg,#f97316,#fb923c)",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "20px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "15px",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(249,115,22,0.3)",
          }}
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </footer>
    </div>
  );
}
