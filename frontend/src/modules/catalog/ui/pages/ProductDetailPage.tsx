import { useParams } from "react-router-dom";
import { useGetProduct } from "../../application/useGetProduct";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useCartStore } from "@/shared/stores/cart.store";
import { useMemo, useState } from "react";
import { VariantSelector } from "../components/VariantSelector";
import { SkeletonLoader } from "@/shared/ui/components/SkeletonLoader";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import type { ProductVariant } from "../../domain/ProductVariant";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import noImage from "@/assets/no-image.jpg";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useGetProduct(id!);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  const hasVariants = product?.variants && product.variants.length > 0;

  const currentImage = useMemo(() => {
    if (selectedVariant?.image_url || selectedVariant?.imageUrl) {
      return selectedVariant.image_url || selectedVariant.imageUrl;
    }
    return product?.image_url || product?.imageUrl || null;
  }, [product, selectedVariant]);

  const displayPrice = useMemo(() => {
    if (selectedVariant?.price) {
      // Convertir precio de variante a número
      return typeof selectedVariant.price === 'string'
        ? parseFloat(selectedVariant.price)
        : Number(selectedVariant.price) || 0;
    }
    // Convertir precio del producto a número
    if (product?.price) {
      return typeof product.price === 'string'
        ? parseFloat(product.price)
        : Number(product.price) || 0;
    }
    return 0;
  }, [product, selectedVariant]);

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const isAddDisabled =
    (hasVariants && !selectedVariant) || isOutOfStock;

  if (isLoading) {
    return (
      <Container sx={{ py: 6 }}>
        <SkeletonLoader count={1} variant="detail" />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container sx={{ py: 6 }}>
        <EmptyState
          title="Producto no encontrado"
          description="El producto que buscas no existe o ha sido eliminado"
          icon={<ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />}
        />
      </Container>
    );
  }

  const handleAddToCart = () => {
    if (isAddDisabled) return;
    addItem(product, selectedVariant);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <img
            src={currentImage || noImage}
            alt={product.name}
            style={{ width: "100%", objectFit: "cover", borderRadius: 8 }}
            onError={(e) => {
              e.currentTarget.src = noImage;
            }}
          />
        </Box>

        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Typography variant="h4">{product.name}</Typography>

          <Typography variant="h6" sx={{ mt: 1 }} color="primary">
            ${displayPrice.toFixed(2)}
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
              Selecciona una talla para continuar
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
