import axios from "axios";
import type { CategoryForm } from "../types/Category.type";

const API_URL = "http://161.97.154.119/intern-api/api";

const getToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
};

const getConfig = () => {
  const token = getToken();

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const CategoryService = {
  getAll: (page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/categories`, {
      params: { page, pageSize },
      ...getConfig(),
    }),

  getById: (id: string) =>
    axios.get(`${API_URL}/categories/${id}`, getConfig()),

  create: (data: CategoryForm) =>
    axios.post(`${API_URL}/categories`, data, getConfig()),

  update: (id: string, data: CategoryForm) =>
    axios.patch(`${API_URL}/categories/${id}`, data, getConfig()),

  remove: (id: string) =>
    axios.delete(`${API_URL}/categories/${id}`, getConfig()),
};