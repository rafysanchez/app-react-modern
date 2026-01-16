export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  inventory: number;
  status: "active" | "draft" | "archived";
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
