import { useParams } from "react-router-dom";
import { useGetProduct } from "../../application/useGetProduct";
import {
  CircularProgress,
  Container,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useCartStore } from "@/shared/stores/cart.store";
import { useMemo, useState } from "react";
import { VariantSelector } from "../components/VariantSelector";
import type { ProductVariant } from "../../domain/ProductVariant";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(id!);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  const hasVariants = product?.variants && product.variants.length > 0;

  const currentImage = useMemo(() => {
    if (selectedVariant?.image_url || selectedVariant?.imageUrl) {
      return selectedVariant.image_url || selectedVariant.imageUrl;
    }
    return product?.image_url || product?.imageUrl || "/placeholder-image.jpg";
  }, [product, selectedVariant]);

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const isAddDisabled =
    (hasVariants && !selectedVariant) || isOutOfStock;


  if (isLoading) return <CircularProgress />;

  if (!product) return <Typography>Producto no encontrado</Typography>;

  const handleAddToCart = () => {
    if (isAddDisabled) return;
    addItem(product, selectedVariant);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <img
            src={currentImage ?? "/placeholder-image.jpg"}
            alt={product.name}
            style={{ width: "100%", objectFit: "cover", borderRadius: 8 }}
          />
        </Box>

        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Typography variant="h4">{product.name}</Typography>

          <Typography variant="h6" sx={{ mt: 1 }}>
            ${product.price}
          </Typography>

          <Typography sx={{ mt: 2 }}>{product.description}</Typography>

          {hasVariants && (
            <Box sx={{ mt: 3 }}>
              <VariantSelector
                variants={product.variants || []}
                selectedVariant={selectedVariant}
                onChange={setSelectedVariant}
              />
            </Box>
          )}

          {hasVariants && !selectedVariant && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Selecciona una variante para continuar
            </Alert>
          )}

          {selectedVariant && selectedVariant.stock <= 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Esta variante está agotada
            </Alert>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isAddDisabled}
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
