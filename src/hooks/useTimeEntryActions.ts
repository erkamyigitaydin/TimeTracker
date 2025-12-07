import { Alert } from 'react-native';
import { useTimeEntries } from '../context/TimeEntryContext';
import { TimeEntry } from '../types/timeEntry';
import {
    createDateRange,
    validateTimeRange,
} from '../utils/timer/timeCalculations';

interface SaveEntryData {
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

//Handles create, update, and delete actions with validation
export function useTimeEntryActions(
  currentEmployeeId: string,
  currentEmployeeName: string,
  onResetTimer?: () => void
) {
  const { addEntry, updateEntry, deleteEntry } = useTimeEntries();

   // Create a new time entry
  const createEntry = async (
    data: SaveEntryData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Create date range from input
      const { startDate, endDate } = createDateRange(
        data.date,
        data.startTime,
        data.endTime
      );

      // Validate time range
      if (!validateTimeRange(startDate, endDate)) {
        Alert.alert('Error', 'End time must be after start time');
        return { success: false, message: 'Invalid time range' };
      }

      const durationMinutes = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60)
      );

      // Create new entry
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        userId: currentEmployeeId,
        userName: currentEmployeeName,
        clientId: data.clientId,
        clientName: data.clientName.trim(),
        projectId: data.projectId,
        projectName: data.projectName.trim(),
        description: data.description.trim(),
        date: data.date,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        durationMinutes,
      };

      await addEntry(newEntry);

      // Reset timer if callback provided
      if (onResetTimer) {
        onResetTimer();
      }

      Alert.alert('Success', 'Time entry saved successfully!');
      return { success: true, message: 'Entry created' };
    } catch (error) {
      console.error('Error creating entry:', error);
      Alert.alert('Error', 'Failed to save time entry');
      return { success: false, message: 'Failed to create entry' };
    }
  };

  // Update an existing time entry
  const updateEntryData = async (
    entry: TimeEntry,
    data: SaveEntryData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Create date range from input
      const { startDate, endDate } = createDateRange(
        data.date,
        data.startTime,
        data.endTime
      );

      // Validate time range
      if (!validateTimeRange(startDate, endDate)) {
        Alert.alert('Error', 'End time must be after start time');
        return { success: false, message: 'Invalid time range' };
      }

      const durationMinutes = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60)
      );

      // Update existing entry
      const updatedEntry: TimeEntry = {
        ...entry,
        description: data.description.trim(),
        clientId: data.clientId,
        clientName: data.clientName.trim(),
        projectId: data.projectId,
        projectName: data.projectName.trim(),
        date: data.date,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        durationMinutes,
      };

      await updateEntry(updatedEntry);

      Alert.alert('Success', 'Time entry updated successfully!');
      return { success: true, message: 'Entry updated' };
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update time entry');
      return { success: false, message: 'Failed to update entry' };
    }
  };

  // Delete a time entry with confirmation
  const deleteEntryWithConfirmation = (
    entry: TimeEntry,
    onSuccess?: () => void
  ) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this time entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entry.id);
              Alert.alert('Success', 'Time entry deleted successfully!');
              if (onSuccess) {
                onSuccess();
              }
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete time entry');
            }
          },
        },
      ]
    );
  };

  // Handle discard timer with confirmation
  const discardTimerWithConfirmation = (onConfirm: () => void) => {
    Alert.alert(
      'Discard Timer',
      'Are you sure you want to discard this timer entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: onConfirm,
        },
      ]
    );
  };

  return {
    createEntry,
    updateEntryData,
    deleteEntryWithConfirmation,
    discardTimerWithConfirmation,
  };
}
