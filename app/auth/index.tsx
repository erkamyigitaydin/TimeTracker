// app/(auth)/index.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter email and password");
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
          <Text style={styles.title}>Time Tracker</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e-mail"
              placeholderTextColor="#282323ff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#282323ff"

              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} />
          </View>

          <View style={styles.footer}>
            <Text>Don&apos;t have an account?</Text>
            <Button
              title="Create Account"
              onPress={() => router.push("/auth/create-account" as any)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32, textAlign: "center", color: "#333" },
  inputContainer: { gap: 16, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: { gap: 12 },
  footer: { marginTop: 32, alignItems: "center", gap: 8 },
});