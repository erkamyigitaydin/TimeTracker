import InlineSearchPicker, { PickerItem } from '@/components/InlineSearchPicker';
import Sidebar, { employeeMenuItems } from '@/components/Sidebar';
import { useClients } from '@/context/ClientContext';
import { useEmployee } from '@/context/EmployeeContext';
import { useProjects } from '@/context/ProjectContext';
import { Project } from '@/types/project';
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

export default function ProjectsScreen() {
  const { currentEmployeeName } = useEmployee();
  const { clients } = useClients();
  const { projects, addProject, updateProject, deleteProject, isLoading } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  const resetForm = () => {
    setName('');
    setClientId('');
    setClientName('');
    setCode('');
    setDescription('');
    setSelectedProject(null);
    setEditMode(false);
    setClientSearchQuery('');
  };

  const handleAddNew = () => {
    if (clients.length === 0) {
      Alert.alert(
        'No Clients',
        'Please add at least one client before creating a project.',
        [{ text: 'OK' }]
      );
      return;
    }
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (project: Project) => {
    const client = clients.find((c) => c.id === project.clientId);
    setSelectedProject(project);
    setName(project.name);
    setClientId(project.clientId);
    setClientName(client?.name || 'Unknown Client');
    setCode(project.code || '');
    setDescription(project.description || '');
    setEditMode(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Project name is required');
      return;
    }
    if (!clientId) {
      Alert.alert('Validation Error', 'Please select a client');
      return;
    }

    try {
      if (editMode && selectedProject) {
        await updateProject({
          ...selectedProject,
          name: name.trim(),
          clientId,
          code: code.trim() || undefined,
          description: description.trim() || undefined,
        });
        Alert.alert('Success', 'Project updated successfully');
      } else {
        await addProject({
          name: name.trim(),
          clientId,
          code: code.trim() || undefined,
          description: description.trim() || undefined,
        });
        Alert.alert('Success', 'Project added successfully');
      }
      setModalVisible(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to save project');
    }
  };

  const handleDelete = (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
              Alert.alert('Success', 'Project deleted successfully');
            } catch {
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const handleClientSelect = (item: PickerItem) => {
    setClientId(item.id);
    setClientName(item.name);
    setClientPickerVisible(false);
    setClientSearchQuery('');
  };

  const filteredClients: PickerItem[] = clients
    .filter((client) =>
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(clientSearchQuery.toLowerCase())
    )
    .map((client) => ({
      id: client.id,
      name: client.name,
      subtitle: client.email,
    }));

  const renderProjectCard = ({ item }: { item: Project }) => {
    const client = clients.find((c) => c.id === item.clientId);
    return (
      <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
            {item.code && (
              <Text className="text-xs text-gray-500 mb-2 font-mono bg-gray-100 self-start px-2 py-1 rounded">
                {item.code}
              </Text>
            )}
            <View className="flex-row items-center mt-1">
              <Feather name="briefcase" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {client?.name || 'Unknown Client'}
              </Text>
            </View>
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
        {item.description && (
          <View className="bg-gray-50 p-2 rounded-lg mt-2">
            <Text className="text-xs text-gray-600">{item.description}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute="projects"
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
        <Text className="text-lg font-bold text-gray-700">Projects</Text>
        <TouchableOpacity
          onPress={handleAddNew}
          className="w-9 h-9 bg-blue-500 rounded-lg items-center justify-center"
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Project Count Badge */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-2 self-start bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <Feather name="folder" size={18} color="#007AFF" />
          <Text className="text-sm font-semibold text-gray-700">
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
          </Text>
        </View>
      </View>

      {/* Projects List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : projects.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="folder" size={48} color="#CCCCCC" />
          <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2">No Projects Yet</Text>
          <Text className="text-base text-gray-500 text-center mb-6">
            Add your first project to get started
          </Text>
          <TouchableOpacity
            onPress={handleAddNew}
            className="bg-blue-500 px-6 py-3 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Add Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderProjectCard}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Add/Edit Project Modal */}
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
            <TouchableWithoutFeedback onPress={() => { }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
              >
                <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-gray-900">
                      {editMode ? 'Edit Project' : 'Add Project'}
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
                      Client <Text className="text-red-500">*</Text>
                    </Text>

                    <InlineSearchPicker
                      visible={clientPickerVisible}
                      selectedId={clientId}
                      items={filteredClients}
                      searchQuery={clientSearchQuery}
                      placeholder="Search clients..."
                      title="Select a Client"
                      emptyMessage="No clients found"
                      onSelect={handleClientSelect}
                      onSearchChange={setClientSearchQuery}
                      onClose={() => {
                        setClientPickerVisible(false);
                        setClientSearchQuery('');
                      }}
                    />

                    {!clientPickerVisible && (
                      <TouchableOpacity
                        onPress={() => setClientPickerVisible(true)}
                        className="bg-gray-100 px-4 py-3 rounded-xl mb-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                      >
                        <Text className={clientName ? 'text-gray-900' : 'text-gray-400'}>
                          {clientName || 'Select a client'}
                        </Text>
                        <Feather name="chevron-down" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    )}

                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Project Name <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="Enter project name"
                      value={name}
                      onChangeText={setName}
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-gray-900"
                      placeholder="Project description"
                      value={description}
                      onChangeText={setDescription}
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
                      {editMode ? 'Update Project' : 'Add Project'}
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
