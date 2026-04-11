import React, { useState } from 'react';
import { MessageSquare, Search, Settings, User, Plus } from 'lucide-react';
import eventsData from '@/public/testEvents.json';
import chatData from '@/public/testChatData.json';
import { StudentEvent, ChatMessage } from '@/types/events';

interface ChatWindowProps {
    event: StudentEvent,
    userName: String
    open: boolean,
}



const ChatWindow: React.FC<ChatWindowProps> = ( {event, userName, open} ) => {
  const [activeTab, setActiveTab] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const chats: ChatMessage[] = chatData;

  return (
    <div className="flex flex-col h-screen w-80 border-r border-slate-200 bg-white z-[1000] absolute left-0 top-0">
      {/* --- Header --- */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800">Events</h1>
        </div>
      </div>

        {/* --- Message List --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatData.map((chat: ChatMessage) => (
            <button
            key={chat.id}
            className="w-full flex items-center p-4 gap-3 transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0"
            >
            {/* Avatar Circle */}
            <div className="relative flex-shrink-0">
                {chat.avatarUrl ? (
                <img 
                    src={chat.avatarUrl} 
                    alt={chat.userName} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                />
                ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
                    {chat.userName.charAt(0)}
                </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900 truncate">
                    {chat.userName}
                </span>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                    {/* Formats the ISO string or simple time string */}
                    {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                </div>
                <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 truncate mr-2">
                    {chat.message}
                </p>
                {/* Optional: Add a tag for the eventId if you want to distinguish events */}
                <span className="text-[10px] bg-slate-100 text-slate-400 px-1 rounded">
                    {chat.eventId.split('_').pop()}
                </span>
                </div>
            </div>
            </button>
        ))}
        </div>
    </div>
  );
};

export default ChatWindow;