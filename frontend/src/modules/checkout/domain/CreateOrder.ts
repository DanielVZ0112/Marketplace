export interface CreateOrderDto {
  customer_id: number;
  user_id?: number | null;
  status: "pending";
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  product_variant_id: number;
  quantity: number;
  unit_price: number;
}
  