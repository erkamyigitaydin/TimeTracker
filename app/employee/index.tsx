import { Feather } from '@expo/vector-icons';
import { addDays, format, getDaysInMonth, startOfMonth } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useEmployee } from "../../context/EmployeeContext";
import { buttonLabels, dateFormats, labels, routes, screenTitles, symbols } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, iconSizes, layout, spacing } from "../theme";

export default function EmployeeHomeScreen() {
  const { logout } = useAuth();
  const { currentMonth, nextMonth, prevMonth, getPdf, getEntries } = useEmployee();
  const router = useRouter();

  const monthKey = format(currentMonth, dateFormats.yearMonth);
  const pdf = getPdf(monthKey);

  const handleViewPdf = async () => {
    if (!pdf?.uri) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (Platform.OS === "android") {
        // On Android, we need a content URI for IntentLauncher to work properly with other apps
        const contentUri = await FileSystem.getContentUriAsync(pdf.uri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1, 
          type: "application/pdf",
        });
      } else if (isAvailable) {
        // On iOS, shareAsync opens a preview sheet which is great for viewing
        await Sharing.shareAsync(pdf.uri, {
          mimeType: "application/pdf",
          dialogTitle: pdf.name,
          UTI: "com.adobe.pdf",
        });
      } else {
        alert("Sharing is not available on this device");
      }
    } catch (e) {
      console.error(e);
      alert("Could not open PDF: " + (e as Error).message);
    }
  };

  // Generate days for the current month
  const startDate = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = addDays(startDate, i);
    const dateKey = format(date, dateFormats.yearMonthDay);
    const entries = getEntries(dateKey);
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    return { date, dateKey, totalHours, hasEntries: entries.length > 0 };
  });

  // Calculate Summary
  const totalHoursMonth = days.reduce((sum, d) => sum + d.totalHours, 0);
  const workingDays = days.filter((d) => d.totalHours > 0).length;
  const avgDaily = workingDays > 0 ? (totalHoursMonth / workingDays).toFixed(1) : "0";

  return (
    <View style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.pageTitle}>{screenTitles.employeePage}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Feather name="log-out" size={iconSizes.lg} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth}>
          <Text style={styles.navText}>{symbols.chevronLeft}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{format(currentMonth, dateFormats.monthYear)}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text style={styles.navText}>{symbols.chevronRight}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalHoursMonth.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>{labels.totalHours}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{workingDays}</Text>
            <Text style={styles.summaryLabel}>{labels.daysWorked}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{avgDaily}h</Text>
            <Text style={styles.summaryLabel}>{labels.avgPerDay}</Text>
          </View>
        </View>

        {/* My Projects Button */}
        <TouchableOpacity
          style={styles.myProjectsButton}
          onPress={() => router.push(routes.employeeMyProjects as any)}
        >
          <View style={styles.projectsButtonContent}>
            <Feather name="briefcase" size={iconSizes.md} color={colors.success} />
            <Text style={styles.myProjectsButtonText}>My Projects</Text>
          </View>
          <Feather name="chevron-right" size={iconSizes.md} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* PDF Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.monthlyReportPdf}</Text>
          <View style={styles.pdfCard}>
            {pdf ? (
              <View>
                <Text style={styles.pdfName}>{pdf.name}</Text>
                <Text style={styles.pdfDate}>{labels.uploaded}: {format(new Date(pdf.uploadDate), dateFormats.monthDayTime)}</Text>
                <View style={styles.pdfActions}>
                  <Button title={buttonLabels.viewPdf} onPress={handleViewPdf} />
                  <Button title={buttonLabels.replace} onPress={() => router.push(routes.employeeUploadPdf as any)} color={colors.textSecondary} />
                </View>
              </View>
            ) : (
              <View style={styles.emptyPdf}>
                <Text style={styles.emptyText}>{labels.noPdfUploaded}</Text>
                <Button title={buttonLabels.uploadPdf} onPress={() => router.push(routes.employeeUploadPdf as any)} />
              </View>
            )}
          </View>
        </View>

        {/* Daily Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.dailyTracking}</Text>
          {days.map((day) => (
            <TouchableOpacity
              key={day.dateKey}
              style={styles.dayRow}
              onPress={() => router.push({ pathname: routes.employeeDayDetails, params: { date: day.dateKey } } as any)}
            >
              <View>
                <Text style={styles.dayDate}>{format(day.date, dateFormats.dayMonth)}</Text>
                <Text style={styles.dayHours}>{day.totalHours.toFixed(1)}h logged</Text>
              </View>
              <Text style={styles.chevron}>{symbols.chevronForward}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundWhite },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: layout.headerPaddingTopSmall,
    paddingHorizontal: layout.headerPaddingHorizontal,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pageTitle: { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  logoutButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  logoutIcon: { fontSize: iconSizes.lg, color: colors.danger, fontWeight: fontWeights.semibold },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundWhite,
  },
  navText: { fontSize: iconSizes.lg, fontWeight: fontWeights.bold, padding: spacing.sm, color: colors.primary },
  monthTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold },
  scrollContent: { padding: layout.scrollContentPadding, paddingBottom: layout.scrollContentPaddingBottom },
  
  summaryContainer: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryValue: { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  summaryLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 4 },

  projectsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  myProjectsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success + '30',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  projectsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  projectsButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  myProjectsButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.success,
  },

  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, marginBottom: spacing.md },
  
  pdfCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 12,
    padding: spacing.lg,
    backgroundColor: colors.backgroundLight,
  },
  pdfName: { fontWeight: fontWeights.semibold, fontSize: fontSizes.lg, marginBottom: 4 },
  pdfDate: { color: colors.textSecondary, fontSize: fontSizes.xs, marginBottom: spacing.md },
  pdfActions: { flexDirection: "row", gap: spacing.md },
  emptyPdf: { alignItems: "center", gap: spacing.sm, padding: spacing.sm },
  emptyText: { color: colors.textSecondary, fontStyle: "italic" },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dayDate: { fontSize: fontSizes.lg, fontWeight: fontWeights.medium },
  dayHours: { fontSize: fontSizes.md, color: colors.textSecondary },
  chevron: { fontSize: fontSizes.xl, color: colors.gray300, fontWeight: fontWeights.bold },
});
