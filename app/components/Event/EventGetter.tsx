'use client';

import { StudentEvent } from '@/types/events';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getMapEvents(): Promise<StudentEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, latitude, longitude, category');

  if (error) {
    console.error('Failed to fetch events:', error.message);
    return [];
  }

  const events = (data ?? []) as StudentEvent[];

  console.log(`events recived ${events.at(0)?.title}`);

  return events.map((event) => ({
    ...event,
    startTime: event.startTime ? new Date(event.startTime) : new Date(0),
    endTime: event.endTime ? new Date(event.endTime) : new Date(0),
  }));
}

export async function getEvent(eventId : number): Promise<StudentEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, latitude, longitude, category, startTime, endTime, attendeeCount, maxAttendees')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Failed to fetch events:', error.message);
    return null;
  }

  const event = (data ?? null) as StudentEvent;

  console.log(`event recived ${event?.title}`);

  return {
    ...event,
    startTime: event.startTime ? new Date(event.startTime) : new Date(0),
    endTime: event.endTime ? new Date(event.endTime) : new Date(0),
  };
}