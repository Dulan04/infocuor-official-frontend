// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  function login(userData, token) {
    // Build a display name from firstName + lastName
    const enriched = {
      ...userData,
      name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
    };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(enriched));
    setUser(enriched);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}