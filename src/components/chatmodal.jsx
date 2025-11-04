import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import MessageBubble from "./messagebubble.jsx";

export default function ChatModal({
  onClose,
  messages,
  onSendMessage,
  chatInput,
  setChatInput,
  addBotReply, // ฟังก์ชันใหม่
}) {
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage();
    setTimeout(() => addBotReply(), 1200 + Math.random() * 1500); // ตอบกลับหลัง 1.2–2.7 วิ
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#0f0c1f] overflow-hidden z-50"
      onClick={onClose}
    >
      {/* 🔮 Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(135deg,_#6e79ff_0%,_#b38bfa_40%,_#f1b8ff_100%)] opacity-20 blur-3xl"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* 🪞 Chat Container */}
      <div
        className="relative w-[380px] h-[70vh] rounded-2xl bg-[#151227]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(134,104,255,0.25)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            💭 Someone
          </div>
          <button
            onClick={onClose}
            className="text-purple-300/80 hover:text-pink-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={chatBodyRef}
          className="flex-1 p-4 space-y-3 overflow-y-auto text-sm text-violet-100"
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <MessageBubble
                message={{
                  id: 0,
                  sender: "hamster",
                  text: "It’s quiet again tonight.",
                }}
              />
            </motion.div>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-white/5"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Say something in the quiet..."
            className="flex-1 bg-transparent text-sm text-violet-200 placeholder-violet-300/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 transition shadow-[0_0_10px_rgba(168,85,247,0.5)] disabled:opacity-40"
          >
            <Send size={16} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
