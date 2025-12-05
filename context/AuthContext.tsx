// context/AuthContext.tsx
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { messages, roles, routes, type Role } from "../src/constants/ui";

type RoleOrNull = Role | null;

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
};

type AuthContextType = {
  role: RoleOrNull;
  user: User | null;
  login: (email: string, password: string) => void;
  register: (fullName: string, email: string, password: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleOrNull>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const login = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      setRole(foundUser.role);
      setUser(foundUser);
      if (foundUser.role === roles.employee) {
        router.replace(routes.employee as any);
      } else if (foundUser.role === roles.accountant) {
        router.replace(routes.accountant as any);
      }
    } else {
      alert(messages.invalidCredentials);
    }
  };

  const register = (fullName: string, email: string, password: string, role: Role) => {
    if (users.some((u) => u.email === email)) {
      alert(messages.userExists);
      return;
    }
    
    const newUser = { 
      id: Date.now().toString() + Math.random().toString(36), 
      fullName,
      email, 
      password, 
      role 
    };
    setUsers((prev) => [...prev, newUser]);
    
    setRole(role);
    setUser(newUser);
    if (role === roles.employee) {
      router.replace(routes.employee as any);
    } else if (role === roles.accountant) {
      router.replace(routes.accountant as any);
    }
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    router.replace(routes.auth as any);
  };

  return (
    <AuthContext.Provider value={{ role, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}