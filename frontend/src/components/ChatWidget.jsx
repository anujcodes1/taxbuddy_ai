import { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import { sendChatMessage } from "../api";

// A small floating chat bubble that appears on every page (bottom-right corner).
// Clicking it opens a mini chat window so users can ask quick questions
// without leaving the page they're on.
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm TaxBuddy AI. Ask me anything about Indian Income Tax." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't reach the server. Please make sure the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-card-hover flex flex-col overflow-hidden mb-3 border border-navy/10">
          {/* Header */}
          <div className="bg-navy text-cream px-4 py-3 flex justify-between items-center">
            <span className="font-heading font-semibold text-sm">TaxBuddy AI Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll p-3 space-y-3 bg-cream/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-navy text-cream ml-auto rounded-br-sm"
                    : "bg-white text-navy-dark border border-navy/10 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-xs text-navy/50 italic">TaxBuddy AI is typing...</div>}
          </div>

          {/* Input box */}
          <div className="flex items-center gap-2 p-3 border-t border-navy/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about tax slabs, HRA, 80C..."
              className="flex-1 text-sm border border-navy/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
            />
            <button
              onClick={handleSend}
              className="bg-saffron text-navy-dark p-2 rounded-lg hover:bg-gold transition-colors"
              aria-label="Send message"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-saffron text-navy-dark w-14 h-14 rounded-full shadow-card-hover flex items-center justify-center text-xl hover:bg-gold transition-colors"
        aria-label="Toggle TaxBuddy AI chat"
      >
        {open ? <FaTimes /> : <FaCommentDots />}
      </button>
    </div>
  );
}

export default ChatWidget;
