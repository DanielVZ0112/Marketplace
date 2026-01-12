import { Box } from "@mui/material";
import type { Product } from "../../domain/Product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
      }}
    >
      {products.map((p) => (
        <Box key={p.id}>
          <ProductCard product={p} />
        </Box>
      ))}
    </Box>
  );
}
