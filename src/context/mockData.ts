// List of all employees in the system
export const ALL_EMPLOYEES = [
  { id: "emp1", name: "John Smith" },
  { id: "emp2", name: "Sarah Johnson" },
  { id: "emp3", name: "Michael Brown" },
  { id: "emp4", name: "Emily Davis" },
  { id: "emp5", name: "David Wilson" },
];

// Projects list for mock data
const PROJECTS = [
  "Website Redesign",
  "Mobile App",
  "API Development",
  "Database Migration",
  "UI/UX Research",
  "Client Meeting",
];

interface EmployeeEntry {
  id: string;
  projectId: string;
  hours: number;
  description: string;
  date: string;
}

interface EmployeeMockData {
  totalHours: number;
  daysLogged: number;
  entries: EmployeeEntry[];
  pdf?: {
    name: string;
    uploadDate: string;
  };
}

// Generate mock timesheet data for an employee for a given month
export function generateEmployeeMockData(
  employeeId: string,
  employeeName: string,
  month: Date
): EmployeeMockData {
  const year = month.getFullYear();
  const monthNum = month.getMonth();
  
  // Random number of working days (15-22 days)
  const daysLogged = Math.floor(Math.random() * 8) + 15;
  
  const entries: EmployeeEntry[] = [];
  const usedDates = new Set<number>();
  
  // Generate random working days
  while (usedDates.size < daysLogged) {
    const day = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    usedDates.add(day);
  }
  
  // Generate entries for each working day
  Array.from(usedDates).sort((a, b) => a - b).forEach((day, index) => {
    const date = new Date(year, monthNum, day);
    const dateStr = date.toISOString().split('T')[0];
    
    // 1-3 entries per day
    const entriesPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < entriesPerDay; i++) {
      const projectId = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
      const hours = parseFloat((Math.random() * 4 + 2).toFixed(1)); // 2-6 hours
      const hasDescription = Math.random() > 0.5;
      
      entries.push({
        id: `${employeeId}-${dateStr}-${i}`,
        projectId,
        hours,
        description: hasDescription ? `Work on ${projectId.toLowerCase()} tasks` : "",
        date: dateStr,
      });
    }
  });
  
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  
  // 70% chance of having PDF uploaded
  const hasPdf = Math.random() > 0.3;
  
  return {
    totalHours: parseFloat(totalHours.toFixed(1)),
    daysLogged,
    entries,
    pdf: hasPdf ? {
      name: `${employeeName.replace(' ', '_')}_${month.getFullYear()}_${String(month.getMonth() + 1).padStart(2, '0')}.pdf`,
      uploadDate: new Date(year, monthNum, 28).toISOString(),
    } : undefined,
  };
}
