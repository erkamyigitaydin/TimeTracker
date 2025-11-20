import { format } from "date-fns";

export interface MockEntry {
  id: string;
  projectId: string;
  hours: number;
  description: string;
  date: string;
}

export interface MockPDF {
  uri: string;
  name: string;
  uploadDate: string;
}

const PROJECTS = ["Mobile App", "Backend", "Admin", "Testing", "Documentation"];

// Generate consistent mock data for a specific employee and month
export function generateEmployeeMockData(employeeId: string, employeeName: string, month: Date) {
  const entries: MockEntry[] = [];
  const year = month.getFullYear();
  const monthNum = month.getMonth();
  
  // Seed based on employeeId and month for consistency
  const seed = employeeId.charCodeAt(0) + year + monthNum;
  
  // Generate 15-20 working days
  const daysCount = 15 + (seed % 6);
  
  for (let day = 1; day <= daysCount; day++) {
    const dayOfMonth = Math.min(1 + Math.floor(day * 1.5), 28); // Keep within month bounds
    const dateStr = format(new Date(year, monthNum, dayOfMonth), "yyyy-MM-dd");
    
    // 2-3 entries per day
    const entriesPerDay = 2 + ((seed + day) % 2);
    
    for (let e = 0; e < entriesPerDay; e++) {
      const projectIndex = (seed + day + e) % PROJECTS.length;
      const project = PROJECTS[projectIndex];
      
      // Generate consistent hours (2-6 hours)
      const hours = 2 + ((seed + day * 10 + e * 5) % 40) / 10;
      
      entries.push({
        id: `${employeeId}-${dateStr}-${e}`,
        projectId: project,
        hours: parseFloat(hours.toFixed(1)),
        description: `Worked on ${project} tasks`,
        date: dateStr,
      });
    }
  }
  
  // PDF status - consistent based on employeeId
  const hasPdf = seed % 3 !== 0; // 2 out of 3 have PDF
  
  const pdf: MockPDF | undefined = hasPdf
    ? {
        uri: `mock-uri-${employeeId}-${format(month, "yyyy-MM")}`,
        name: `${employeeName.replace(" ", "_")}_${format(month, "MMM_yyyy")}.pdf`,
        uploadDate: new Date(year, monthNum, 5).toISOString(),
      }
    : undefined;
  
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const uniqueDays = new Set(entries.map(e => e.date)).size;
  
  return {
    entries,
    pdf,
    totalHours: parseFloat(totalHours.toFixed(1)),
    daysLogged: uniqueDays,
  };
}

// List of all employees in the system
export const ALL_EMPLOYEES = [
  { id: "emp1", name: "John Smith" },
  { id: "emp2", name: "Sarah Johnson" },
  { id: "emp3", name: "Michael Brown" },
  { id: "emp4", name: "Emily Davis" },
  { id: "emp5", name: "David Wilson" },
];
