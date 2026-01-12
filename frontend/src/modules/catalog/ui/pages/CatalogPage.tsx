import { useGetProducts } from "../../application/useGetProducts";
import { ProductGrid } from "../components/ProductGrid";
import { CircularProgress, Container } from "@mui/material";

export function CatalogPage() {
  const { data, isLoading } = useGetProducts();

  if (isLoading) return <CircularProgress />;

  return (
    <Container sx={{ py: 6 }}>
      <ProductGrid products={data ?? []} />
    </Container>
  );
}
