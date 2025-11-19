import { addMonths, format, startOfMonth, subDays, subMonths } from "date-fns";
import React, { createContext, ReactNode, useContext, useState } from "react";

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

// Mock Data Generation
const generateMockData = () => {
  const today = new Date();
  const currentMonthKey = format(today, "yyyy-MM");
  const yesterdayKey = format(subDays(today, 1), "yyyy-MM-dd");
  const todayKey = format(today, "yyyy-MM-dd");
  const twoDaysAgoKey = format(subDays(today, 2), "yyyy-MM-dd");

  const mockPdfs: Record<string, PdfRecord> = {
    [currentMonthKey]: {
      uri: "mock-uri",
      name: `Report_${format(today, "MMMM")}.pdf`,
      uploadDate: subDays(today, 5).toISOString(),
    },
  };

  const mockEntries: Record<string, DailyEntry[]> = {
    [twoDaysAgoKey]: [
      { id: "1", projectId: "Project A", hours: 8, description: "Initial setup and requirements" },
    ],
    [yesterdayKey]: [
      { id: "2", projectId: "Project A", hours: 4, description: "Frontend development" },
      { id: "3", projectId: "Internal", hours: 2, description: "Team meeting" },
    ],
    [todayKey]: [
      { id: "4", projectId: "Project B", hours: 5, description: "API integration" },
    ],
  };

  return { mockPdfs, mockEntries };
};

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const { mockPdfs, mockEntries } = generateMockData();
  
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [pdfs, setPdfs] = useState<Record<string, PdfRecord>>(mockPdfs);
  const [entries, setEntries] = useState<Record<string, DailyEntry[]>>(mockEntries);

  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToCurrentMonth = () => setCurrentMonth(startOfMonth(new Date()));

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
