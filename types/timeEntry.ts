// Data model for time entries
export type TimeEntry = {
  id: string;
  userId: string;
  userName: string;
  clientName: string;
  projectName: string;
  description: string;
  date: string; // YYYY-MM-DD format
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  durationMinutes: number;
};

// Calendar event type for react-native-big-calendar
export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  color?: string;
};
