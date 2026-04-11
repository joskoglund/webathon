'use client';

import { ChatMessage, StudentEvent } from '@/types/events';
import { supabase } from "@/lib/supabase";

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

const JOINED_EVENTS_KEY = 'joinedEvents';

type JoinedEventRecord = {
  eventId: number;
  registrationId: number;
  name: string;
};

function getStoredJoinedEvents(): JoinedEventRecord[] {
  if (globalThis.window === undefined) return [];

  try {
    const stored = globalThis.window.localStorage.getItem(JOINED_EVENTS_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is JoinedEventRecord =>
            typeof value === 'object' &&
            value !== null &&
            'eventId' in value &&
            'registrationId' in value &&
            'name' in value &&
            typeof value.eventId === 'number' &&
            typeof value.registrationId === 'number' &&
            typeof value.name === 'string'
        )
      : [];
  } catch {
    return [];
  }
}

function setStoredJoinedEvents(joinedEvents: JoinedEventRecord[]) {
  if (globalThis.window === undefined) return;
  globalThis.window.localStorage.setItem(JOINED_EVENTS_KEY, JSON.stringify(joinedEvents));
}

function getCurrentUserName(): string {
  if (globalThis.window === undefined) return 'Anonymous';

  return globalThis.window.localStorage.getItem('userName') || 'Anonymous';
}

export function isEventJoinedLocally(eventId: number): boolean {
  return getStoredJoinedEvents().some((joinedEvent) => joinedEvent.eventId === eventId);
}

export function getJoinedEventRegistrationId(eventId: number): number | null {
  const joinedEvent = getStoredJoinedEvents().find((record) => record.eventId === eventId);
  return joinedEvent?.registrationId ?? null;
}

export function storeJoinedEventLocally(eventId: number, registrationId: number, name: string) {
  const current = getStoredJoinedEvents();
  if (!current.some((record) => record.eventId === eventId)) {
    setStoredJoinedEvents([...current, { eventId, registrationId, name }]);
  }
}

export function removeJoinedEventLocally(eventId: number) {
  const current = getStoredJoinedEvents();
  setStoredJoinedEvents(current.filter((record) => record.eventId !== eventId));
}

async function updateAttendeeCount(eventId: number, delta: number) {
  const { data, error: fetchError } = await supabase
    .from('events')
    .select('attendeeCount')
    .eq('id', eventId)
    .single();

  if (fetchError) {
    console.error('Failed to load attendee count:', fetchError.message);
    return false;
  }

  const nextCount = Math.max(0, (data?.attendeeCount ?? 0) + delta);

  const { error: updateError } = await supabase
    .from('events')
    .update({ attendeeCount: nextCount })
    .eq('id', eventId);

  if (updateError) {
    console.error('Failed to update attendee count:', updateError.message);
    return false;
  }

  return true;
}

export async function joinEvent(eventId: number): Promise<boolean> {
  const name = getCurrentUserName();

  const { data: registration, error: registrationError } = await supabase
    .from('eventRegistration')
    .insert({
      event: eventId,
      name,
    })
    .select('id')
    .single();

  if (registrationError) {
    console.error('Failed to join event:', registrationError.message);
    return false;
  }

  const countUpdated = await updateAttendeeCount(eventId, 1);
  if (!countUpdated) {
    return false;
  }

  const registrationId = registration?.id;

  if (typeof registrationId !== 'number') {
    console.error('Failed to store join locally: registration id missing from insert response.');
    return false;
  }

  storeJoinedEventLocally(eventId, registrationId, name);
  return true;
}

export async function leaveEvent(eventId: number): Promise<boolean> {
  const registrationId = getJoinedEventRegistrationId(eventId);

  if (registrationId === null) {
    console.error('Failed to leave event: no stored registration id found.');
    return false;
  }

  const { error: deleteError } = await supabase
    .from('eventRegistration')
    .delete()
    .eq('id', registrationId);

  if (deleteError) {
    console.error('Failed to leave event:', deleteError.message);
    return false;
  }

  const countUpdated = await updateAttendeeCount(eventId, -1);
  if (!countUpdated) {
    return false;
  }

  removeJoinedEventLocally(eventId);
  return true;
}