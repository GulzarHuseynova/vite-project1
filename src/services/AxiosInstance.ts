import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = "http://161.97.154.119/intern-api/api";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const api = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let queue: QueueItem[] = [];

const isAuthRequest = (url?: string) => {
  if (!url) return false;

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/verify-email") ||
    url.includes("/auth/refresh")
  );
};

const resolveQueue = (token: string) => {
  queue.forEach(({ resolve }) => resolve(token));
  queue = [];
};

const rejectQueue = (error: unknown) => {
  queue.forEach(({ reject }) => reject(error));
  queue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || originalRequest._retry || isAuthRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken =
        response.data?.accessToken || response.data?.data?.accessToken;

      const newRefreshToken =
        response.data?.refreshToken || response.data?.data?.refreshToken;

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      localStorage.setItem("accessToken", newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      resolveQueue(newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      rejectQueue(refreshError);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;