import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Sidebar, { employeeMenuItems } from "../../components/Sidebar";
import { useEmployee } from "../../context/EmployeeContext";
import { screenTitles } from "../../src/constants/ui";

export default function EmployeeHomeScreen() {
  const { currentEmployeeName } = useEmployee();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeRoute="dashboard"
        menuItems={employeeMenuItems}
        userName={currentEmployeeName || "User"}
        userRole="Employee"
        avatarColor="bg-violet-500"
      />

      {/* Title Bar */}
      <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">{screenTitles.employeePage}</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-xl">
        <Text className="text-xl font-semibold text-gray-700">Welcome, {currentEmployeeName}</Text>
      </View>
    </View>
  );
}
