import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { ALL_EMPLOYEES, generateEmployeeMockData } from "./mockData";

export type DailyEntry = {
  id: string;
  projectId: string;
  hours: number;
  description: string;
};

export type PdfRecord = {
  uri: string;
  name: string;
  uploadDate: string;
};

type EmployeeContextType = {
  currentEmployeeId: string;
  currentEmployeeName: string;
  currentMonth: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  goToCurrentMonth: () => void;
  
  // PDF State
  pdfs: Record<string, PdfRecord>; // Key: "YYYY-MM"
  savePdf: (monthKey: string, pdf: PdfRecord) => void;
  getPdf: (monthKey: string) => PdfRecord | undefined;

  // Daily Entries State
  entries: Record<string, DailyEntry[]>; // Key: "YYYY-MM-DD"
  saveEntry: (dateKey: string, entry: DailyEntry) => void;
  getEntries: (dateKey: string) => DailyEntry[];
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// Load mock data for current employee and month
const loadMockDataForMonth = (employeeId: string, employeeName: string, month: Date) => {
  const mockData = generateEmployeeMockData(employeeId, employeeName, month);
  const monthKey = format(month, "yyyy-MM");
  
  const mockPdfs: Record<string, PdfRecord> = {};
  if (mockData.pdf) {
    mockPdfs[monthKey] = mockData.pdf;
  }
  
  const mockEntries: Record<string, DailyEntry[]> = {};
  mockData.entries.forEach(entry => {
    if (!mockEntries[entry.date]) {
      mockEntries[entry.date] = [];
    }
    mockEntries[entry.date].push(entry);
  });
  
  return { mockPdfs, mockEntries };
};

export function EmployeeProvider({ children }: { children: ReactNode }) {
  // Use first employee as logged-in user
  const currentEmployee = ALL_EMPLOYEES[0];
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  
  // Initialize with current month's data
  const initialData = loadMockDataForMonth(currentEmployee.id, currentEmployee.name, startOfMonth(new Date()));
  const [pdfs, setPdfs] = useState<Record<string, PdfRecord>>(initialData.mockPdfs);
  const [entries, setEntries] = useState<Record<string, DailyEntry[]>>(initialData.mockEntries);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set([format(startOfMonth(new Date()), "yyyy-MM")]));

  const loadMonthDataIfNeeded = (month: Date) => {
    const monthKey = format(month, "yyyy-MM");
    if (!loadedMonths.has(monthKey)) {
      const data = loadMockDataForMonth(currentEmployee.id, currentEmployee.name, month);
      setPdfs(prev => ({ ...prev, ...data.mockPdfs }));
      setEntries(prev => ({ ...prev, ...data.mockEntries }));
      setLoadedMonths(prev => new Set([...prev, monthKey]));
    }
  };

  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    loadMonthDataIfNeeded(newMonth);
  };
  
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    loadMonthDataIfNeeded(newMonth);
  };
  
  const goToCurrentMonth = () => {
    const newMonth = startOfMonth(new Date());
    setCurrentMonth(newMonth);
    loadMonthDataIfNeeded(newMonth);
  };

  const savePdf = (monthKey: string, pdf: PdfRecord) => {
    setPdfs((prev) => ({ ...prev, [monthKey]: pdf }));
  };

  const getPdf = (monthKey: string) => pdfs[monthKey];

  const saveEntry = (dateKey: string, entry: DailyEntry) => {
    setEntries((prev) => {
      const currentEntries = prev[dateKey] || [];
      // If editing, we might want to replace, but for now let's just append or replace if ID matches
      // Simple implementation: append
      return { ...prev, [dateKey]: [...currentEntries, entry] };
    });
  };

  const getEntries = (dateKey: string) => entries[dateKey] || [];

  return (
    <EmployeeContext.Provider
      value={{
        currentEmployeeId: currentEmployee.id,
        currentEmployeeName: currentEmployee.name,
        currentMonth,
        nextMonth,
        prevMonth,
        goToCurrentMonth,
        pdfs,
        savePdf,
        getPdf,
        entries,
        saveEntry,
        getEntries,
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
