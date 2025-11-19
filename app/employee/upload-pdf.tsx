import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";

export default function UploadPdfScreen() {
  const router = useRouter();
  const { currentMonth, savePdf } = useEmployee();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const monthKey = format(currentMonth, "yyyy-MM");

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    setSelectedFile(result.assets[0]);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    savePdf(monthKey, {
      uri: selectedFile.uri,
      name: selectedFile.name,
      uploadDate: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload PDF for {format(currentMonth, "MMMM yyyy")}</Text>

      <View style={styles.card}>
        {selectedFile ? (
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>{(selectedFile.size ? selectedFile.size / 1024 : 0).toFixed(2)} KB</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>No file selected</Text>
        )}

        <Button title="Select PDF" onPress={pickDocument} />
      </View>

      <View style={styles.actions}>
        <Button title="Save" onPress={handleSave} disabled={!selectedFile} />
        <Button title="Cancel" onPress={() => router.back()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 50,
    padding: 10,flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 24, textAlign: "center" },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    backgroundColor: "#f9f9f9",
  },
  placeholder: { color: "#666", fontStyle: "italic" },
  fileInfo: { alignItems: "center", gap: 4 },
  fileName: { fontWeight: "600", fontSize: 16 },
  fileSize: { color: "#666", fontSize: 12 },
  actions: { gap: 12 },
});
