import { api } from "@/shared/lib/axios";
import type { Product } from "../domain/Product";
import type { Category } from "../domain/Category";
import type { ProductFilters, PaginatedProducts } from "../domain/ProductFilters";

export class CatalogApiRepository {
  static async getProducts(filters?: ProductFilters): Promise<Product[] | PaginatedProducts> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.category_id)
      params.append("category_id", filters.category_id.toString());
    if (filters?.size) params.append("size", filters.size);
    if (filters?.color) params.append("color", filters.color);
    if (filters?.min_price)
      params.append("min_price", filters.min_price.toString());
    if (filters?.max_price)
      params.append("max_price", filters.max_price.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.order) params.append("order", filters.order);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    const { data } = await api.get(url);
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
