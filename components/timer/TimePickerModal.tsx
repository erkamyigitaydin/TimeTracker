import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TimePickerModalProps = {
  visible: boolean;
  title: string;
  selectedTime: string;
  onClose: () => void;
  onSelectTime: (time: string) => void;
};

export default function TimePickerModal({
  visible,
  title,
  selectedTime,
  onClose,
  onSelectTime,
}: TimePickerModalProps) {
  const handleSelectTime = (time: string) => {
    onSelectTime(time);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 mx-6"
          style={{ width: 320, maxHeight: 400 }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-gray-900 mb-4">{title}</Text>

          <ScrollView style={{ maxHeight: 240 }} className="mb-4">
            {Array.from({ length: 24 }, (_, hour) => (
              <View key={hour}>
                {[0, 15, 30, 45].map((minute) => {
                  const time = `${String(hour).padStart(2, '0')}:${String(
                    minute
                  ).padStart(2, '0')}`;
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      onPress={() => handleSelectTime(time)}
                      className={`py-3 px-4 rounded-lg mb-1 ${
                        isSelected ? 'bg-blue-500' : 'bg-gray-50'
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-base font-medium ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-200 py-3 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-center font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
