import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { Product } from "../../domain/Product";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const imageUrl = product.image_url || product.imageUrl || '/placeholder-image.jpg';
  
  const priceDisplay = useMemo(() => {
    const productPrice = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : Number(product.price) || 0;

    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map((v) => {
          const variantPrice = typeof v.price === 'string' 
            ? parseFloat(v.price) 
            : Number(v.price);
          return variantPrice;
        })
        .filter((p) => !isNaN(p) && p > 0);
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        if (minPrice === maxPrice) {
          return `$${minPrice.toFixed(2)}`;
        }
        return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      }
    }
    return `$${productPrice.toFixed(2)}`;
  }, [product]);

  return (
    <Card 
      sx={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
      onClick={() => navigate(`/catalog/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="260"
        image={imageUrl}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight="medium">
          {priceDisplay}
        </Typography>
      </CardContent>
    </Card>
  );
}
