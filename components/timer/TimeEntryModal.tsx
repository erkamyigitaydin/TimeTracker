import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
    DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { TimeEntry } from '../../types/timeEntry';

type TimeEntryModalProps = {
  visible: boolean;
  mode?: 'create' | 'edit';
  entry?: TimeEntry | null;
  timerStartTime?: Date | null;
  elapsedSeconds?: number;
  initialStartTime?: string;
  initialEndTime?: string;
  initialDate?: Date;
  onClose: () => void;
  onSave: (data: {
    client: string;
    project: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  onContinue?: () => void;
  onDelete?: () => void;
};

export default function TimeEntryModal({
  visible,
  mode = 'create',
  entry,
  timerStartTime,
  elapsedSeconds = 0,
  initialStartTime = '',
  initialEndTime = '',
  initialDate,
  onClose,
  onSave,
  onContinue,
  onDelete,
}: TimeEntryModalProps) {
  const [modalDescription, setModalDescription] = useState('');
  const [modalClient, setModalClient] = useState('');
  const [modalProject, setModalProject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalStartTime, setModalStartTime] = useState(
    initialStartTime || format(new Date(), 'HH:mm')
  );
  const [modalEndTime, setModalEndTime] = useState(
    initialEndTime || format(new Date(), 'HH:mm')
  );
  const [iosPickerMode, setIosPickerMode] = useState<'date' | 'start' | 'end' | null>(
    null
  );
  const [iosPickerTempDate, setIosPickerTempDate] = useState(new Date());

  const isEditMode = mode === 'edit';

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setIosPickerMode(null);
      if (!isEditMode) {
        setModalDescription('');
        setModalClient('');
        setModalProject('');
        const now = new Date();
        const currentTime = format(now, 'HH:mm');
        setSelectedDate(now);
        setModalStartTime(currentTime);
        setModalEndTime(currentTime);
      }
    }
  }, [visible, isEditMode]);

  // Update form when entry or initial times change
  useEffect(() => {
    if (isEditMode && entry) {
      setModalDescription(entry.description);
      setModalClient(entry.clientName);
      setModalProject(entry.projectName);
      if (entry.date) {
        setSelectedDate(new Date(entry.date));
      }
      setModalStartTime(format(new Date(entry.start), 'HH:mm'));
      setModalEndTime(format(new Date(entry.end), 'HH:mm'));
    } else {
      // Clear form for create mode
      setModalDescription('');
      setModalClient('');
      setModalProject('');
      if (initialDate) {
        setSelectedDate(initialDate);
      } else if (timerStartTime) {
        setSelectedDate(timerStartTime);
      } else {
        setSelectedDate(new Date());
      }
      const fallbackTime = format(new Date(), 'HH:mm');
      setModalStartTime(initialStartTime || fallbackTime);
      setModalEndTime(initialEndTime || fallbackTime);
    }
  }, [visible, isEditMode, entry, initialStartTime, initialEndTime, timerStartTime, initialDate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  const handleSave = () => {
    // Validate all required fields
    if (!modalClient.trim()) {
      alert('Please enter a client name');
      return;
    }
    if (!modalProject.trim()) {
      alert('Please enter a project name');
      return;
    }
    if (!modalDescription.trim()) {
      alert('Please enter a description');
      return;
    }
    
    onSave({
      client: modalClient,
      project: modalProject,
      description: modalDescription,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: modalStartTime,
      endTime: modalEndTime,
    });
    // Reset form
    setModalDescription('');
    setModalClient('');
    setModalProject('');
    setSelectedDate(new Date());
  };

  const openAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          setSelectedDate(date);
        }
      },
    });
  };

  const timeStringToDate = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  const openAndroidTimePicker = (
    type: 'start' | 'end',
    currentValue: string
  ) => {
    DateTimePickerAndroid.open({
      value: timeStringToDate(currentValue),
      mode: 'time',
      is24Hour: true,
      onChange: (event, time) => {
        if (event.type === 'set' && time) {
          const formatted = format(time, 'HH:mm');
          if (type === 'start') {
            setModalStartTime(formatted);
          } else {
            setModalEndTime(formatted);
          }
        }
      },
    });
  };

  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      openAndroidDatePicker();
    } else {
      setIosPickerMode('date');
      setIosPickerTempDate(selectedDate);
    }
  };

  const handleTimePress = (type: 'start' | 'end') => {
    if (Platform.OS === 'android') {
      openAndroidTimePicker(
        type,
        type === 'start' ? modalStartTime : modalEndTime
      );
    } else {
      setIosPickerMode(type);
      setIosPickerTempDate(timeStringToDate(
        type === 'start' ? modalStartTime : modalEndTime
      ));
    }
  };

  const closeIosPicker = () => {
    setIosPickerMode(null);
  };

  const confirmIosPicker = () => {
    if (!iosPickerMode) return;
    if (iosPickerMode === 'date') {
      setSelectedDate(iosPickerTempDate);
    } else if (iosPickerMode === 'start') {
      setModalStartTime(format(iosPickerTempDate, 'HH:mm'));
    } else {
      setModalEndTime(format(iosPickerTempDate, 'HH:mm'));
    }
    setIosPickerMode(null);
  };

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={() => {}}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                  <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
              {/* Header with Title and Close Button */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Time Entry' : 'Time Entry'}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Entry Info for Edit Mode */}
              {isEditMode && entry && (
                <View className="bg-blue-50 p-3 rounded-xl mb-3">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xs text-gray-600 mb-1">Duration</Text>
                      <Text className="text-xl font-bold text-blue-600">
                        {Math.floor(entry.durationMinutes / 60)}h{' '}
                        {entry.durationMinutes % 60}m
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-gray-600">
                        {format(new Date(entry.start), 'MMM dd, yyyy')}
                      </Text>
                      <Text className="text-sm font-medium text-gray-700 mt-1">
                        {format(new Date(entry.start), 'HH:mm')} - {format(new Date(entry.end), 'HH:mm')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <ScrollView 
                className={isEditMode ? "max-h-[300px]" : "max-h-[400px]"}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Date Selection */}
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Date
                </Text>
                <TouchableOpacity
                  onPress={handleDatePress}
                  className="bg-gray-100 px-4 py-3 rounded-xl mb-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <Text className="text-base text-gray-900">
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </Text>
                  <Feather name="calendar" size={20} color="#6B7280" />
                </TouchableOpacity>

                {/* Client */}
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Client
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                  placeholder="Client name"
                  value={modalClient}
                  onChangeText={setModalClient}
                />

                {/* Project */}
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Project
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                  placeholder="Project name"
                  value={modalProject}
                  onChangeText={setModalProject}
                />

                {/* Description */}
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                  placeholder="What did you work on?"
                  value={modalDescription}
                  onChangeText={setModalDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  blurOnSubmit={true}
                  returnKeyType="done"
                />

                {/* Time Selection */}
                <View className="bg-blue-50 p-4 rounded-xl mb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1 mr-2">
                      <Text className="text-xs text-gray-600 mb-2">
                        Start Time
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleTimePress('start')}
                        className="bg-white px-4 py-3 rounded-lg border border-gray-200"
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-base font-semibold text-gray-900">
                            {modalStartTime || 'Select'}
                          </Text>
                          <Feather name="clock" size={16} color="#6B7280" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20 }}>
                      <Feather
                        name="arrow-right"
                        size={20}
                        color="#6B7280"
                      />
                    </View>

                    <View className="flex-1 ml-2">
                      <Text className="text-xs text-gray-600 mb-2">End Time</Text>
                      <TouchableOpacity
                        onPress={() => handleTimePress('end')}
                        className="bg-white px-4 py-3 rounded-lg border border-gray-200"
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-base font-semibold text-gray-900">
                            {modalEndTime || 'Select'}
                          </Text>
                          <Feather name="clock" size={16} color="#6B7280" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {timerStartTime && modalStartTime && modalEndTime && (
                    <Text className="text-sm text-gray-600 text-center">
                      {format(timerStartTime, 'MMM dd, yyyy')} • Duration:{' '}
                      {formatTime(elapsedSeconds)}
                    </Text>
                  )}
                </View>

              {/* Buttons */}
              <View className="gap-3 mt-4 mb-6">
                {isEditMode ? (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={handleSave}
                      className="flex-1 bg-blue-500 py-4 rounded-xl"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-center text-lg font-semibold">
                        Update Entry
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={onDelete}
                      className="flex-1 bg-red-500 py-4 rounded-xl"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-center text-lg font-semibold">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="gap-3">
                    <TouchableOpacity
                      onPress={handleSave}
                      className="bg-blue-500 py-4 rounded-xl"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-center text-lg font-semibold">
                        Save Entry
                      </Text>
                    </TouchableOpacity>

                    {timerStartTime && onContinue && (
                      <TouchableOpacity
                        onPress={onContinue}
                        className="bg-gray-200 py-4 rounded-xl"
                        activeOpacity={0.8}
                      >
                        <Text className="text-gray-700 text-center text-base font-semibold">
                          Continue Timer
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
              </ScrollView>
            </View>

            {/* iOS Picker Overlay */}
            {Platform.OS === 'ios' && iosPickerMode && (
              <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 shadow-lg z-50">
                <View className="flex-row justify-between mb-2">
                  <TouchableOpacity onPress={closeIosPicker}>
                    <Text className="text-base text-gray-500">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-base font-semibold text-gray-900 capitalize">
                    {iosPickerMode === 'date'
                      ? 'Select Date'
                      : `Select ${iosPickerMode} time`}
                  </Text>
                  <TouchableOpacity onPress={confirmIosPicker}>
                    <Text className="text-base text-blue-600 font-semibold">
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={iosPickerTempDate}
                  mode={iosPickerMode === 'date' ? 'date' : 'time'}
                  display="spinner"
                  textColor="black"
                  onChange={(_, date) => {
                    if (date) {
                      setIosPickerTempDate(date);
                    }
                  }}
                />
              </View>
            )}
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}