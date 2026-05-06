import axios from "axios";
import { toast } from "sonner";
import { env } from "./env";

const apiUrl = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

// Interceptor para incluir o token de acesso automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com token expirado
interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Trata tanto 401 (Unauthorized) quanto 403 (Forbidden) como token expirado
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Se já tentou fazer refresh e ainda deu erro, desloga e redireciona
      if (originalRequest._retry) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Sessão expirada. Faça login novamente.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string | null>(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${apiUrl}/api/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem("accessToken", token);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        processQueue(null, token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Não foi possível renovar a sessão. Faça login novamente.");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
