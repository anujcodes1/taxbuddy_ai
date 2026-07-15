import { useState, useRef, useEffect } from "react";
import { FaLandmark, FaUser, FaPaperPlane, FaPlus } from "react-icons/fa";
import { sendChatMessage } from "../api";

// Example prompts shown on the empty/welcome screen, like ChatGPT's suggestion chips
const SUGGESTED_PROMPTS = [
  "What is the tax slab under the new regime?",
  "How much HRA exemption can I claim?",
  "Which ITR form should I file?",
  "What is Section 80C?",
];

// A single chat bubble row — full width, with an avatar and alternating background,
// similar to how ChatGPT lays out its conversation.
function MessageRow({ sender, text }) {
  const isBot = sender === "bot";
  return (
    <div className={`w-full ${isBot ? "bg-white" : "bg-cream/50"}`}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4 sm:px-6 py-6">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${
            isBot ? "bg-navy text-cream" : "bg-saffron text-navy-dark"
          }`}
        >
          {isBot ? <FaLandmark size={13} /> : <FaUser size={12} />}
        </div>
        <div className="text-sm text-navy-dark leading-relaxed whitespace-pre-wrap pt-1">
          {text}
        </div>
      </div>
    </div>
  );
}

// Three bouncing dots shown while the assistant is "typing"
function TypingIndicator() {
  return (
    <div className="w-full bg-white">
      <div className="max-w-3xl mx-auto flex gap-4 px-4 sm:px-6 py-6">
        <div className="w-8 h-8 rounded-full bg-navy text-cream flex items-center justify-center shrink-0">
          <FaLandmark size={13} />
        </div>
        <div className="flex items-center gap-1 pt-3">
          <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the bottom whenever a new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-grow the textarea as the user types (like ChatGPT's input box)
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const data = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't reach the server. Please make sure the backend is running and your Gemini API key is set.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends the message, Shift+Enter adds a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white">
      {/* Minimal top bar */}
      <div className="border-b border-navy/10 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FaLandmark className="text-navy" />
          <h1 className="font-heading font-semibold text-navy-dark text-sm">TaxBuddy AI Chat</h1>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs font-medium text-navy border border-navy/20 px-3 py-1.5 rounded-lg hover:bg-navy/5 transition-colors"
        >
          <FaPlus size={10} /> New Chat
        </button>
      </div>

      {/* Message area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
        {messages.length === 0 ? (
          // Welcome / empty state
          <div className="h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-navy text-cream flex items-center justify-center text-2xl mb-4">
              <FaLandmark />
            </div>
            <h2 className="text-xl font-heading font-semibold text-navy-dark mb-2">
              Namaste! I'm TaxBuddy AI
            </h2>
            <p className="text-sm text-navy/60 max-w-md mb-6">
              Ask me anything about Indian Income Tax — slabs, deductions, HRA, regimes, or ITR filing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTED_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-sm text-left text-navy-dark border border-navy/15 rounded-xl px-4 py-3 hover:bg-navy/5 hover:border-navy/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageRow key={i} sender={msg.sender} text={msg.text} />
            ))}
            {loading && <TypingIndicator />}
          </>
        )}
      </div>

      {/* Bottom input bar, pinned to the bottom of the chat container */}
      <div className="border-t border-navy/10 px-4 sm:px-6 py-4 shrink-0 bg-white">
        <div className="max-w-3xl mx-auto flex items-end gap-3 border border-navy/20 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-saffron">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message TaxBuddy AI..."
            className="flex-1 resize-none text-sm text-navy-dark focus:outline-none py-1.5 max-h-40"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-navy text-cream p-2.5 rounded-xl hover:bg-navy-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <FaPaperPlane size={13} />
          </button>
        </div>
        <p className="text-center text-[11px] text-navy/40 mt-2">
          TaxBuddy AI can make mistakes. Please verify important information on incometax.gov.in.
        </p>
      </div>
    </div>
  );
}

export default Chatbot;
