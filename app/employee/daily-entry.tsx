import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";

const MOCK_PROJECTS = ["Project A", "Project B", "Internal", "Training"];

export default function DailyEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dateStr = params.date as string; // "YYYY-MM-DD"
  
  const { saveEntry } = useEmployee();

  const [project, setProject] = useState(MOCK_PROJECTS[0]);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!hours || isNaN(Number(hours))) {
      alert("Please enter valid hours");
      return;
    }

    saveEntry(dateStr, {
      id: Date.now().toString(),
      projectId: project,
      hours: Number(hours),
      description,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Entry for {dateStr}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Project</Text>
        <View style={styles.projectSelector}>
          {MOCK_PROJECTS.map((p) => (
            <Text
              key={p}
              style={[styles.projectOption, project === p && styles.projectOptionActive]}
              onPress={() => setProject(p)}
            >
              {p}
            </Text>
          ))}
        </View>

        <Text style={styles.label}>Hours</Text>
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          placeholder="e.g. 8"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="What did you work on?"
          multiline
        />
      </View>

      <View style={styles.actions}>
        <Button title="Save Entry" onPress={handleSave} />
        <Button title="Cancel" onPress={() => router.back()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50,
    padding: 10, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 24, textAlign: "center" },
  form: { gap: 16, marginBottom: 32 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  projectSelector: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  projectOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#666",
  },
  projectOptionActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    color: "#fff",
    fontWeight: "600",
  },
  actions: { gap: 12 },
});
