import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react'; // Changed Cross to X for a standard look
import { StudentEvent, ChatMessage } from '@/types/events';
import { getEventChat } from '../Event/EventGetter';
import ChatInput from './ChatInput';

interface ChatWindowProps {
    event: StudentEvent;
    userName: string; // Changed String to string (TS best practice)
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ event, userName, onClose }) => {
    const [chats, setChats] = useState<ChatMessage[] | []>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      (async () => {
        const dbChats = await getEventChat(event.id);
        setChats(dbChats);
      })();
    }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white z-[1010] absolute left-0 top-0 transition-all duration-300 ease-in-out shadow-2xl">
      
      {/* --- Header --- */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{event.title}</h1>
            <p className="text-xs text-slate-500">Logged in as {userName}</p>
          </div>
          
          {/* CLOSE BUTTON */}
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* --- Message List --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
        {chats.length > 0 ? (
          chats.map((chat: ChatMessage) => (
            <div
              key={chat.id}
              className="w-full flex items-start p-4 gap-3 border-b border-slate-50 last:border-0 bg-white"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {chat.avatarUrl ? (
                  <img 
                    src={chat.avatarUrl} 
                    alt={chat.userName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
                    {chat.userName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-slate-900 text-sm">
                    {chat.userName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {chat.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
    
    <ChatInput onSendMessage={(text) => console.log("Save to Supabase:", text)} />    </div>
  );
};

export default ChatWindow;