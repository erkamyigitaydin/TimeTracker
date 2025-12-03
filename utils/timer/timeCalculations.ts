import { differenceInMinutes, format } from 'date-fns';
import { TimeEntry } from '../../types/timeEntry';


const CALENDAR_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F59E0B', // amber
  '#10B981', // emerald
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F97316', // orange
];



//Get a color for a time entry based on its position in the day
export function getEntryColor(
  entry: TimeEntry,
  allEntries: TimeEntry[]
): string {
  // Get the date string for grouping
  const dateStr = format(new Date(entry.start), 'yyyy-MM-dd');

  // Get all entries for the same day
  const dayEntries = allEntries
    .filter((e) => format(new Date(e.start), 'yyyy-MM-dd') === dateStr)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Find the index of this entry within the day
  const dayIndex = dayEntries.findIndex((e) => e.id === entry.id);

  return CALENDAR_COLORS[dayIndex % CALENDAR_COLORS.length];
}

//Calculate duration in minutes between start and end dates
export function calculateDuration(startDate: Date, endDate: Date): number {
  return differenceInMinutes(endDate, startDate);
}

//Parse time string (HH:mm) and apply to a date
export function applyTimeToDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours || 0, minutes || 0, 0, 0);
  return result;
}

//Create start and end Date objects from date and time strings
export function createDateRange(
  dateString: string,
  startTime: string,
  endTime: string
): { startDate: Date; endDate: Date } {
  const entryDate = new Date(dateString);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startDate = new Date(entryDate);
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date(entryDate);
  endDate.setHours(endHour, endMinute, 0, 0);

  // If end time is before start time, assume it's next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return { startDate, endDate };
}

//Validate that end time is after start time
export function validateTimeRange(startDate: Date, endDate: Date): boolean {
  return differenceInMinutes(endDate, startDate) > 0;
}

//Format seconds to HH:MM:SS
export function formatDurationSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')}`;
}

//Count entries in a specific month
 
export function countEntriesInMonth(
  entries: TimeEntry[],
  date: Date
): number {
  const currentMonth = format(date, 'yyyy-MM');
  return entries.filter(
    (e) => format(new Date(e.start), 'yyyy-MM') === currentMonth
  ).length;
}
