import type { Product } from "@/modules/catalog/domain/Product";
import type { ProductVariant } from "@/modules/catalog/domain/ProductVariant";

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
