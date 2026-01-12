import { api } from "@/shared/lib/axios";
import type { Product } from "../domain/Product";
import type { Category } from "../domain/Category";

export class CatalogApiRepository {
  static async getProducts(): Promise<Product[]> {
    const { data } = await api.get("/products");
    return data.data;
  }

  static async getCategories(): Promise<Category[]> {
    const { data } = await api.get("/categories");
    return data.data;
  }

  static async getProductById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  }
}
