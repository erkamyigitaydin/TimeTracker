import { Feather } from '@expo/vector-icons';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Sidebar, { employeeMenuItems } from "../../components/Sidebar";
import { useEmployee } from "../../context/EmployeeContext";
import { useTimeEntries } from "../../context/TimeEntryContext";
import { screenTitles } from "../../src/constants/ui";

export default function EmployeeHomeScreen() {
  const { currentEmployeeName } = useEmployee();
  const { timeEntries } = useTimeEntries();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyStats = useMemo(() => {
    const entriesThisMonth = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.start);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });

    const totalMinutes = entriesThisMonth.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const projectsMap = new Map<string, number>();
    entriesThisMonth.forEach((entry) => {
      const current = projectsMap.get(entry.projectName) || 0;
      projectsMap.set(entry.projectName, current + entry.durationMinutes);
    });

    const topProjects = Array.from(projectsMap.entries())
      .map(([name, minutes]) => ({
        name,
        hours: (minutes / 60).toFixed(1),
        percentage: totalMinutes > 0 ? ((minutes / totalMinutes) * 100).toFixed(0) : '0',
      }))
      .sort((a, b) => parseFloat(b.hours) - parseFloat(a.hours))
      .slice(0, 3);

    const uniqueDays = new Set(
      entriesThisMonth.map((entry) => format(new Date(entry.start), 'yyyy-MM-dd'))
    ).size;

    return {
      totalHours,
      remainingMinutes,
      totalEntries: entriesThisMonth.length,
      topProjects,
      daysWorked: uniqueDays,
    };
  }, [timeEntries, monthStart, monthEnd]);

  return (
    <View className="flex-1 bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeRoute="dashboard"
        menuItems={employeeMenuItems}
        userName={currentEmployeeName || "User"}
        userRole="Employee"
        avatarColor="bg-blue-500"
      />

      <View className="flex-row justify-between items-center pt-[50px] px-4 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">{screenTitles.employeePage}</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              Welcome back, {currentEmployeeName}
            </Text>
            <Text className="text-base text-gray-500">
              {format(currentMonth, 'MMMM yyyy')} Summary
            </Text>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-blue-500 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Feather name="clock" size={24} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-1">
                {monthlyStats.totalHours}h {monthlyStats.remainingMinutes}m
              </Text>
              <Text className="text-sm text-blue-100">Total Hours</Text>
            </View>

            <View className="flex-1 bg-green-500 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Feather name="calendar" size={24} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-1">
                {monthlyStats.daysWorked}
              </Text>
              <Text className="text-sm text-green-100">Days Worked</Text>
            </View>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-purple-500 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Feather name="file-text" size={24} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-1">
                {monthlyStats.totalEntries}
              </Text>
              <Text className="text-sm text-purple-100">Time Entries</Text>
            </View>

            <View className="flex-1 bg-orange-500 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Feather name="trending-up" size={24} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-1">
                {monthlyStats.daysWorked > 0 
                  ? (monthlyStats.totalHours / monthlyStats.daysWorked).toFixed(1)
                  : '0'}h
              </Text>
              <Text className="text-sm text-orange-100">Avg per Day</Text>
            </View>
          </View>

          {monthlyStats.topProjects.length > 0 && (
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Feather name="folder" size={20} color="#3B82F6" />
                <Text className="text-lg font-bold text-gray-800 ml-2">
                  Top Projects
                </Text>
              </View>

              {monthlyStats.topProjects.map((project, index) => (
                <View key={index} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base font-semibold text-gray-700 flex-1">
                      {project.name}
                    </Text>
                    <Text className="text-sm font-bold text-blue-600 ml-2">
                      {project.hours}h
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${parseFloat(project.percentage)}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {monthlyStats.totalEntries === 0 && (
            <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
              <Feather name="inbox" size={48} color="#CCCCCC" />
              <Text className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                No entries yet
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                Start tracking your time to see statistics here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
