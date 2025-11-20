import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccountant } from "../../context/AccountantContext";

export default function AccountantEmployeeDetailScreen() {
  const params = useLocalSearchParams();
  const employeeId = params.id as string;
  const router = useRouter();

  const { getEmployeeDetail, currentMonth } = useAccountant();
  const employee = getEmployeeDetail(employeeId);

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text>Employee not found</Text>
      </View>
    );
  }

  // Group entries by date
  const entriesByDate = employee.entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof employee.entries>);

  // Sort dates
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => a.localeCompare(b));

  // Project breakdown
  const projectBreakdown = employee.entries.reduce((acc, entry) => {
    if (!acc[entry.projectId]) acc[entry.projectId] = 0;
    acc[entry.projectId] += entry.hours;
    return acc;
  }, {} as Record<string, number>);

  const projects = Object.entries(projectBreakdown)
    .map(([name, hours]) => ({
      name,
      hours: parseFloat(hours.toFixed(1)),
      percentage: parseFloat(((hours / employee.totalHours) * 100).toFixed(0)),
    }))
    .sort((a, b) => b.hours - a.hours);

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const handleViewPDF = async () => {
    if (employee.pdfStatus === "missing") {
      Alert.alert("No PDF", "This employee hasn't uploaded a timesheet for this month.");
      return;
    }

    // Mock PDF viewing
    Alert.alert("PDF Viewer", `Viewing: ${employee.pdfFileName}\nUploaded: ${employee.pdfUploadDate}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.title}>
            <Text style={styles.boldName}>{employee.employeeName}</Text> - {format(currentMonth, "MMMM yyyy")}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{employee.totalHours}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{employee.daysLogged}</Text>
            <Text style={styles.summaryLabel}>Working Days</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{projects.length}</Text>
            <Text style={styles.summaryLabel}>Projects</Text>
          </View>
        </View>
      </View>

      {/* Project Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Breakdown</Text>
        <View style={styles.card}>
          {projects.map((project) => (
            <View key={project.name} style={styles.projectItem}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectHours}>{project.hours}h</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${project.percentage}%` }]} />
              </View>
              <Text style={styles.projectPercentage}>{project.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* PDF Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timesheet PDF</Text>
        <View style={styles.card}>
          {employee.pdfStatus === "uploaded" ? (
            <>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfFileName}>📄 {employee.pdfFileName}</Text>
                <Text style={styles.pdfDate}>Uploaded: {employee.pdfUploadDate}</Text>
              </View>
              <Button title="View PDF" onPress={handleViewPDF} />
            </>
          ) : (
            <View style={styles.noPdf}>
              <Text style={styles.noPdfText}>⚠️ No timesheet uploaded</Text>
            </View>
          )}
        </View>
      </View>

      {/* Daily Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        {sortedDates.map((date) => {
          const dayEntries = entriesByDate[date];
          const dayTotal = dayEntries.reduce((sum, e) => sum + e.hours, 0);
          const isExpanded = expandedDays.has(date);

          return (
            <View key={date} style={styles.dayCard}>
              <TouchableOpacity onPress={() => toggleDay(date)} style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayDate}>{format(new Date(date), "EEE, MMM d")}</Text>
                  <Text style={styles.dayTotal}>{dayTotal.toFixed(1)}h</Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.dayEntries}>
                  {dayEntries.map((entry) => (
                    <View key={entry.id} style={styles.entryItem}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.entryProject}>{entry.projectId}</Text>
                        <Text style={styles.entryHours}>{entry.hours}h</Text>
                      </View>
                      {entry.description && (
                        <Text style={styles.entryDescription}>{entry.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitles: {
    flex: 1,
    alignItems: "center",
  },
  placeholder: { width: 40 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  boldName: { fontWeight: "700" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  
  summaryGrid: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryItem: { alignItems: "center" },
  summaryValue: { fontSize: 24, fontWeight: "bold", color: "#333" },
  summaryLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  projectItem: {
    marginBottom: 16,
  },
  projectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  projectName: { fontSize: 16, fontWeight: "600" },
  projectHours: { fontSize: 16, color: "#666" },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  projectPercentage: { fontSize: 13, color: "#666", textAlign: "right" },
  
  pdfInfo: { marginBottom: 12 },
  pdfFileName: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  pdfDate: { fontSize: 13, color: "#666" },
  noPdf: { padding: 16, alignItems: "center" },
  noPdfText: { fontSize: 15, color: "#FF9500", fontWeight: "500" },
  
  dayCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  dayInfo: { flex: 1 },
  dayDate: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
  dayTotal: { fontSize: 14, color: "#666" },
  expandIcon: { fontSize: 14, color: "#999", marginLeft: 12 },
  dayEntries: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 12,
    paddingTop: 8,
    gap: 10,
  },
  entryItem: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#007AFF",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryProject: { fontSize: 14, fontWeight: "600" },
  entryHours: { fontSize: 14, color: "#666" },
  entryDescription: { fontSize: 13, color: "#666" },
});
