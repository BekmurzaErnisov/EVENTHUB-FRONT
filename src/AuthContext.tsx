import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, refreshToken?: string, userData?: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null)
      setIsAuthenticated(false)
    }
    window.addEventListener("auth:logout", handleAuthLogout)
    return () => window.removeEventListener("auth:logout", handleAuthLogout)
  }, [])
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("userToken");
  });

  const login = (token: string, refreshToken?: string, userData?: User) => {
    localStorage.setItem("userToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
