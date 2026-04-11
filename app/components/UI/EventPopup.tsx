import React from 'react';
import { Users, MessageSquare, Calendar, Flame } from 'lucide-react';
import { StudentEvent } from '@/types/events';

interface EventPopupProps {
  event: StudentEvent;
  onJoin?: (id: number) => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onJoin }) => {
  // Logic to determine colors based on category
  const categoryStyles = {
    Sports: "bg-emerald-100 text-emerald-700",
    Study: "bg-blue-100 text-blue-700",
    Social: "bg-purple-100 text-purple-700",
    Volunteer: "bg-amber-100 text-amber-700",
  };

  return (
    /* Note: Leaflet popups have their own padding, so w-64 is a safe width */
    <div className="w-64 p-0 font-sans antialiased">
      {/* Category Tag & Heat Indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryStyles[event.category]}`}>
          {event.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 leading-tight">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={14} className="shrink-0" />
          <span className="truncate">{event.startTime.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Users size={14} className="shrink-0" />
          <span>
            {event.attendeeCount} / {event.maxAttendees} 
            <span className="ml-1 text-slate-400 text-[11px]">joined</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
        "{event.description}"
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => onJoin?.(event.id)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
        >
          Join Event
        </button>
        <button className="flex items-center justify-center w-10 h-8 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
          <MessageSquare size={16} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-medium">Click pin for details</span>
        <div className="flex -space-x-2">
          {/* Avatar placeholders using different shades of gray for variety */}
          <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-300" />
          <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-400" />
          <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default EventPopup;