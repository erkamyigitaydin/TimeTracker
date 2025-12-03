import { format } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import { CalendarEvent, TimeEntry } from '../../types/timeEntry';
import { countEntriesInMonth } from '../../utils/timer/timeCalculations';

type CalendarMode = 'month' | 'week' | 'day';

interface CalendarViewProps {
  calendarDate: Date;
  calendarMode: CalendarMode;
  userTimeEntries: TimeEntry[];
  calendarEvents: CalendarEvent[];
  onModeChange: (mode: CalendarMode) => void;
  onDateChange: (date: Date) => void;
  onPressEvent: (event: CalendarEvent) => void;
  onPressCell: (date: Date) => void;
}

export default function CalendarView({
  calendarDate,
  calendarMode,
  userTimeEntries,
  calendarEvents,
  onModeChange,
  onDateChange,
  onPressEvent,
  onPressCell,
}: CalendarViewProps) {
  const entryCount = countEntriesInMonth(userTimeEntries, calendarDate);
  const entryText = `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} this month`;

  const modeButtons: { mode: CalendarMode; label: string }[] = [
    { mode: 'day', label: 'Day' },
    { mode: 'week', label: 'Week' },
    { mode: 'month', label: 'Month' },
  ];

  return (
    <>
      {/* Calendar Header */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-between pt-4 pb-3 border-t border-gray-200">
          {/* Month/Year and Entry Count */}
          <View>
            <Text className="text-lg font-bold text-gray-900">
              {format(calendarDate, 'MMMM yyyy')}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">{entryText}</Text>
          </View>

          {/* View Mode Selector */}
          <View className="flex-row gap-1">
            {modeButtons.map(({ mode, label }) => {
              const isActive = calendarMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => onModeChange(mode)}
                  className={`px-3 py-2 rounded-lg ${
                    isActive ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  style={
                    isActive
                      ? {
                          shadowColor: '#3B82F6',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 3,
                          elevation: 3,
                        }
                      : {}
                  }
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View className="flex-1 bg-white">
        <Calendar
          events={calendarEvents}
          height={600}
          mode={calendarMode}
          date={calendarDate}
          onPressEvent={onPressEvent}
          onPressCell={onPressCell}
          onSwipeEnd={onDateChange}
          eventCellStyle={(event) => ({
            backgroundColor: event.color || '#3B82F6',
            borderRadius: 4,
          })}
          swipeEnabled={true}
          showTime={true}
          ampm={false}
          hourStyle={{ color: '#6B7280' }}
          eventMinHeightForMonthView={20}
          scrollOffsetMinutes={480}
          weekStartsOn={1}
        />
      </View>
    </>
  );
}
