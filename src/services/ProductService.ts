import axiosInstance from "./AxiosInstance";

export interface ProductImage {
    id?: string;
    url: string;
    sortOrder?: number;
    isMain?: boolean;
}

export interface CreateProductPayload {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock?: number;
    categoryId: string;
    isActive?: boolean;
    imageUrl?: string;
    images?: ProductImage[];
}

export interface ProductItem {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock?: number;
    categoryId?: string;
    imageUrl?: string;
    images?: ProductImage[];
}

export type GetProductsResponse =
    | ProductItem[]
    | {
        data?: ProductItem[] | { items?: ProductItem[] };
        items?: ProductItem[];
    };

export const ProductService = {
    create: async (data: CreateProductPayload): Promise<ProductItem> => {
        const res = await axiosInstance.post<ProductItem>("/products", data);
        return res.data;
    },

    getAll: async (): Promise<GetProductsResponse> => {
        const res = await axiosInstance.get<GetProductsResponse>("/products");
        return res.data;
    },
};