export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  productsCount?: number;
}

export interface CategoryForm {
  name: string;
  description?: string;
  isActive: boolean;
}