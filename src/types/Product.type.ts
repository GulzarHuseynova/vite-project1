export interface ProductImage {
    url: string;
    sortOrder?: number;
    isMain?: boolean;
}

export interface ProductForm {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    isActive?: boolean;
    imageUrl?: string;
    images?: ProductImage[];
}
