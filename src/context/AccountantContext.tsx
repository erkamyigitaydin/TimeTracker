import { addMonths, format, subMonths } from "date-fns";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ALL_EMPLOYEES, generateEmployeeMockData } from "./mockData";

export interface EmployeeEntry {
  id: string;
  projectId: string;
  hours: number;
  description: string;
  date: string;
}

export interface EmployeeMonthData {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  daysLogged: number;
  pdfStatus: "uploaded" | "missing";
  pdfFileName?: string;
  pdfUploadDate?: string;
  entries: EmployeeEntry[];
}

interface AccountantContextType {
  currentAccountantName: string;
  currentMonth: Date;
  nextMonth: () => void;
  previousMonth: () => void;
  getMonthData: () => {
    totalEmployees: number;
    totalHours: number;
    missingSubmissions: number;
    employees: EmployeeMonthData[];
  };
  getEmployeeDetail: (employeeId: string) => EmployeeMonthData | undefined;
}

const AccountantContext = createContext<AccountantContextType | undefined>(undefined);

// Mock data generator using shared utility
const generateMockAccountantData = (month: Date): EmployeeMonthData[] => {
  return ALL_EMPLOYEES.map((emp) => {
    const mockData = generateEmployeeMockData(emp.id, emp.name, month);
    
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      totalHours: mockData.totalHours,
      daysLogged: mockData.daysLogged,
      pdfStatus: mockData.pdf ? "uploaded" : "missing",
      pdfFileName: mockData.pdf?.name,
      pdfUploadDate: mockData.pdf?.uploadDate.split('T')[0],
      entries: mockData.entries,
    };
  });
};

export function AccountantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mockData, setMockData] = useState<Map<string, EmployeeMonthData[]>>(() => {
    // Initialize with current month data
    const initialMap = new Map<string, EmployeeMonthData[]>();
    const key = format(new Date(), "yyyy-MM");
    initialMap.set(key, generateMockAccountantData(new Date()));
    return initialMap;
  });

  const getMonthKey = (date: Date) => format(date, "yyyy-MM");

  // Load data for current month if not already loaded
  useEffect(() => {
    const key = getMonthKey(currentMonth);
    setMockData(prev => {
      if (!prev.has(key)) {
        const data = generateMockAccountantData(currentMonth);
        const newMap = new Map(prev);
        newMap.set(key, data);
        return newMap;
      }
      return prev;
    });
  }, [currentMonth]);

  const getOrGenerateData = (month: Date): EmployeeMonthData[] => {
    const key = getMonthKey(month);
    return mockData.get(key) || [];
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getMonthData = () => {
    const employees = getOrGenerateData(currentMonth);
    const totalHours = employees.reduce((sum, e) => sum + e.totalHours, 0);
    const missingSubmissions = employees.filter(e => e.pdfStatus === "missing").length;

    return {
      totalEmployees: employees.length,
      totalHours: parseFloat(totalHours.toFixed(1)),
      missingSubmissions,
      employees,
    };
  };

  const getEmployeeDetail = (employeeId: string) => {
    const employees = getOrGenerateData(currentMonth);
    return employees.find(e => e.employeeId === employeeId);
  };

  return (
    <AccountantContext.Provider
      value={{
        currentAccountantName: user?.fullName || 'Accountant',
        currentMonth,
        nextMonth,
        previousMonth,
        getMonthData,
        getEmployeeDetail,
      }}
    >
      {children}
    </AccountantContext.Provider>
  );
}

export function useAccountant() {
  const context = useContext(AccountantContext);
  if (!context) throw new Error("useAccountant must be used within AccountantProvider");
  return context;
}
