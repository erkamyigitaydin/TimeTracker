// app/(auth)/create-account.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { buttonLabels, labels, messages, placeholders, roles, screenTitles, type Role } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, spacing } from "../theme";

export default function CreateAccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState<Role>(roles.employee);
  const { register } = useAuth();
  const router = useRouter();

  const handleCreate = () => {
    if (!email || !password) {
      alert(messages.fillAllFields);
      return;
    }
    // Register the user and auto-login
    register(email, password, role);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>{screenTitles.createAccount}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholders.email}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder={placeholders.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>{labels.selectRole}</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === roles.employee && styles.roleButtonActive,
              ]}
              onPress={() => setRoleState(roles.employee)}
            >
              <Text style={[styles.roleText, role === roles.employee && styles.roleTextActive]}>Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === roles.accountant && styles.roleButtonActive,
              ]}
              onPress={() => setRoleState(roles.accountant)}
            >
              <Text style={[styles.roleText, role === roles.accountant && styles.roleTextActive]}>Accountant</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button title={buttonLabels.createAccount} onPress={handleCreate} />
            <Button title={buttonLabels.backToLogin} onPress={() => router.back()} color={colors.textSecondary} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundWhite },
  inner: { flex: 1, padding: spacing.xl, justifyContent: "center" },
  title: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, marginBottom: spacing.xxl, textAlign: "center", color: colors.textPrimary },
  inputContainer: { gap: spacing.lg, marginBottom: spacing.xl },
  input: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSizes.lg,
    backgroundColor: colors.backgroundLight,
  },
  label: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, marginBottom: spacing.md, color: colors.textPrimary },
  roleContainer: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xxl },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  buttonContainer: { gap: spacing.md },
});