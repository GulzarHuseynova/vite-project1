import api from "../services/AxiosInstance";
import type { RegisterForm } from "../types/Register.type";
import type { LoginForm } from "../types/Login.type";
import type { VerifyForm } from "../types/Verify.type";

const API_URL = "http://161.97.154.119/intern-api/api";



export const AuthService = {
  register: (data: RegisterForm) => {
    return api.post(`${API_URL}/auth/register`, data);
  },
  verifyEmail: (data: VerifyForm) => {
    return api.post(`${API_URL}/auth/verify-email`, data);
  },
  login: (data: LoginForm) => {
    return api.post(`${API_URL}/auth/login`, data);
  },
  getProfile: () => {
    return api.get("/auth/profile");
  },

};