import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage(''); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-slate-100 bg-white">
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none px-3 py-1.5 text-sm outline-none text-slate-700 placeholder:text-slate-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2 rounded-lg transition-all ${
            message.trim() 
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}