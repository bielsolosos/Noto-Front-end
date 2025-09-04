import axios from "axios";

// Usa variável de ambiente com fallback local
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
      console.log(
        `Token expirado (${error.response.status}), tentando refresh...`
      );

      // Se já tentou fazer refresh e ainda deu erro, desloga e redireciona
      if (originalRequest._retry) {
        console.log("Refresh token também expirado, fazendo logout...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("Nenhum refresh token encontrado, redirecionando...");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        console.log("Fazendo requisição de refresh token...");
        const res = await axios.post(`${apiUrl}/auth/refresh`, {
          refreshToken,
        });

        console.log("Refresh token bem sucedido:", res.data);
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro no refresh token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
