
import axios from "axios";

const api = axios.create({
  baseURL: "http://161.97.154.119/intern-api/api",
});

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];


api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        const response = await axios.post(
          "http://161.97.154.119/intern-api/api/auth/refresh",
          {
            refreshToken,
          }
        );

        const newAccessToken =
          response.data?.accessToken ||
          response.data?.data
            ?.accessToken;

        const newRefreshToken =
          response.data?.refreshToken ||
          response.data?.data
            ?.refreshToken;

        if (!newAccessToken) {
          throw new Error(
            "Access token not found"
          );
        }

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        if (newRefreshToken) {
          localStorage.setItem(
            "refreshToken",
            newRefreshToken
          );
        }

     
        api.defaults.headers.Authorization =
          `Bearer ${newAccessToken}`;

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

  
        queue.forEach((cb) =>
          cb(newAccessToken)
        );

        queue = [];

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;