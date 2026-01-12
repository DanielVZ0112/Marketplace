import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { Product } from "../../domain/Product";
import { useNavigate } from "react-router-dom";

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const imageUrl = product.image_url || product.imageUrl || '/placeholder-image.jpg';
  
  return (
    <Card 
      sx={{ cursor: "pointer" }}
        onClick={() => navigate(`/catalog/${product.id}`)}
      >
      <CardMedia
        component="img"
        height="260"
        image={imageUrl}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="subtitle1">{product.name}</Typography>
        <Typography variant="body2">${product.price}</Typography>
      </CardContent>
    </Card>
  );
}
