export type Role = "super_admin" | "admin" | "staff";
export type UserStatus = "active" | "disabled";
export type PaymentMethod = "cash" | "card" | "mobile";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface User extends AuthUser {
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category?: Category;
  price: string;
  cost: string;
  quantity: number;
  lowStockLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: string;
  unitCost: string;
  lineTotal: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  saleId: string;
  issuedAt: string;
  sale?: Sale;
}

export interface Sale {
  id: string;
  cashierId: string;
  cashier?: AuthUser;
  customerName: string | null;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  invoice?: Invoice;
  createdAt: string;
}

export interface SalesSummary {
  from: string;
  to: string;
  orderCount: number;
  itemsSold: number;
  revenue: string;
  cost: string;
  profit: string;
}

export interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: string;
}
