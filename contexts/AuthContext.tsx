"use client";

import api from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
}
interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
      fetchUser(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [accessToken, refreshToken]);

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/login", { email, password });

      const { token, refreshToken } = response.data;

      setAccessToken(token);
      setRefreshToken(refreshToken);
      await fetchUser(token);
      router.push("/editor");
    } catch (error) {
      console.error("Falha no login", error);
      throw error;
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
    <AuthContext.Provider value={{ login, logout, accessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
