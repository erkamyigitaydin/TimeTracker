import { TimeEntryProvider } from "@/context/TimeEntryContext";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AccountantProvider } from "../context/AccountantContext";
import { AuthProvider } from "../context/AuthContext";
import { EmployeeProvider } from "../context/EmployeeContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EmployeeProvider>
          <AccountantProvider>
            <TimeEntryProvider>
            <Slot />
            </TimeEntryProvider>
          </AccountantProvider>
        </EmployeeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}