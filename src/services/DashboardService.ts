import axiosInstance from "./AxiosInstance";

export const DashboardService = {
  getStats: async () => {
    const response =
      await axiosInstance.get(
        "/dashboard/stats"
      );

    return response.data;
  },
};