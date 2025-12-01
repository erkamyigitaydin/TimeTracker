import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Sidebar, { accountantMenuItems } from "../../components/Sidebar";
import { useAccountant } from "../../context/AccountantContext";
import { dateFormats, labels, routes, screenTitles, symbols } from "../../src/constants/ui";

export default function AccountantDashboardScreen() {
  const { currentMonth, nextMonth, previousMonth, getMonthData } = useAccountant();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const monthData = getMonthData();

  return (
    <View className="flex-1 bg-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute="dashboard"
        menuItems={accountantMenuItems}
        userName="Sarah Johnson"
        userRole="Accountant"
        avatarColor="bg-emerald-500"
      />

      {/* Title Bar */}
      <View className="flex-row justify-between items-center pt-[60px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">{screenTitles.accountantPage}</Text>
        <View className="w-10" />
      </View>

      {/* Month Selector */}
      <View className="flex-row justify-between items-center p-[10px] border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={previousMonth}>
          <Text className="text-2xl font-bold p-sm text-primary">{symbols.chevronLeft}</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold">{format(currentMonth, dateFormats.monthYear)}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text className="text-2xl font-bold p-sm text-primary">{symbols.chevronRight}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Summary Cards */}
        <View className="flex-row gap-md mb-xl">
          <View className="flex-1 bg-gray-50 p-lg rounded-xl items-center border border-gray-100">
            <Text className="text-2xl font-bold text-gray-700">{monthData.totalEmployees}</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.employees}</Text>
          </View>
          <View className="flex-1 bg-gray-50 p-lg rounded-xl items-center border border-gray-100">
            <Text className="text-2xl font-bold text-gray-700">{monthData.totalHours}h</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.totalHours}</Text>
          </View>
          <View className="flex-1 bg-gray-50 p-lg rounded-xl items-center border border-gray-100">
            <Text className="text-2xl font-bold text-gray-700">{monthData.missingSubmissions}</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.missingPdfs}</Text>
          </View>
        </View>

        {/* Employee List */}
        <View className="mb-xl">
          <Text className="text-xl font-semibold mb-md">{labels.employees}</Text>
          {monthData.employees.map((emp) => (
            <TouchableOpacity
              key={emp.employeeId}
              className="flex-row justify-between items-center py-md border-b border-gray-100"
              onPress={() => router.push(`${routes.accountantEmployeeDetail}?id=${emp.employeeId}` as any)}
            >
              <View>
                <Text className="text-lg font-medium">{emp.employeeName}</Text>
                <Text className="text-base text-gray-500">
                  {emp.totalHours}h • {emp.daysLogged} days • {emp.pdfStatus === "uploaded" ? "✓ PDF" : "⚠ No PDF"}
                </Text>
              </View>
              <Text className="text-xl text-gray-300 font-bold">{symbols.chevronForward}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
