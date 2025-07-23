"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
    }
  }, []);

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [accessToken, refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/login", { email, password });

      const { token, refreshToken } = response.data;

      setAccessToken(token);
      setRefreshToken(refreshToken);

      router.push("/editor"); // redireciona após login
    } catch (error) {
      console.error("Falha no login", error);
      throw error; // deixa o erro subir para a UI tratar
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
