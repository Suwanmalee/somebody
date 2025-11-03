import React, { useState, useRef, useMemo, useEffect } from 'react';
import { X, PawPrint, Send } from 'lucide-react';
import MessageBubble from './messagebubble.jsx';
// --- (เพิ่มใหม่) Component: ChatModal ---
// Component สำหรับหน้าต่างแชท
export default function ChatModal({ onClose, messages, onSendMessage, chatInput, setChatInput }) {
  const chatBodyRef = useRef(null);

  // ทำให้ scroll ลงล่างสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิด modal เมื่อคลิกข้างใน
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-800">คุยกับ Hamster</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Body */}
        <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <div className="flex flex-col">
            {/* ข้อความต้อนรับ */}
            <MessageBubble message={{ id: 0, text: "Squeak! (Say something!)", sender: "hamster" }} />
            {/* ข้อความจาก state */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Say squeak..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 disabled:opacity-50"
            disabled={!chatInput.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}