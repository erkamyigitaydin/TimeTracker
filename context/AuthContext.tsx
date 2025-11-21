// context/AuthContext.tsx
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { messages, roles, routes, type Role } from "../src/constants/ui";

type RoleOrNull = Role | null;

type User = {
  email: string;
  password: string;
  role: Role;
};

type AuthContextType = {
  role: RoleOrNull;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleOrNull>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const login = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setRole(user.role);
      if (user.role === roles.employee) {
        router.replace(routes.employee as any);
      } else if (user.role === roles.accountant) {
        router.replace(routes.accountant as any);
      }
    } else {
      alert(messages.invalidCredentials);
    }
  };

  const register = (email: string, password: string, role: Role) => {
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      alert(messages.userExists);
      return;
    }
    
    const newUser = { email, password, role };
    setUsers((prev) => [...prev, newUser]);
    
    // Auto login after register
    setRole(role);
    if (role === roles.employee) {
      router.replace(routes.employee as any);
    } else if (role === roles.accountant) {
      router.replace(routes.accountant as any);
    }
  };

  const logout = () => {
    setRole(null);
    router.replace(routes.auth as any);
  };

  return (
    <AuthContext.Provider value={{ role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}