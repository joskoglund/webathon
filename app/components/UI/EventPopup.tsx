import React from 'react';
import { Users, MapPin, MessageSquare, Calendar, Flame } from 'lucide-react';

const EventPopup: React.FC = () => {
  // Mock data for the demo visuals
  const event = {
    title: "Friday Night Beach Volleyball",
    category: "Sports",
    attendees: 12,
    maxAttendees: 20,
    time: "18:30 - 20:00",
    heatLevel: "High", // Visualizing the heatmap density
    description: "Casual games at the north courts. All skill levels welcome! Bringing a spare ball.",
  };

  return (
    <div className="w-64 p-1 font-sans">
      {/* Category Tag & Heat Indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          {event.category}
        </span>
        <div className="flex items-center gap-1 text-orange-500">
          <Flame size={14} fill="currentColor" />
          <span className="text-xs font-bold">{event.heatLevel} Heat</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 leading-tight">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={14} />
          <span>{event.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Users size={14} />
          <span>{event.attendees} / {event.maxAttendees} Students joined</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 line-clamp-2 italic">
        "{event.description}"
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1">
          Join Event
        </button>
        <button className="flex items-center justify-center w-9 h-8 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
          <MessageSquare size={16} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-medium">Click for full details</span>
        <div className="flex -space-x-2">
           {/* Tiny Avatars Placeholder */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPopup;