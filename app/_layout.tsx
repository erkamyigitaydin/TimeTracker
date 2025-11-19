import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { EmployeeProvider } from "../context/EmployeeContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EmployeeProvider>
          <Slot />
        </EmployeeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}