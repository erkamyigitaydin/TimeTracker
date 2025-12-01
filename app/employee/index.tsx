import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useEmployee } from "../../context/EmployeeContext";
import { screenTitles } from "../../src/constants/ui";

export default function EmployeeHomeScreen() {
  const { logout } = useAuth();
  const { currentEmployeeName } = useEmployee();

  return (
    <View className="flex-1 bg-white">
      {/* Title Bar */}
      <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-700">{screenTitles.employeePage}</Text>
        <TouchableOpacity onPress={logout} className="px-md py-[6px]">
          <Feather name="log-out" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-xl">
        <Text className="text-xl font-semibold text-gray-700">Welcome, {currentEmployeeName}</Text>
      </View>
    </View>
  );
}
