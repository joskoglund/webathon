export interface StudentEvent {
  id: number;
  title: string;
  description: string;
  latitude: number;   // DB column (as provided)
  longitude: number; // DB column
  category: 'Sports' | 'Study' | 'Social' | 'Volunteer';
  startTime: Date;
  endTime: Date;
  attendeeCount: number;
  maxAttendees: number;
  checkInRadius?: number; // usually 50 (meters)
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userName: string;
  avatarUrl?: string;
  time: string;
  message: string;
}