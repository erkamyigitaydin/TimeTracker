import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAccountant } from "../../context/AccountantContext";
import { useAuth } from "../../context/AuthContext";
import { dateFormats, labels, routes, screenTitles, symbols } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, iconSizes, layout, spacing } from "../theme";

export default function AccountantDashboardScreen() {
  const { logout } = useAuth();
  const { currentMonth, nextMonth, previousMonth, getMonthData } = useAccountant();
  const router = useRouter();

  const monthData = getMonthData();

  return (
    <View style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.pageTitle}>{screenTitles.accountantPage}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Feather name="log-out" size={iconSizes.lg} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth}>
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
            <Text style={styles.summaryValue}>{monthData.totalEmployees}</Text>
            <Text style={styles.summaryLabel}>{labels.employees}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{monthData.totalHours}h</Text>
            <Text style={styles.summaryLabel}>{labels.totalHours}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{monthData.missingSubmissions}</Text>
            <Text style={styles.summaryLabel}>{labels.missingPdfs}</Text>
          </View>
        </View>

        {/* Employee List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.employees}</Text>
          {monthData.employees.map((emp) => (
            <TouchableOpacity
              key={emp.employeeId}
              style={styles.employeeRow}
              onPress={() => router.push(`${routes.accountantEmployeeDetail}?id=${emp.employeeId}` as any)}
            >
              <View>
                <Text style={styles.employeeName}>{emp.employeeName}</Text>
                <Text style={styles.employeeStats}>
                  {emp.totalHours}h • {emp.daysLogged} days • {emp.pdfStatus === "uploaded" ? "✓ PDF" : "⚠ No PDF"}
                </Text>
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
    paddingTop: layout.headerPaddingTop,
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

  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, marginBottom: spacing.md },
  
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  employeeName: { fontSize: fontSizes.lg, fontWeight: fontWeights.medium },
  employeeStats: { fontSize: fontSizes.md, color: colors.textSecondary },
  chevron: { fontSize: fontSizes.xl, color: colors.gray300, fontWeight: fontWeights.bold },
});
