import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Project type definition
interface Project {
  id: string;
  name: string;
  description: string;
  assignedMembers: string[];
}

// Team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
}

// This will be populated with actual data later
const getProjectById = (projectId: string): Project | null => {
  return null;
};

// This will be populated with actual data later
const getTeamMembers = (memberIds: string[]): TeamMember[] => {
  return [];
};

export default function EmployeeProjectDetailsScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  
  const project = getProjectById(projectId as string);
  const teamMembers = project ? getTeamMembers(project.assignedMembers) : [];

  // Placeholder hours - will be calculated from actual entries later
  const yourHoursThisMonth = 0;

  if (!project) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="py-xs pr-md">
            <Feather name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-700">Project Details</Text>
          <View className="w-[36px]" />
        </View>
        <View className="flex-1 justify-center items-center px-xl">
          <Feather name="alert-circle" size={40} color="#FF3B30" />
          <Text className="text-xl font-semibold text-danger mt-md">Project not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="py-xs pr-md">
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-700">Project Details</Text>
        <View className="w-[36px]" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Project Header Card */}
        <View className="bg-primary-light rounded-xl p-xl items-center mb-xl border border-primary/20">
          <View className="w-16 h-16 rounded-full bg-white justify-center items-center mb-md">
            <Feather name="folder" size={28} color="#007AFF" />
          </View>
          <Text className="text-3xl font-bold text-gray-700 text-center">{project.name}</Text>
        </View>

        {/* Project Description Section */}
        <View className="mb-xl">
          <View className="flex-row items-center gap-sm mb-md">
            <Feather name="file-text" size={20} color="#333333" />
            <Text className="text-xl font-semibold text-gray-700">Description</Text>
          </View>
          <View className="bg-white border border-gray-200 rounded-xl p-lg">
            <Text className="text-base text-gray-700 leading-6">{project.description}</Text>
          </View>
        </View>

        {/* Your Hours Section */}
        <View className="mb-xl">
          <View className="flex-row items-center gap-sm mb-md">
            <Feather name="clock" size={20} color="#333333" />
            <Text className="text-xl font-semibold text-gray-700">Your Hours This Month</Text>
          </View>
          <View className="bg-white border border-gray-200 rounded-xl p-lg">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-xs">Current Month</Text>
                <View className="flex-row items-baseline gap-xs">
                  <Text className="text-6xl font-bold text-primary">{yourHoursThisMonth.toFixed(1)}</Text>
                  <Text className="text-lg text-gray-500 font-medium">hours</Text>
                </View>
              </View>
              <View className="w-[60px] h-[60px] rounded-full bg-primary-light justify-center items-center">
                <Feather name="activity" size={28} color="#007AFF" />
              </View>
            </View>
            
            {yourHoursThisMonth === 0 && (
              <View className="flex-row items-center gap-xs mt-md pt-md border-t border-gray-100">
                <Feather name="info" size={16} color="#666666" />
                <Text className="text-sm text-gray-500 italic">No hours logged yet this month</Text>
              </View>
            )}
          </View>
        </View>

        {/* Team Members Section */}
        <View className="mb-xl">
          <View className="flex-row items-center gap-sm mb-md">
            <Feather name="users" size={20} color="#333333" />
            <Text className="text-xl font-semibold text-gray-700">Team Members</Text>
            <View className="bg-primary-light px-sm py-0.5 rounded-lg ml-xs">
              <Text className="text-xs font-bold text-primary">{teamMembers.length}</Text>
            </View>
          </View>
          
          <View className="bg-white border border-gray-200 rounded-xl p-lg">
            {teamMembers.length === 0 ? (
              <View className="items-center py-xl">
                <Feather name="user-plus" size={24} color="#CCCCCC" />
                <Text className="text-base text-gray-500 mt-sm italic">No team members assigned yet</Text>
              </View>
            ) : (
              <View>
                {teamMembers.map((member, index) => (
                  <View 
                    key={member.id} 
                    className={`flex-row items-center py-md ${
                      index !== teamMembers.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="w-11 h-11 rounded-full bg-primary-light justify-center items-center mr-md">
                      <Text className="text-xl font-bold text-primary">
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-700 mb-0.5">{member.name}</Text>
                      <Text className="text-sm text-gray-500">{member.role}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
