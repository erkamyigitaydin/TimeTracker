import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";
import { buttonLabels, labels, messages, mockProjects, placeholders } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, layout, spacing } from "../theme";

export default function DailyEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dateStr = params.date as string; // "YYYY-MM-DD"
  
  const { saveEntry } = useEmployee();

  const [project, setProject] = useState<string>(mockProjects[0]);
  const [startTime, setStartTime] = useState<string>(placeholders.startTime);
  const [endTime, setEndTime] = useState<string>(placeholders.endTime);
  const [description, setDescription] = useState("");

  const calculateHours = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return 0;
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    const diff = endMinutes - startMinutes;
    return diff > 0 ? Number((diff / 60).toFixed(1)) : 0;
  };

  const handleSave = () => {
    const calculatedHours = calculateHours(startTime, endTime);

    if (calculatedHours <= 0) {
      alert(messages.checkStartEndTimes);
      return;
    }

    saveEntry(dateStr, {
      id: Date.now().toString(),
      projectId: project,
      hours: calculatedHours,
      description,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Entry for {dateStr}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>{labels.project}</Text>
        <TextInput
          style={styles.input}
          value={project}
          onChangeText={setProject}
          placeholder={placeholders.projectName}
        />
        <View style={styles.projectSelector}>
          {mockProjects.map((p) => (
            <Text
              key={p}
              style={[styles.projectOption, project === p && styles.projectOptionActive]}
              onPress={() => setProject(p)}
            >
              {p}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>{labels.startTime}</Text>
            <TextInput
              style={styles.input}
              value={startTime}
              onChangeText={setStartTime}
              placeholder={placeholders.startTime}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>{labels.endTime}</Text>
            <TextInput
              style={styles.input}
              value={endTime}
              onChangeText={setEndTime}
              placeholder={placeholders.endTime}
            />
          </View>
        </View>

        <Text style={styles.label}>{labels.description}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder={placeholders.workDescription}
          multiline
        />
      </View>

      <View style={styles.actions}>
        <Button title={buttonLabels.saveEntry} onPress={handleSave} />
        <Button title={buttonLabels.cancel} onPress={() => router.back()} color={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: layout.headerPaddingTopSmall,
    padding: 10, backgroundColor: colors.backgroundWhite },
  title: { fontSize: fontSizes.xxl, fontWeight: fontWeights.semibold, marginBottom: spacing.xl, textAlign: "center" },
  form: { gap: spacing.lg, marginBottom: spacing.xxl },
  label: { fontWeight: fontWeights.semibold, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSizes.lg,
    backgroundColor: colors.backgroundLight,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  projectSelector: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  projectOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    color: colors.textSecondary,
  },
  projectOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  row: { flexDirection: "row", gap: spacing.md },
  halfInput: { flex: 1 },
  actions: { gap: spacing.md },
});
