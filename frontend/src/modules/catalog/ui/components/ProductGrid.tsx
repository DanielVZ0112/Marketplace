import { Box } from "@mui/material";
import type { Product } from "../../domain/Product";
import { ProductCard } from "./ProductCard";
import styles from "./product-grid.module.scss";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Box className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
}
