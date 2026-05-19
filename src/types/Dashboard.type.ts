export interface Category {
  id: string;
  name: string;
}

export interface LatestProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  category: Category;
}

export interface DashboardStats {
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  verifiedUsers: number;
  lowStockProducts: number;
  totalStock: number;
  totalInventoryValue: string;
  latestProducts: LatestProduct[];
}