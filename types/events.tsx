export interface StudentEvent {
  id: string;
  title: string;
  coordinates: [number, number]; // [lat, lng]
  category: 'Sports' | 'Study' | 'Social' | 'Volunteer';
  startTime: Date;
  endTime: Date;
  attendeeCount: number;
  checkInRadius: number; // usually 50 (meters)
}
