import React, { useEffect, useState } from 'react';
import { MessageSquare, Search, Settings, User, Plus, Menu, ChevronLeft } from 'lucide-react';
import { StudentEvent, ChatMessage } from '@/types/events';
import { getSidebarEvents } from '../Event/EventGetter';

interface sidebarProps {
  onOpenChat: (event: StudentEvent) => void;

}
const JoinedEventsSidebar: React.FC<sidebarProps> = ( {onOpenChat}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Control visibility
  const [events, setEvents] = useState<StudentEvent[]>([]);


    useEffect(() => {
      (async () => {
        const dbEvents = await getSidebarEvents();
        setEvents(dbEvents);
      })();
    }, []);

  return (
    <>
    {/* --- Toggle Button (Visible when sidebar is closed) --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="absolute top-4 left-4 z-[1001] p-3 bg-white border border-slate-200 rounded-lg shadow-md hover:bg-slate-50 text-slate-600 transition-all"
        >
          <Menu size={24} />
        </button>
      )}
      {/* --- Sidebar Container --- */}
      <div className={`
        flex flex-col h-screen w-80 border-r border-slate-200 bg-white z-[1000] absolute left-0 top-0 
        transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
    <div className="flex flex-col h-screen w-80 border-r border-slate-200 bg-white z-[1000] absolute left-0 top-0">
      {/* --- Header --- */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-800">Events</h1>
          {/* RETRACT BUTTON */}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Event List --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {events && events.length > 0 ? (
          events.map((event) => (
            <button
              key={event.id}
              onClick={() => onOpenChat(event)}
              className="w-full flex items-center p-4 gap-3 transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0"
            >
              {/* Avatar Circle */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold border border-slate-200">
                  {event.title.charAt(0)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900 truncate">{event.title}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 truncate mr-2">{event.description}</p>
                </div>
              </div>
            </button>
          ))
        ) : (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={24} />
            </div>
            <p className="text-slate-500 font-medium">No events found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search or create a new event.</p>
          </div>
        )}
      </div>
      {/* --- Bottom Navigation --- */}
      <div className="p-4 border-t border-slate-100 flex justify-around text-slate-500">
        <button className="hover:text-indigo-600 transition-colors">
          <MessageSquare size={22} />
        </button>
        <button className="hover:text-indigo-600 transition-colors">
          <User size={22} />
        </button>
        <button className="hover:text-indigo-600 transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </div>
    </div>
    </>
  );
};

export default JoinedEventsSidebar;