import { messages, roles, routes, type Role } from "@/constants/ui";
import { authService, User } from "@/services/authService";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type RoleOrNull = Role | null;

type AuthContextType = {
  role: RoleOrNull;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleOrNull>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Load session on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionUser = await authService.getSession();
        if (sessionUser) {
          setUser(sessionUser);
          setRole(sessionUser.role);
        }
      } catch (e) {
        console.error('Failed to load session', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // Protect routes based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    // Simple route protection logic
    if (!user && !inAuthGroup) {
      // Check if we are already in an auth route to avoid loops
      // Ideally you'd use a more robust check here based on your path structure
    }
  }, [user, isLoading, segments]);

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await authService.login(email, password);
      await authService.setSession(loggedUser);

      setRole(loggedUser.role);
      setUser(loggedUser);

      if (loggedUser.role === roles.employee) {
        router.replace(routes.employee as any);
      } else if (loggedUser.role === roles.accountant) {
        router.replace(routes.accountant as any);
      }
    } catch (e) {
      alert(messages.invalidCredentials);
    }
  };

  const register = async (fullName: string, email: string, password: string, role: Role) => {
    try {
      const newUser = await authService.register(fullName, email, password, role);
      await authService.setSession(newUser);

      setRole(role);
      setUser(newUser);

      if (role === roles.employee) {
        router.replace(routes.employee as any);
      } else if (role === roles.accountant) {
        router.replace(routes.accountant as any);
      }
    } catch (e: any) {
      if (e.message === 'User already exists') {
        alert(messages.userExists);
      } else {
        alert('Registration failed');
      }
    }
  };

  const logout = async () => {
    await authService.clearSession();
    setRole(null);
    setUser(null);
    router.replace(routes.auth as any);
  };

  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}