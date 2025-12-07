import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInSeconds } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const TIMER_START_KEY = '@timer_start_time';
const TIMER_ACTIVE_KEY = '@timer_active';

export function useTimer() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const active = await AsyncStorage.getItem(TIMER_ACTIVE_KEY);
        const start = await AsyncStorage.getItem(TIMER_START_KEY);

        if (active === 'true' && start) {
          const startDate = new Date(start);
          setIsTimerActive(true);
          setTimerStartTime(startDate);
          // Calculate elapsed immediately
          setElapsedSeconds(Math.max(0, differenceInSeconds(new Date(), startDate)));
        }
      } catch (e) {
        console.error('Failed to load timer state', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        // Only save if we are not in the initial loading phase
        if (isLoading) return;

        if (isTimerActive && timerStartTime) {
          await AsyncStorage.setItem(TIMER_ACTIVE_KEY, 'true');
          await AsyncStorage.setItem(TIMER_START_KEY, timerStartTime.toISOString());
        } else {
          // If timer is not active, we remove the persistence
          await AsyncStorage.removeItem(TIMER_ACTIVE_KEY);
          await AsyncStorage.removeItem(TIMER_START_KEY);
        }
      } catch (e) {
        console.error('Failed to save timer state', e);
      }
    };
    saveState();
  }, [isTimerActive, timerStartTime, isLoading]);

  // Timer interval effect - updates UI every second
  useEffect(() => {
    if (isTimerActive && timerStartTime) {
      // Update immediately
      setElapsedSeconds(Math.max(0, differenceInSeconds(new Date(), timerStartTime)));

      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.max(0, differenceInSeconds(new Date(), timerStartTime)));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timerStartTime]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isTimerActive && timerStartTime) {
         setElapsedSeconds(Math.max(0, differenceInSeconds(new Date(), timerStartTime)));
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isTimerActive, timerStartTime]);

  const startTimer = () => {
    const now = new Date();
    setIsTimerActive(true);
    setTimerStartTime(now);
    setElapsedSeconds(0);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setElapsedSeconds(0);
    setTimerStartTime(null);
    setIsTimerActive(false);
  };

  const continueTimer = () => {
    setIsTimerActive(true);
  };

  return {
    isTimerActive,
    elapsedSeconds,
    timerStartTime,
    startTimer,
    stopTimer,
    resetTimer,
    continueTimer,
    isLoading,
  };
}
