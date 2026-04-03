import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatbotAPI } from "../api";

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AquaSense AI assistant. Ask me anything about irrigation, crops, or weather." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const data = await chatbotAPI.sendMessage(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: data.response || data.message || "I'm not sure about that." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")}>←</button>
        <h1 className="text-xl font-bold">AquaSense AI</h1>
      </nav>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-green-600 text-white rounded-br-sm"
                : "bg-white text-gray-700 shadow rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-400">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t max-w-2xl w-full mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about irrigation, crops..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-700 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}