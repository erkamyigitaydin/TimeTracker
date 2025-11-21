import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";
import { labels, routes } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, iconSizes, layout, spacing } from "../theme";

export default function DayDetailsScreen() {
  const { date } = useLocalSearchParams();
  const dateStr = date as string;
  const { getEntries } = useEmployee();
  const router = useRouter();

  const entries = getEntries(dateStr);

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={iconSizes.lg} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{dateStr}</Text>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: routes.employeeDailyEntry, params: { date: dateStr } } as any)}
          style={styles.addButton}
        >
          <Feather name="plus" size={iconSizes.lg} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{labels.noEntriesDay}</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.project}>{item.projectId}</Text>
                <Text style={styles.hours}>{item.hours.toFixed(1)}h</Text>
              </View>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
          )}
        />
      )}
      </View>
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
    paddingBottom: layout.headerPaddingBottomLarge,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: spacing.sm,
  },
  addButton: {
    padding: spacing.sm,
  },
  title: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, color: colors.textPrimary, flex: 1, textAlign: "center" },
  content: { flex: 1, padding: layout.containerPadding },
  listContent: { gap: spacing.md, paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textSecondary, fontStyle: "italic", fontSize: fontSizes.lg },
  entryCard: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm },
  project: { fontWeight: fontWeights.semibold, fontSize: fontSizes.lg, color: colors.textPrimary },
  hours: { fontWeight: fontWeights.bold, fontSize: fontSizes.lg, color: colors.primary },
  description: { color: colors.gray600, fontSize: fontSizes.md },
  buttonContainer: { gap: spacing.md, marginTop: 10 },
});
