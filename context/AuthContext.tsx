// context/AuthContext.tsx
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";

type Role = "employee" | "accountant" | null;

type User = {
  email: string;
  password: string;
  role: "employee" | "accountant";
};

type AuthContextType = {
  role: Role;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, role: "employee" | "accountant") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const login = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setRole(user.role);
      if (user.role === "employee") {
        router.replace("/employee" as any);
      } else if (user.role === "accountant") {
        router.replace("/accountant" as any);
      }
    } else {
      alert("Invalid email or password");
    }
  };

  const register = (email: string, password: string, role: "employee" | "accountant") => {
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      alert("User already exists");
      return;
    }
    
    const newUser = { email, password, role };
    setUsers((prev) => [...prev, newUser]);
    
    // Auto login after register
    setRole(role);
    if (role === "employee") {
      router.replace("/employee" as any);
    } else if (role === "accountant") {
      router.replace("/accountant" as any);
    }
  };

  const logout = () => {
    setRole(null);
    router.replace("/auth" as any);
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