import Sidebar, { employeeMenuItems } from '@/components/Sidebar';
import CalendarView from '@/components/timer/CalendarView';
import TimeEntryModal from '@/components/timer/TimeEntryModal';
import TimerCard from '@/components/timer/TimerCard';
import { useEmployee } from '@/context/EmployeeContext';
import { useTimeEntries } from '@/context/TimeEntryContext';
import { useTimeEntryActions } from '@/hooks/useTimeEntryActions';
import { useTimer } from '@/hooks/useTimer';
import { CalendarEvent, TimeEntry } from '@/types/timeEntry';
import { getEntryColor } from '@/utils/timer/timeCalculations';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function TimerScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { currentEmployeeId, currentEmployeeName } = useEmployee();

  // Timer hook
  const {
    isTimerActive,
    elapsedSeconds,
    timerStartTime,
    startTimer,
    stopTimer,
    resetTimer,
    continueTimer,
  } = useTimer();

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalStartTime, setModalStartTime] = useState('');
  const [modalEndTime, setModalEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTimerEntry, setIsTimerEntry] = useState(false);

  const { timeEntries } = useTimeEntries();

  const {
    createEntry,
    updateEntryData,
    deleteEntryWithConfirmation,
    discardTimerWithConfirmation,
  } = useTimeEntryActions(currentEmployeeId, currentEmployeeName, resetTimer);

  // Edit state
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  // Calendar view mode
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day'>(
    'week'
  );
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Stop timer and open modal
  const handleStopTimer = () => {
    stopTimer();
    if (timerStartTime) {
      const now = new Date();
      setModalStartTime(format(timerStartTime, 'HH:mm'));
      setModalEndTime(format(now, 'HH:mm'));
      setSelectedDate(timerStartTime);
    } else {
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000);
      setModalStartTime(format(now, 'HH:mm'));
      setModalEndTime(format(end, 'HH:mm'));
      setSelectedDate(now);
    }
    setModalMode('create');
    setEditingEntry(null);
    setIsTimerEntry(true);
    setIsModalVisible(true);
  };

  // Continue timer from modal
  const handleContinueTimer = () => {
    setIsModalVisible(false);
    continueTimer();
  };

  // Discard timer entry (when X button is pressed on timer entry modal)
  const handleDiscardTimer = () => {
    discardTimerWithConfirmation(() => {
      resetTimer();
      setIsModalVisible(false);
    });
  };

  // Save time entry from modal
  const handleSaveEntry = async (data: {
    clientId: string;
    clientName: string;
    projectId: string;
    projectName: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    if (modalMode === 'edit' && editingEntry) {
      const result = await updateEntryData(editingEntry, data);
      if (result.success) {
        setIsModalVisible(false);
        setEditingEntry(null);
      }
    } else {
      const result = await createEntry(data);
      if (result.success) {
        setIsModalVisible(false);
        setModalStartTime('');
        setModalEndTime('');
      }
    }
  };

  // Convert time entries to calendar events
  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      timeEntries.map((entry) => ({
        title: `${entry.description} - ${entry.projectName}`,
        start: new Date(entry.start),
        end: new Date(entry.end),
        id: entry.id,
        color: getEntryColor(entry, timeEntries),
      })),
    [timeEntries]
  );

  // Handle pressing on calendar event
  const handleEventPress = (event: CalendarEvent) => {
    const entry = timeEntries.find((e) => e.id === event.id);
    if (entry) {
      setEditingEntry(entry);
      setModalMode('edit');
      setSelectedDate(new Date(entry.date || entry.start));
      setModalStartTime(format(new Date(entry.start), 'HH:mm'));
      setModalEndTime(format(new Date(entry.end), 'HH:mm'));
      setIsTimerEntry(false);
      setIsModalVisible(true);
    }
  };

  // Handle pressing on empty calendar slot
  const handleCellPress = (date: Date) => {
    // Create a new entry starting at the pressed time
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);
    setEditingEntry(null);
    setModalMode('create');
    setModalStartTime(format(date, 'HH:mm'));
    setModalEndTime(format(endDate, 'HH:mm'));
    setSelectedDate(new Date(date));
    setIsTimerEntry(false);
    setIsModalVisible(true);
  };

  // Delete entry
  const handleDeleteEntry = () => {
    if (!editingEntry) return;

    deleteEntryWithConfirmation(editingEntry, () => {
      setIsModalVisible(false);
      setEditingEntry(null);
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute="timer"
        menuItems={employeeMenuItems}
        userName={currentEmployeeName}
        userRole="Employee"
        avatarColor="bg-blue-500"
      />

      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="px-6 pt-14 pb-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setSidebarOpen(true)}
              className="p-2 -ml-2"
              activeOpacity={0.7}
            >
              <Feather name="menu" size={24} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-gray-900">Time Tracker</Text>

            <View className="w-8" />
          </View>
        </View>
      </View>

      {/* Timer Card Section */}
      <View className="px-6 py-4 bg-white">

        <TimerCard
          isTimerActive={isTimerActive}
          elapsedSeconds={elapsedSeconds}
          timerStartTime={timerStartTime}
          onStart={startTimer}
          onStop={handleStopTimer}
        />
      </View>

      {/* Calendar */}
      <CalendarView
        calendarDate={calendarDate}
        calendarMode={calendarMode}
        userTimeEntries={timeEntries}
        calendarEvents={calendarEvents}
        onModeChange={setCalendarMode}
        onDateChange={setCalendarDate}
        onPressEvent={handleEventPress}
        onPressCell={handleCellPress}
      />

      {/* Time Entry Modal */}
      <TimeEntryModal
        visible={isModalVisible}
        mode={modalMode}
        entry={editingEntry}
        timerStartTime={isTimerEntry ? timerStartTime : null}
        elapsedSeconds={isTimerEntry ? elapsedSeconds : 0}
        initialStartTime={modalStartTime}
        initialEndTime={modalEndTime}
        initialDate={selectedDate}
        onClose={isTimerEntry ? handleDiscardTimer : () => setIsModalVisible(false)}
        onSave={handleSaveEntry}
        onContinue={handleContinueTimer}
        onDelete={handleDeleteEntry}
      />
    </View>
  );
}
