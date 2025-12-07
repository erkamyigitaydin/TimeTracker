import { buttonLabels, messages, placeholders, routes, screenTitles } from "@/constants/ui";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

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
        className="flex-1 bg-white"
      >
        <View className="flex-1 px-xl justify-center">
          <Text className="text-4xl font-bold mb-2xl text-center text-gray-700">{screenTitles.timeTracker}</Text>

          <View className="gap-lg mb-xl">
            <TextInput
              className="border border-gray-200 rounded-md px-lg py-md text-lg bg-gray-50"
              placeholder={placeholders.email}
              placeholderTextColor="#CCCCCC"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              className="border border-gray-200 rounded-md px-lg py-md text-lg bg-gray-50"
              placeholder={placeholders.password}
              placeholderTextColor="#CCCCCC"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="gap-md">
            <Button title={buttonLabels.login} onPress={handleLogin} />
          </View>

          <View className="mt-2xl items-center gap-sm">
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