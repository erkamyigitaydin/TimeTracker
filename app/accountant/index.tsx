import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AccountantDashboardScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accountant Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} color="#FF3B30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 24 },
  buttonContainer: { marginTop: 20 },
});