import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Sidebar, { employeeMenuItems } from "../../components/Sidebar";
import { useEmployee } from "../../context/EmployeeContext";
import { routes } from "../../src/constants/ui";

// Project type definition
interface Project {
  id: string;
  name: string;
  description: string;
  assignedMembers: string[];
}

// This will be populated with actual data later
const getAllProjects = (): Project[] => {
  return [];
};

// Get projects assigned to the logged-in employee
const getMyProjects = (employeeId: string): Project[] => {
  const allProjects = getAllProjects();
  return allProjects.filter(project => 
    project.assignedMembers.includes(employeeId)
  );
};

export default function EmployeeMyProjectsScreen() {
  const router = useRouter();
  const { currentEmployeeId, currentEmployeeName } = useEmployee();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const myProjects = getMyProjects(currentEmployeeId);

  const handleProjectPress = (projectId: string) => {
    router.push({
      pathname: routes.employeeProjectDetails,
      params: { projectId }
    } as any);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeRoute="projects"
        menuItems={employeeMenuItems}
        userName={currentEmployeeName || "Employee"}
        userRole="Employee"
        avatarColor="bg-violet-500"
      />

      {/* Header */}
      <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">My Projects</Text>
        <View className="w-10" />
      </View>

      {/* Project Count Badge */}
      <View className="px-lg py-md bg-gray-50 border-b border-gray-100">
        <View className="flex-row items-center gap-sm self-start bg-white px-md py-sm rounded-2xl border border-gray-200">
          <Feather name="briefcase" size={20} color="#007AFF" />
          <Text className="text-base font-semibold text-gray-700">
            {myProjects.length} {myProjects.length === 1 ? 'Project' : 'Projects'}
          </Text>
        </View>
      </View>

      {/* Projects List */}
      {myProjects.length === 0 ? (
        <View className="flex-1 justify-center items-center px-xl">
          <Feather name="folder" size={40} color="#CCCCCC" />
          <Text className="text-xl font-semibold text-gray-700 mt-lg mb-sm">No Projects Assigned</Text>
          <Text className="text-base text-gray-500 text-center leading-6">
            You don't have any projects assigned yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myProjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl p-lg mb-md"
              onPress={() => handleProjectPress(item.id)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-start mb-md">
                <View className="w-12 h-12 rounded-xl bg-primary-light justify-center items-center mr-md">
                  <Feather name="folder" size={24} color="#007AFF" />
                </View>
                <View className="flex-1 mr-sm">
                  <Text className="text-xl font-semibold text-gray-700 mb-xs">{item.name}</Text>
                  <Text className="text-sm text-gray-500 leading-5" numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#666666" />
              </View>

              <View className="border-t border-gray-100 pt-md flex-row justify-between items-center">
                <View className="flex-row items-center gap-xs">
                  <Feather name="users" size={16} color="#666666" />
                  <Text className="text-sm text-gray-500">
                    {item.assignedMembers.length} {item.assignedMembers.length === 1 ? 'member' : 'members'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
