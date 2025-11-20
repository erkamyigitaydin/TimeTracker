import { Feather } from '@expo/vector-icons';
import { addDays, format, getDaysInMonth, startOfMonth } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useEmployee } from "../../context/EmployeeContext";

export default function EmployeeHomeScreen() {
  const { logout } = useAuth();
  const { currentMonth, nextMonth, prevMonth, getPdf, getEntries } = useEmployee();
  const router = useRouter();

  const monthKey = format(currentMonth, "yyyy-MM");
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
    const dateKey = format(date, "yyyy-MM-dd");
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
        <Text style={styles.pageTitle}>Employee Page</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth}>
          <Text style={styles.navText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{format(currentMonth, "MMMM yyyy")}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text style={styles.navText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalHoursMonth.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{workingDays}</Text>
            <Text style={styles.summaryLabel}>Days Worked</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{avgDaily}h</Text>
            <Text style={styles.summaryLabel}>Avg / Day</Text>
          </View>
        </View>

        {/* PDF Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Report (PDF)</Text>
          <View style={styles.pdfCard}>
            {pdf ? (
              <View>
                <Text style={styles.pdfName}>{pdf.name}</Text>
                <Text style={styles.pdfDate}>Uploaded: {format(new Date(pdf.uploadDate), "MMM d, HH:mm")}</Text>
                <View style={styles.pdfActions}>
                  <Button title="View PDF" onPress={handleViewPdf} />
                  <Button title="Replace" onPress={() => router.push("/employee/upload-pdf" as any)} color="#666" />
                </View>
              </View>
            ) : (
              <View style={styles.emptyPdf}>
                <Text style={styles.emptyText}>No PDF uploaded for this month</Text>
                <Button title="Upload PDF" onPress={() => router.push("/employee/upload-pdf" as any)} />
              </View>
            )}
          </View>
        </View>

        {/* Daily Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tracking</Text>
          {days.map((day) => (
            <TouchableOpacity
              key={day.dateKey}
              style={styles.dayRow}
              onPress={() => router.push({ pathname: "/employee/day-details", params: { date: day.dateKey } } as any)}
            >
              <View>
                <Text style={styles.dayDate}>{format(day.date, "EEE, MMM d")}</Text>
                <Text style={styles.dayHours}>{day.totalHours.toFixed(1)}h logged</Text>
              </View>
              <Text style={styles.chevron}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pageTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutIcon: { fontSize: 24, color: "#FF3B30", fontWeight: "600" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  navText: { fontSize: 24, fontWeight: "bold", padding: 8, color: "#007AFF" },
  monthTitle: { fontSize: 18, fontWeight: "600" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  summaryContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryValue: { fontSize: 20, fontWeight: "bold", color: "#333" },
  summaryLabel: { fontSize: 12, color: "#666", marginTop: 4 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  
  pdfCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  pdfName: { fontWeight: "600", fontSize: 16, marginBottom: 4 },
  pdfDate: { color: "#666", fontSize: 12, marginBottom: 12 },
  pdfActions: { flexDirection: "row", gap: 12 },
  emptyPdf: { alignItems: "center", gap: 8, padding: 8 },
  emptyText: { color: "#666", fontStyle: "italic" },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayDate: { fontSize: 16, fontWeight: "500" },
  dayHours: { fontSize: 14, color: "#666" },
  chevron: { fontSize: 18, color: "#ccc", fontWeight: "bold" },
});
