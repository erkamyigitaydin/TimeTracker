import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";
import { buttonLabels, dateFormats, placeholders } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, layout, spacing } from "../theme";

export default function UploadPdfScreen() {
  const router = useRouter();
  const { currentMonth, savePdf } = useEmployee();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const monthKey = format(currentMonth, dateFormats.yearMonth);

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
      <Text style={styles.title}>{buttonLabels.uploadPdf} for {format(currentMonth, dateFormats.monthYear)}</Text>

      <View style={styles.card}>
        {selectedFile ? (
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>{(selectedFile.size ? selectedFile.size / 1024 : 0).toFixed(2)} KB</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholders.noFileSelected}</Text>
        )}

        <Button title={buttonLabels.selectPdf} onPress={pickDocument} />
      </View>

      <View style={styles.actions}>
        <Button title={buttonLabels.save} onPress={handleSave} disabled={!selectedFile} />
        <Button title={buttonLabels.cancel} onPress={() => router.back()} color={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: layout.headerPaddingTopSmall,
    padding: 10,flex: 1, backgroundColor: colors.backgroundWhite },
  title: { fontSize: fontSizes.xxl, fontWeight: fontWeights.semibold, marginBottom: spacing.xl, textAlign: "center" },
  card: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.backgroundLight,
  },
  placeholder: { color: colors.textSecondary, fontStyle: "italic" },
  fileInfo: { alignItems: "center", gap: 4 },
  fileName: { fontWeight: fontWeights.semibold, fontSize: fontSizes.lg },
  fileSize: { color: colors.textSecondary, fontSize: fontSizes.xs },
  actions: { gap: spacing.md },
});
