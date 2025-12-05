import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export interface PickerItem {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
}

interface InlineSearchPickerProps {
  visible: boolean;
  selectedId: string;
  items: PickerItem[];
  searchQuery: string;
  placeholder?: string;
  title?: string;
  emptyMessage?: string;
  onSelect: (item: PickerItem) => void;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

export default function InlineSearchPicker({
  visible,
  selectedId,
  items,
  searchQuery,
  placeholder = 'Search...',
  title = 'Select Item',
  emptyMessage = 'No items found',
  onSelect,
  onSearchChange,
  onClose,
}: InlineSearchPickerProps) {
  if (!visible) return null;

  return (
    <View className="bg-gray-100 rounded-xl mb-4 p-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-gray-700">{title}</Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-1"
        >
          <Feather name="x" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <View className="bg-white rounded-lg px-3 py-2 mb-3 flex-row items-center border border-gray-200">
        <Feather name="search" size={16} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-sm text-gray-900"
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoFocus={true}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Feather name="x-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="max-h-[180px]">
        {items.length === 0 ? (
          <View className="py-4 items-center">
            <Text className="text-sm text-gray-500">{emptyMessage}</Text>
          </View>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelect(item)}
              className={`p-3 rounded-lg mb-2 ${
                selectedId === item.id ? 'bg-blue-100 border border-blue-500' : 'bg-white'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedId === item.id ? 'text-blue-700' : 'text-gray-900'
                }`}
              >
                {item.name}
              </Text>
              {item.subtitle && (
                <Text className="text-xs text-gray-600 mt-1">{item.subtitle}</Text>
              )}
              {item.badge && (
                <Text className="text-xs text-gray-500 mt-1 font-mono">{item.badge}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
