import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { TimeEntry } from '../types/timeEntry';

type TimeEntryContextType = {
  timeEntries: TimeEntry[];
  addEntry: (entry: TimeEntry) => Promise<void>;
  updateEntry: (entry: TimeEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getUserEntries: (userId: string) => TimeEntry[];
  isLoading: boolean;
};

const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined);

const STORAGE_KEY = '@time_entries';

export function TimeEntryProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTimeEntries(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load time entries', e);
      Alert.alert('Error', 'Failed to load time entries');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (entries: TimeEntry[]) => {
    try {
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setTimeEntries(entries);
    } catch (e) {
      console.error('Failed to save time entries', e);
      Alert.alert('Error', 'Failed to save time entries');
    }
  };

  const addEntry = async (entry: TimeEntry) => {
    const newEntries = [...timeEntries, entry];
    await saveEntries(newEntries);
  };

  const updateEntry = async (updatedEntry: TimeEntry) => {
    const newEntries = timeEntries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    await saveEntries(newEntries);
  };

  const deleteEntry = async (id: string) => {
    const newEntries = timeEntries.filter((entry) => entry.id !== id);
    await saveEntries(newEntries);
  };

  const getUserEntries = (userId: string) => {
    return timeEntries.filter((entry) => entry.userId === userId);
  };

  return (
    <TimeEntryContext.Provider
      value={{
        timeEntries,
        addEntry,
        updateEntry,
        deleteEntry,
        getUserEntries,
        isLoading,
      }}
    >
      {children}
    </TimeEntryContext.Provider>
  );
}

export function useTimeEntries() {
  const ctx = useContext(TimeEntryContext);
  if (!ctx) throw new Error('useTimeEntries must be used inside TimeEntryProvider');
  return ctx;
}
