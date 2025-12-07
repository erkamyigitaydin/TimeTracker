import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { TimeEntry } from '../types/timeEntry';
import { useAuth } from './AuthContext';

type TimeEntryContextType = {
  timeEntries: TimeEntry[];
  addEntry: (entry: TimeEntry) => Promise<void>;
  updateEntry: (entry: TimeEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  isLoading: boolean;
};

const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined);

const STORAGE_KEY = '@time_entries';

export function TimeEntryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setAllEntries(JSON.parse(jsonValue));
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
      setAllEntries(entries);
    } catch (e) {
      console.error('Failed to save time entries', e);
      Alert.alert('Error', 'Failed to save time entries');
    }
  };

  const addEntry = async (entry: TimeEntry) => {
    const newEntries = [...allEntries, entry];
    await saveEntries(newEntries);
  };

  const updateEntry = async (updatedEntry: TimeEntry) => {
    const newEntries = allEntries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    await saveEntries(newEntries);
  };

  const deleteEntry = async (id: string) => {
    const newEntries = allEntries.filter((entry) => entry.id !== id);
    await saveEntries(newEntries);
  };

  const timeEntries = user ? allEntries.filter((entry) => entry.userId === user.id) : [];

  return (
    <TimeEntryContext.Provider
      value={{
        timeEntries,
        addEntry,
        updateEntry,
        deleteEntry,
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