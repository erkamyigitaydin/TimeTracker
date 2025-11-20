import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";

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
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{dateStr}</Text>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: "/employee/daily-entry", params: { date: dateStr } } as any)}
          style={styles.addButton}
        >
          <Feather name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No entries for this day.</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 13,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#333", flex: 1, textAlign: "center" },
  content: { flex: 1, padding: 16 },
  listContent: { gap: 12, paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: "#666", fontStyle: "italic", fontSize: 16 },
  entryCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  project: { fontWeight: "600", fontSize: 16, color: "#333" },
  hours: { fontWeight: "bold", fontSize: 16, color: "#007AFF" },
  description: { color: "#555", fontSize: 14 },
  buttonContainer: { gap: 12, marginTop: 10 },
});
