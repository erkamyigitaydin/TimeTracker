/**
 * UI Constants
 * Application-specific constants for routes, roles, labels, messages, and content
 */

// ROUTES & NAVIGATION
export const routes = {
  // Auth routes
  auth: "/auth",
  authCreateAccount: "/auth/create-account",
  
  // Employee routes
  employee: "/employee",
  employeeDailyEntry: "/employee/daily-entry",
  employeeDayDetails: "/employee/day-details",
  employeeUploadPdf: "/employee/upload-pdf",
  
  // Accountant routes
  accountant: "/accountant",
  accountantEmployeeDetail: "/accountant/employee-detail",
} as const;

// ROLES
export const roles = {
  employee: "employee",
  accountant: "accountant",
} as const;

export type Role = typeof roles[keyof typeof roles];

// SCREEN TITLES

export const screenTitles = {
  employeePage: "Employee Page",
  accountantPage: "Accountant Page",
  timeTracker: "Time Tracker",
  login: "Login",
  createAccount: "Create Account",
} as const;

// BUTTON LABELS

export const buttonLabels = {
  login: "Login",
  logout: "Logout",
  createAccount: "Create Account",
  backToLogin: "Back to Login",
  save: "Save",
  saveEntry: "Save Entry",
  cancel: "Cancel",
  viewPdf: "View PDF",
  uploadPdf: "Upload PDF",
  replace: "Replace",
  selectPdf: "Select PDF",
  addEntry: "Add Entry",
} as const;

// PLACEHOLDER TEXT
export const placeholders = {
  email: "e-mail",
  password: "password",
  projectName: "Enter project name",
  startTime: "09:00",
  endTime: "18:00",
  workDescription: "What did you work on?",
  noFileSelected: "No file selected",
} as const;

// LABELS & TEXT
export const labels = {
  email: "Email",
  password: "Password",
  selectRole: "Select Role",
  project: "Project",
  startTime: "Start Time",
  endTime: "End Time",
  description: "Description",
  
  // Summary labels
  totalHours: "Total Hours",
  daysWorked: "Days Worked",
  avgPerDay: "Avg / Day",
  employees: "Employees",
  missingPdfs: "Missing PDFs",
  workingDays: "Working Days",
  projects: "Projects",
  
  // Section titles
  monthlyReportPdf: "Monthly Report (PDF)",
  dailyTracking: "Daily Tracking",
  summary: "Summary",
  projectBreakdown: "Project Breakdown",
  timesheetPdf: "Timesheet PDF",
  dailyBreakdown: "Daily Breakdown",
  
  // Other
  uploaded: "Uploaded",
  noPdfUploaded: "No PDF uploaded for this month",
  noTimesheetUploaded: "No timesheet uploaded",
  noEntriesDay: "No entries for this day.",
} as const;

// MESSAGES

export const messages = {
  // Validation
  enterEmailPassword: "Please enter email and password",
  fillAllFields: "Please fill in all fields",
  checkStartEndTimes: "Please check start and end times. Format HH:MM",
  
  // Auth
  invalidCredentials: "Invalid email or password",
  userExists: "User already exists",
  dontHaveAccount: "Don't have an account?",
  
  // PDF
  noPdfAlertTitle: "No PDF",
  noPdfAlertMessage: "This employee hasn't uploaded a timesheet for this month.",
  employeeNotFound: "Employee not found",
  
  // Sharing
  sharingNotAvailable: "Sharing is not available on this device",
  couldNotOpenPdf: "Could not open PDF: ",
} as const;

// MOCK DATA
export const mockProjects = ["Project A", "Project B", "Internal", "Training"] as const;

// PDF STATUS
export const pdfStatus = {
  uploaded: "uploaded",
  missing: "missing",
} as const;

export type PdfStatus = typeof pdfStatus[keyof typeof pdfStatus];

// SYMBOLS & ICONS
export const symbols = {
  chevronLeft: "<",
  chevronRight: ">",
  chevronForward: ">",
  expandDown: "▼",
  expandRight: "▶",
  pdfEmoji: "📄",
  warningEmoji: "⚠️",
  checkmark: "✓",
} as const;

// DATE FORMATS
export const dateFormats = {
  monthYear: "MMMM yyyy",
  yearMonth: "yyyy-MM",
  yearMonthDay: "yyyy-MM-dd",
  dayMonth: "EEE, MMM d",
  monthDayTime: "MMM d, HH:mm",
} as const;
