import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { buttonLabels, messages, placeholders, routes, screenTitles } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, spacing } from "../theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      alert(messages.enterEmailPassword);
      return;
    }
    login(email, password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>{screenTitles.timeTracker}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholders.email}
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder={placeholders.password}
              placeholderTextColor={colors.textPlaceholder}

              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title={buttonLabels.login} onPress={handleLogin} />
          </View>

          <View style={styles.footer}>
            <Text>{messages.dontHaveAccount}</Text>
            <Button
              title={buttonLabels.createAccount}
              onPress={() => router.push(routes.authCreateAccount as any)}
            />
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
  buttonContainer: { gap: spacing.md },
  footer: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.sm },
});