import api from "../services/AxiosInstance";
import type { RegisterForm } from "../types/Register.type";
import type { LoginForm } from "../types/Login.type";
import type { VerifyForm } from "../types/Verify.type";

export const AuthService = {
  register: (data: RegisterForm) => {
    // API_URL hissəsini sildik
    return api.post(`/auth/register`, data);
  },
  verifyEmail: (data: VerifyForm) => {
    return api.post(`/auth/verify-email`, data);
  },
  login: (data: LoginForm) => {
    return api.post(`/auth/login`, data);
  },
  getProfile: () => {
    return api.get("/auth/profile");
  },
}