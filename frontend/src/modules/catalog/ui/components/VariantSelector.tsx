import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { ProductVariant } from "../../domain/ProductVariant";

interface Props {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onChange: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedVariant, onChange }: Props) {
  if (!variants.length) return null;

  const getLabel = (variant: ProductVariant) => {
    if (variant.size) return variant.size;
    if (variant.color) return variant.color;
    if (variant.sku) return variant.sku;
    return `Variant #${variant.id}`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Selecciona una talla
      </Typography>

      <ToggleButtonGroup
        value={selectedVariant?.id ?? null}
        exclusive
        onChange={(_, value) => {
          const variant = variants.find(v => v.id === value);
          if (variant) onChange(variant);
        }}
      >
        {variants.map((variant) => (
          <ToggleButton
            key={variant.id}
            value={variant.id}
            disabled={variant.stock <= 0}
          >
            {getLabel(variant)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
