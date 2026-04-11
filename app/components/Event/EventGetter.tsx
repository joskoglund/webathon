'use client';

import { ChatMessage, StudentEvent } from '@/types/events';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
); 

export async function getMapEvents(): Promise<StudentEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, latitude, longitude, category')
    .gt('endTime', new Date().toISOString());

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

export async function getSidebarEvents(): Promise<StudentEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, category, startTime, endTime, attendeeCount, maxAttendees')
    .gt('endTime', new Date().toISOString());

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

export async function createEvent(newEvent: StudentEvent): Promise<StudentEvent | null> {
  const { error } = await supabase
    .from('events')
    .insert({
      title: newEvent.title,
      description: newEvent.description,
      latitude: newEvent.latitude,
      longitude: newEvent.longitude,
      category: newEvent.category,
      startTime: newEvent.startTime.toISOString(),
      endTime: newEvent.endTime.toISOString(),
      attendeeCount: 0,
      maxAttendees: newEvent.maxAttendees,
    });

  if (error) {
    console.error('Failed to create event:', error.message);
    return null;
  }

  return newEvent;
}

export async function getEventChat(eventId : number): Promise<ChatMessage[] | []> {
  const { data, error } = await supabase
    .from('chatMessages')
    .select('id, userName, eventID, message, time')
    // Filter for the specific eventId
    .eq('eventID', eventId) 
    // Optional: Sort by time so the chat is in order
    .order('time', { ascending: true });

  if (error) {
    console.error('Failed to fetch messages:', error.message);
    return [];
  }

  // Ensure data exists, otherwise return empty array
  return (data ?? []) as ChatMessage[];
}
export async function createChatMessage(eventID : number, userName : string, message : string): Promise<(string | null)> {
  const { error } = await supabase
    .from('chatMessages')
    .insert({
      eventID: eventID,
      userName: userName,
      message: message
    });

  if (error) {
    console.error('Failed to send message:', error.message);
    return null;
  }

  return message;
}