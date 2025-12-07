import { AccountantProvider } from "@/context/AccountantContext";
import { AuthProvider } from "@/context/AuthContext";
import { ClientProvider } from "@/context/ClientContext";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { TimeEntryProvider } from "@/context/TimeEntryContext";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EmployeeProvider>
          <AccountantProvider>
            <ClientProvider>
              <ProjectProvider>
                <TimeEntryProvider>
                  <Slot />
                </TimeEntryProvider>
              </ProjectProvider>
            </ClientProvider>
          </AccountantProvider>
        </EmployeeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}