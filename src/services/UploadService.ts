import axiosInstance from "./AxiosInstance";

export interface UploadResponse {
    urls: string[];
}

export const UploadService = {
    uploadProductImages: async (files: File[]): Promise<UploadResponse> => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("images", file);
        });

        const res = await axiosInstance.post<UploadResponse>(
            "/uploads/product-images",
            formData,
        );

        return res.data;
    },
};
