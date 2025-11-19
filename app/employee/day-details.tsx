import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";

export default function DayDetailsScreen() {
  const { date } = useLocalSearchParams();
  const dateStr = date as string;
  const { getEntries } = useEmployee();
  const router = useRouter();

  const entries = getEntries(dateStr);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details for {dateStr}</Text>
      
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
                <Text style={styles.hours}>{item.hours}h</Text>
              </View>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
         <Button title="Add Entry" onPress={() => router.push({ pathname: "/employee/daily-entry", params: { date: dateStr } } as any)} />
         <Button title="Back" onPress={() => router.back()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop:50, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 24, textAlign: "center" },
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
  buttonContainer: { gap: 12, marginTop: 20 },
});
