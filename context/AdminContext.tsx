"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_logged_in");
    if (saved === "true") setIsLoggedIn(true);
  }, []);

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "forty2025") {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged_in", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged_in");
    if (typeof window !== "undefined") {
      window.location.href = "/admin/signin";
    }
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);