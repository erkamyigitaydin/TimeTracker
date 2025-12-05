import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
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
import Sidebar, { employeeMenuItems } from '../../components/Sidebar';
import { useClients } from '../../context/ClientContext';
import { useEmployee } from '../../context/EmployeeContext';
import { Client } from '../../types/client';

export default function ClientsScreen() {
  const { currentEmployeeName } = useEmployee();
  const { clients, addClient, updateClient, deleteClient, isLoading } = useClients();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
    setSelectedClient(null);
    setEditMode(false);
  };

  const handleAddNew = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setName(client.name);
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setNotes(client.notes || '');
    setEditMode(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Client name is required');
      return;
    }

    try {
      if (editMode && selectedClient) {
        await updateClient({
          ...selectedClient,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        Alert.alert('Success', 'Client updated successfully');
      } else {
        await addClient({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        Alert.alert('Success', 'Client added successfully');
      }
      setModalVisible(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to save client');
    }
  };

  const handleDelete = (client: Client) => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete "${client.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(client.id);
              Alert.alert('Success', 'Client deleted successfully');
            } catch {
              Alert.alert('Error', 'Failed to delete client');
            }
          },
        },
      ]
    );
  };

  const renderClientCard = ({ item }: { item: Client }) => (
    <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
          {item.email && (
            <View className="flex-row items-center mb-1">
              <Feather name="mail" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">{item.email}</Text>
            </View>
          )}
          {item.phone && (
            <View className="flex-row items-center mb-1">
              <Feather name="phone" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">{item.phone}</Text>
            </View>
          )}
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            className="w-9 h-9 bg-blue-50 rounded-lg items-center justify-center"
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            className="w-9 h-9 bg-red-50 rounded-lg items-center justify-center"
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      {item.address && (
        <View className="flex-row items-start mt-1">
          <Feather name="map-pin" size={14} color="#6B7280" style={{ marginTop: 2 }} />
          <Text className="text-sm text-gray-600 ml-2 flex-1">{item.address}</Text>
        </View>
      )}
      {item.notes && (
        <View className="bg-gray-50 p-2 rounded-lg mt-2">
          <Text className="text-xs text-gray-600">{item.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute="clients"
        menuItems={employeeMenuItems}
        userName={currentEmployeeName || 'User'}
        userRole="Employee"
        avatarColor="bg-blue-500"
      />

      {/* Header */}
      <View className="flex-row justify-between items-center pt-[50px] px-4 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">Clients</Text>
        <TouchableOpacity
          onPress={handleAddNew}
          className="w-9 h-9 bg-blue-500 rounded-lg items-center justify-center"
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Client Count Badge */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-2 self-start bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <Feather name="users" size={18} color="#007AFF" />
          <Text className="text-sm font-semibold text-gray-700">
            {clients.length} {clients.length === 1 ? 'Client' : 'Clients'}
          </Text>
        </View>
      </View>

      {/* Clients List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : clients.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="users" size={48} color="#CCCCCC" />
          <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2">No Clients Yet</Text>
          <Text className="text-base text-gray-500 text-center mb-6">
            Add your first client to get started
          </Text>
          <TouchableOpacity
            onPress={handleAddNew}
            className="bg-blue-500 px-6 py-3 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Add Client</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={renderClientCard}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Add/Edit Client Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
              >
                <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-gray-900">
                      {editMode ? 'Edit Client' : 'Add Client'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        resetForm();
                      }}
                      className="w-8 h-8 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    className="max-h-[500px]"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Client Name <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="Enter client name"
                      value={name}
                      onChangeText={setName}
                      autoFocus={!editMode}
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="client@example.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Phone</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Address</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="Enter address"
                      value={address}
                      onChangeText={setAddress}
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Notes</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="Additional notes"
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </ScrollView>

                  <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-500 py-4 rounded-xl mt-4"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-center text-lg font-semibold">
                      {editMode ? 'Update Client' : 'Add Client'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
