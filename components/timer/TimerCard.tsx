import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

type TimerCardProps = {
  isTimerActive: boolean;
  elapsedSeconds: number;
  timerStartTime: Date | null;
  onStart: () => void;
  onStop: () => void;
};

export default function TimerCard({
  isTimerActive,
  elapsedSeconds,
  timerStartTime,
  onStart,
  onStop,
}: TimerCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation effect
  useEffect(() => {
    if (isTimerActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation for card
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isTimerActive, pulseAnim, glowAnim]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Animated.View
      style={{
        shadowColor: isTimerActive ? '#3B82F6' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isTimerActive
          ? glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            })
          : 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
      className="rounded-2xl overflow-hidden mb-4"
    >
      <LinearGradient
        colors={
          isTimerActive
            ? ['#3B82F6', '#2563EB', '#1D4ED8']
            : ['#F3F4F6', '#E5E7EB']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-5"
      >
        <View className="items-center">
          <View className="flex-row items-center gap-3 mb-2">
            {isTimerActive && (
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#EF4444',
                  shadowColor: '#EF4444',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              />
            )}
            <Text
              className={`text-5xl font-bold ${
                isTimerActive ? 'text-white' : 'text-gray-900'
              }`}
            >
              {formatTime(elapsedSeconds)}
            </Text>

            {/* Start/Stop Icon Button */}
            <TouchableOpacity
              onPress={isTimerActive ? onStop : onStart}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                isTimerActive
                  ? 'bg-white/20 border-2 border-white/30'
                  : 'bg-blue-500'
              }`}
              activeOpacity={0.8}
              style={{
                shadowColor: isTimerActive ? '#fff' : '#3B82F6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Feather
                name={isTimerActive ? 'square' : 'play'}
                size={18}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {timerStartTime && (
            <View
              className={`px-3 py-1 rounded-full ${
                isTimerActive ? 'bg-white/20' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isTimerActive ? 'text-white' : 'text-gray-600'
                }`}
              >
                Started at {format(timerStartTime, 'HH:mm')}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
