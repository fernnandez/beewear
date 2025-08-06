import axios from "axios";
import { API_CONFIG } from "../utils/constants";

// Função para obter cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Função para deletar cookie
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getCookie("beewear-auth-token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      deleteCookie("beewear-auth-token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
