import Sidebar, { accountantMenuItems, employeeMenuItems } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useProfileIcon } from "@/hooks/useProfileIcon";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const PROFILE_ICONS = ['👤', '🧕', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻'];

export default function SettingsScreen() {
  const { user } = useAuth();
  const { profileIcon, saveIcon } = useProfileIcon(user?.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    // Validations
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (currentPassword !== user?.password) {
      setError('Current password is incorrect');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Implement actual password change logic
      // This would typically call an API endpoint

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch {
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const menuItems = user.role === 'employee' ? employeeMenuItems : accountantMenuItems;
  const userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <View className="flex-1 bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute="settings"
        menuItems={menuItems}
        userName={user.fullName || "User"}
        userRole={userRole}
        avatarColor={user.role === 'employee' ? "bg-blue-500" : "bg-violet-500"}
      />

      {/* Header */}
      <View className="flex-row justify-between items-center pt-[50px] px-4 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Feather name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6 max-w-4xl w-full self-center">
          {/* Profile Icon Selection Card */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Feather name="user" size={20} color="#3B82F6" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                Profile Icon
              </Text>
            </View>

            {/* Large Preview */}
            <View className="items-center mb-6">
              <View className="bg-blue-50 rounded-full w-32 h-32 items-center justify-center border-4 border-blue-200">
                <Text className="text-6xl">{profileIcon}</Text>
              </View>
            </View>

            {/* Icon Selection Grid */}
            <View className="flex-row flex-wrap justify-center gap-3">
              {PROFILE_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => saveIcon(icon)}
                  className={`w-16 h-16 rounded-xl items-center justify-center border-2 ${profileIcon === icon
                      ? 'bg-blue-500 border-blue-600 scale-110'
                      : 'bg-slate-50 border-slate-200'
                    }`}
                  style={{
                    transform: profileIcon === icon ? [{ scale: 1.1 }] : [{ scale: 1 }],
                  }}
                >
                  <Text className="text-3xl">{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Profile Information Card (Read-Only) */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Feather name="info" size={20} color="#3B82F6" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                Profile Information
              </Text>
            </View>

            <View className="space-y-4">
              {/* Full Name */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </Text>
                <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <Text className="text-base text-gray-600">{user.fullName}</Text>
                </View>
              </View>

              {/* Email */}
              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </Text>
                <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <Text className="text-base text-gray-600">{user.email}</Text>
                </View>
              </View>

              {/* Role */}
              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Role
                </Text>
                <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <Text className="text-base text-gray-600">{capitalizeRole(user.role)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Change Password Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Feather name="lock" size={20} color="#3B82F6" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                Change Password
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex-row items-center">
                <Feather name="alert-circle" size={20} color="#DC2626" />
                <Text className="text-sm text-red-600 ml-2 flex-1">{error}</Text>
              </View>
            )}

            {/* Success Message */}
            {success && (
              <View className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex-row items-center">
                <Feather name="check-circle" size={20} color="#16A34A" />
                <Text className="text-sm text-green-600 ml-2 flex-1">{success}</Text>
              </View>
            )}

            <View className="space-y-4">
              {/* Current Password */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-800"
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  editable={!isLoading}
                />
              </View>

              {/* New Password */}
              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-800"
                  placeholder="Enter new password (min 6 characters)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!isLoading}
                />
              </View>

              {/* Confirm Password */}
              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-800"
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className={`mt-6 rounded-xl px-6 py-4 border-2 ${isLoading
                    ? 'bg-slate-100 border-slate-300'
                    : 'bg-white border-blue-500'
                  }`}
                onPress={handlePasswordChange}
                disabled={isLoading}
              >
                <Text className={`text-center font-bold text-base ${isLoading ? 'text-slate-400' : 'text-blue-600'
                  }`}>
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
