import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccountant } from "../../context/AccountantContext";
import { buttonLabels, dateFormats, labels, messages, pdfStatus, symbols } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, iconSizes, layout, spacing } from "../theme";

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
        <Text>{messages.employeeNotFound}</Text>
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
    if (employee.pdfStatus === pdfStatus.missing) {
      Alert.alert(messages.noPdfAlertTitle, messages.noPdfAlertMessage);
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
          <Feather name="arrow-left" size={iconSizes.lg} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.title}>
            <Text style={styles.boldName}>{employee.employeeName}</Text> - {format(currentMonth, dateFormats.monthYear)}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{labels.summary}</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{employee.totalHours}h</Text>
            <Text style={styles.summaryLabel}>{labels.totalHours}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{employee.daysLogged}</Text>
            <Text style={styles.summaryLabel}>{labels.workingDays}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{projects.length}</Text>
            <Text style={styles.summaryLabel}>{labels.projects}</Text>
          </View>
        </View>
      </View>

      {/* Project Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{labels.projectBreakdown}</Text>
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
        <Text style={styles.sectionTitle}>{labels.timesheetPdf}</Text>
        <View style={styles.card}>
          {employee.pdfStatus === pdfStatus.uploaded ? (
            <>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfFileName}>{symbols.pdfEmoji} {employee.pdfFileName}</Text>
                <Text style={styles.pdfDate}>{labels.uploaded}: {employee.pdfUploadDate}</Text>
              </View>
              <Button title={buttonLabels.viewPdf} onPress={handleViewPDF} />
            </>
          ) : (
            <View style={styles.noPdf}>
              <Text style={styles.noPdfText}>{symbols.warningEmoji} {labels.noTimesheetUploaded}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Daily Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{labels.dailyBreakdown}</Text>
        {sortedDates.map((date) => {
          const dayEntries = entriesByDate[date];
          const dayTotal = dayEntries.reduce((sum, e) => sum + e.hours, 0);
          const isExpanded = expandedDays.has(date);

          return (
            <View key={date} style={styles.dayCard}>
              <TouchableOpacity onPress={() => toggleDay(date)} style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayDate}>{format(new Date(date), dateFormats.dayMonth)}</Text>
                  <Text style={styles.dayTotal}>{dayTotal.toFixed(1)}h</Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? symbols.expandDown : symbols.expandRight}</Text>
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
  container: { flex: 1, backgroundColor: colors.backgroundWhite },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: layout.headerPaddingTop,
    paddingHorizontal: layout.headerPaddingHorizontal,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitles: {
    flex: 1,
    alignItems: "center",
  },
  placeholder: { width: 40 },
  title: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  boldName: { fontWeight: fontWeights.bold },
  scrollContent: { padding: layout.scrollContentPadding, paddingBottom: layout.scrollContentPaddingBottom },
  
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, marginBottom: spacing.md },
  
  summaryGrid: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryItem: { alignItems: "center" },
  summaryValue: { fontSize: iconSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  summaryLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 4 },
  
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  projectItem: {
    marginBottom: spacing.lg,
  },
  projectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  projectName: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold },
  projectHours: { fontSize: fontSizes.lg, color: colors.textSecondary },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.borderDefault,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  projectPercentage: { fontSize: fontSizes.sm, color: colors.textSecondary, textAlign: "right" },
  
  pdfInfo: { marginBottom: spacing.md },
  pdfFileName: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, marginBottom: 4 },
  pdfDate: { fontSize: fontSizes.sm, color: colors.textSecondary },
  noPdf: { padding: spacing.lg, alignItems: "center" },
  noPdfText: { fontSize: fontSizes.base, color: colors.warning, fontWeight: fontWeights.medium },
  
  dayCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  dayInfo: { flex: 1 },
  dayDate: { fontSize: fontSizes.lg, fontWeight: fontWeights.medium, marginBottom: 2 },
  dayTotal: { fontSize: fontSizes.md, color: colors.textSecondary },
  expandIcon: { fontSize: fontSizes.md, color: colors.gray400, marginLeft: spacing.md },
  dayEntries: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: 10,
  },
  entryItem: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  entryProject: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
  entryHours: { fontSize: fontSizes.md, color: colors.textSecondary },
  entryDescription: { fontSize: fontSizes.sm, color: colors.textSecondary },
});
