// app/(auth)/create-account.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

type Role = "employee" | "accountant";

export default function CreateAccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState<Role>("employee");
  const { register } = useAuth();
  const router = useRouter();

  const handleCreate = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    // Register the user and auto-login
    register(email, password, role);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "employee" && styles.roleButtonActive,
          ]}
          onPress={() => setRoleState("employee")}
        >
          <Text style={[styles.roleText, role === "employee" && styles.roleTextActive]}>Employee</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "accountant" && styles.roleButtonActive,
          ]}
          onPress={() => setRoleState("accountant")}
        >
          <Text style={[styles.roleText, role === "accountant" && styles.roleTextActive]}>Accountant</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Create Account" onPress={handleCreate} />
        <Button title="Back to Login" onPress={() => router.back()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
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
  label: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#333" },
  roleContainer: { flexDirection: "row", gap: 12, marginBottom: 32 },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  roleButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  roleText: {
    fontSize: 16,
    color: "#666",
  },
  roleTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  buttonContainer: { gap: 12 },
});