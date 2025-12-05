// app/(auth)/create-account.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { buttonLabels, labels, messages, placeholders, roles, screenTitles, type Role } from "../../src/constants/ui";

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState<Role>(roles.employee);
  const { register } = useAuth();
  const router = useRouter();

  const handleCreate = () => {
    if (!fullName || !email || !password) {
      alert(messages.fillAllFields);
      return;
    }
    register(fullName, email, password, role);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <View className="flex-1 px-xl justify-center">
          <Text className="text-4xl font-bold mb-2xl text-center text-gray-700">{screenTitles.createAccount}</Text>

          <View className="gap-lg mb-xl">
            <TextInput
              className="border border-gray-200 rounded-md px-lg py-md text-lg bg-gray-50"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <TextInput
              className="border border-gray-200 rounded-md px-lg py-md text-lg bg-gray-50"
              placeholder={placeholders.email}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              className="border border-gray-200 rounded-md px-lg py-md text-lg bg-gray-50"
              placeholder={placeholders.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text className="text-lg font-semibold mb-md text-gray-700">{labels.selectRole}</Text>
          <View className="flex-row gap-md mb-2xl">
            <TouchableOpacity
              className={`flex-1 border rounded-md p-lg items-center ${
                role === roles.employee 
                  ? "border-primary bg-primary-light" 
                  : "border-gray-200 bg-gray-50"
              }`}
              onPress={() => setRoleState(roles.employee)}
            >
              <Text className={`text-lg ${
                role === roles.employee 
                  ? "text-primary font-semibold" 
                  : "text-gray-500"
              }`}>Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 border rounded-md p-lg items-center ${
                role === roles.accountant 
                  ? "border-primary bg-primary-light" 
                  : "border-gray-200 bg-gray-50"
              }`}
              onPress={() => setRoleState(roles.accountant)}
            >
              <Text className={`text-lg ${
                role === roles.accountant 
                  ? "text-primary font-semibold" 
                  : "text-gray-500"
              }`}>Accountant</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-md">
            <Button title={buttonLabels.createAccount} onPress={handleCreate} />
            <Button title={buttonLabels.backToLogin} onPress={() => router.back()} color="#666666" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}