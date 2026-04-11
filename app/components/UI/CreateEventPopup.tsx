'use client';

import { type SyntheticEvent, useMemo, useState } from 'react';
import { StudentEvent } from '@/types/events';

interface CreateEventPopupProps {
  open: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
  onRepositionPin: () => void;
  onCreate: (event: StudentEvent) => Promise<void> | void;
}

type EventCategory = StudentEvent['category'];

const CATEGORIES: EventCategory[] = ['Study', 'Sports', 'Social', 'Volunteer'];

const categoryStyles: Record<EventCategory, string> = {
  Sports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Volunteer: 'bg-blue-100 text-blue-700 border-blue-200',
  Study: 'bg-purple-100 text-purple-700 border-purple-200',
  Social: 'bg-amber-100 text-amber-700 border-amber-200',
};

function formatDateTimeLocal(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function CreateEventPopup({
  open,
  latitude,
  longitude,
  onClose,
  onRepositionPin,
  onCreate,
}: Readonly<CreateEventPopupProps>) {
  const now = useMemo(() => new Date(), [open]);
  const oneHourLater = useMemo(() => new Date(now.getTime() + 60 * 60 * 1000), [now]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Study');
  const [startTime, setStartTime] = useState(formatDateTimeLocal(now));
  const [endTime, setEndTime] = useState(formatDateTimeLocal(oneHourLater));
  const [maxAttendees, setMaxAttendees] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Start and end time must be valid dates.');
      return;
    }

    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    if (maxAttendees < 1) {
      setError('Max attendees must be at least 1.');
      return;
    }

    setError(null);

    try {
      setIsSubmitting(true);

      await onCreate({
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        latitude,
        longitude,
        category,
        startTime: start,
        endTime: end,
        attendeeCount: 0,
        maxAttendees,
        checkInRadius: 50,
      });

      setTitle('');
      setDescription('');
      setCategory('Study');
      setStartTime(formatDateTimeLocal(new Date()));
      setEndTime(formatDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)));
      setMaxAttendees(10);
      onClose();
    } catch {
      setError('Unable to save event right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Student Event</h2>
            <p className="text-xs text-slate-500">
              Location: {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 placeholder:text-slate-500 placeholder:font-medium outline-none focus:border-indigo-500"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 placeholder:text-slate-500 placeholder:font-medium outline-none focus:border-indigo-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Event type</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${categoryStyles[category]}`}
              >
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Max people</p>
              <input
                type="number"
                min={1}
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 placeholder:text-slate-500 placeholder:font-medium outline-none focus:border-indigo-500"
                placeholder="Max attendees"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Start date</p>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">End date</p>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onRepositionPin}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Place pin again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {isSubmitting ? 'Saving...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
