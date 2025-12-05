import React, { createContext, ReactNode, useContext } from "react";
import { useAuth } from "./AuthContext";

export type DailyEntry = {
  id: string;
  projectId: string;
  hours: number;
  description: string;
};

type EmployeeContextType = {
  currentEmployeeId: string;
  currentEmployeeName: string;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <EmployeeContext.Provider
      value={{
        currentEmployeeId: user?.id || '',
        currentEmployeeName: user?.fullName || 'Guest',
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used inside EmployeeProvider");
  return ctx;
}
