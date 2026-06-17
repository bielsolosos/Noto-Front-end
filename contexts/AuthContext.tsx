"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  roles: string[];
  profileImageUrl?: string | null;
}
interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsLoading(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/");
  }, [router]);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const response = await api.get("api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error: unknown) {
      console.error("Erro ao buscar usuário:", error);
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (token && refresh) {
      setAccessToken(token);
      setRefreshToken(refresh);
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [accessToken, refreshToken]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("api/auth/login", {
        username,
        password,
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      setAccessToken(token);
      setRefreshToken(newRefreshToken);
      await fetchUser(token);
      router.push("/editor");
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    await fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, refreshUser, accessToken, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
