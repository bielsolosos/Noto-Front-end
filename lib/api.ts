import axios from "axios";
import toast from "react-hot-toast";

// Detectar se está no servidor ou no cliente
const isServer = typeof window === "undefined";

// No servidor, sempre usa o backend interno
// No cliente, usa a variável de ambiente pública
const apiUrl = isServer
  ? "http://backend:8080"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

console.log(`[API] ${isServer ? "Server" : "Client"}-side URL:`, apiUrl);

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

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${apiUrl}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Não foi possível renovar a sessão. Faça login novamente.");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
