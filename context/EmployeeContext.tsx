import React, { createContext, ReactNode, useContext } from "react";
import { ALL_EMPLOYEES } from "./mockData";

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
  // Use first employee as logged-in user
  const currentEmployee = ALL_EMPLOYEES[0];

  return (
    <EmployeeContext.Provider
      value={{
        currentEmployeeId: currentEmployee.id,
        currentEmployeeName: currentEmployee.name,
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
