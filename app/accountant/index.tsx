import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccountant } from "../../context/AccountantContext";
import { useAuth } from "../../context/AuthContext";

export default function AccountantDashboardScreen() {
  const { logout } = useAuth();
  const { currentMonth, nextMonth, previousMonth, getMonthData } = useAccountant();
  const router = useRouter();

  const monthData = getMonthData();

  return (
    <View style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.pageTitle}>Accountant Page</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth}>
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
            <Text style={styles.summaryValue}>{monthData.totalEmployees}</Text>
            <Text style={styles.summaryLabel}>Employees</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{monthData.totalHours}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{monthData.missingSubmissions}</Text>
            <Text style={styles.summaryLabel}>Missing PDFs</Text>
          </View>
        </View>

        {/* Employee List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employees</Text>
          {monthData.employees.map((emp) => (
            <TouchableOpacity
              key={emp.employeeId}
              style={styles.employeeRow}
              onPress={() => router.push(`/accountant/employee-detail?id=${emp.employeeId}` as any)}
            >
              <View>
                <Text style={styles.employeeName}>{emp.employeeName}</Text>
                <Text style={styles.employeeStats}>
                  {emp.totalHours}h • {emp.daysLogged} days • {emp.pdfStatus === "uploaded" ? "✓ PDF" : "⚠ No PDF"}
                </Text>
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
    paddingTop: 60,
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
  
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  employeeName: { fontSize: 16, fontWeight: "500" },
  employeeStats: { fontSize: 14, color: "#666" },
  chevron: { fontSize: 18, color: "#ccc", fontWeight: "bold" },
});
