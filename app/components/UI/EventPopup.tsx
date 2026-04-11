import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Calendar } from 'lucide-react';
import { StudentEvent } from '@/types/events';
import { getEvent, isEventJoinedLocally } from '../Event/EventGetter';

interface EventPopupProps {
  eventId: number;
  onJoin?: (id: number) => Promise<boolean> | boolean;
  onContentReady?: () => void;
  onOpenChat: (event: StudentEvent) => void;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isSameCalendarDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

const EventPopup: React.FC<EventPopupProps> = ({ eventId, onJoin, onContentReady, onOpenChat }) => {
  const [event, setEvent] = useState<StudentEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const fetchedEvent = await getEvent(eventId);
      if (active) {
        setEvent(fetchedEvent ?? null);
        setIsJoined(isEventJoinedLocally(eventId));
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (!loading && event) {
      requestAnimationFrame(() => onContentReady?.());
    }
  }, [loading, event, onContentReady]);

  const refreshEvent = async () => {
    const updatedEvent = await getEvent(eventId);
    if (updatedEvent) {
      setEvent(updatedEvent);
    }
  };

  let eventDateLabel = '';
  if (event) {
    eventDateLabel = isSameCalendarDay(event.startTime, event.endTime)
      ? `${formatDateTime(event.startTime)} - ${pad(event.endTime.getHours())}:${pad(event.endTime.getMinutes())}`
      : `${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}`;
  }

  if (loading) return <div className="w-64 p-3 text-sm text-slate-500">Loading event...</div>;
  if (!event) return <div className="w-64 p-3 text-sm text-red-500">Event not found.</div>;


  // Logic to determine colors based on category
  const categoryStyles = {
  Sports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Volunteer: 'bg-blue-100 text-blue-700 border-blue-200',
  Study: 'bg-purple-100 text-purple-700 border-purple-200',
  Social: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    /* Note: Leaflet popups have their own padding, so w-64 is a safe width */
    <div className="w-64 p-0 font-sans antialiased">
      {/* Category Tag */}
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
          <span className="truncate" title={eventDateLabel}>
            {eventDateLabel}
          </span>
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
          onClick={async () => {
            const success = await onJoin?.(event.id);

            if (success === true) {
              const nextJoinedState = !isJoined;
              setIsJoined(nextJoinedState);
              await refreshEvent();
            }
          }}
          className={`flex-1 text-white text-xs font-bold py-2 px-3 rounded shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1 ${isJoined ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isJoined ? 'Leave Event' : 'Join Event'}
        </button>
        <button className="flex items-center justify-center w-10 h-8 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors"
          onClick={() => onOpenChat(event)}
        >
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