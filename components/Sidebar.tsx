import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

export interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route?: string;
}

// Employee menu items
export const employeeMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "home", route: "/employee" },
  { id: "timer", label: "Timer", icon: "clock", route: "/employee/timer" },
  { id: "projects", label: "Projects", icon: "folder", route: "/employee/my-projects" },
  { id: "clients", label: "Clients", icon: "users", route: "/employee/clients" },
  { id: "settings", label: "Settings", icon: "settings", route: "/employee/settings" },
];

// Accountant menu items
export const accountantMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "home", route: "/accountant" },
  { id: "employees", label: "Employees", icon: "users" },
  { id: "reports", label: "Reports", icon: "bar-chart-2" },
  { id: "settings", label: "Settings", icon: "settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute?: string;
  menuItems: MenuItem[];
  userName: string;
  userRole: string;
  avatarColor?: string;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  activeRoute = "dashboard",
  menuItems,
  userName,
  userRole,
  avatarColor = "bg-violet-500"
}: SidebarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateSidebar = useCallback((open: boolean) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: open ? 0 : -SIDEBAR_WIDTH,
        duration: open ? 250 : 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: open ? 1 : 0,
        duration: open ? 250 : 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  useEffect(() => {
    animateSidebar(isOpen);
  }, [isOpen, animateSidebar]);

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
          style={{ opacity: fadeAnim }}
        />
      </TouchableWithoutFeedback>

      {/* Sidebar Panel */}
      <Animated.View
        className="absolute top-0 bottom-0 left-0 bg-white border-r border-gray-200"
        style={{
          transform: [{ translateX: slideAnim }],
          width: SIDEBAR_WIDTH,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Header - Logo & Title */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center gap-3">
            {/* Logo Icon */}
            <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
              <Feather name="clock" size={20} color="#1F2937" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-800">WellTracker</Text>
              <Text className="text-xs text-gray-500">Time Tracking</Text>
            </View>
          </View>
          {/* Close/Panel Toggle Button */}
          <TouchableOpacity onPress={onClose} className="p-2">
            <Feather name="sidebar" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="flex-1 px-3">
        {menuItems.map((item) => {
        const isActive = activeRoute === item.id;
        return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleMenuPress(item)}
        className={`rounded-md mb-1 ${isActive ? "bg-gray-100" : ""}`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-3 px-3 py-2.5">
          <Feather
            name={item.icon}
            size={20}
            color={isActive ? "#1F2937" : "#6B7280"}
          />
          <Text
            className={`text-sm ${
              isActive
                ? "font-semibold text-gray-800"
                : "font-normal text-gray-600"
            }`}
          >
            {item.label}
          </Text>
            </View>
          </TouchableOpacity>
          );
         })}
        </View>

        {/* Bottom Section - User Profile & Sign Out */}
        <View className="border-t border-gray-100 px-4 py-4">
          {/* User Profile */}
          <View className="flex-row items-center gap-3 mb-3">
            <View className={`w-10 h-10 rounded-full ${avatarColor} items-center justify-center`}>
              <Text className="text-white font-bold text-base">{userInitial}</Text>
              
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-800">{userName}</Text>
              <Text className="text-xs text-gray-500">{userRole}</Text>
              <View style={{ marginBottom: 12 }} />
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 bg-red-600 rounded-lg py-3"
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={18} color="#ffffffff" />
            <Text className="text-sm font-medium text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
