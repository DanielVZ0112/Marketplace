import { Box, Typography } from "@mui/material";
import type { Product } from "../../domain/Product";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import noImage from "@/assets/no-image.jpg";
import styles from "./product-card.module.scss";

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  
  const imageUrl = useMemo(() => {
    const url = product.image_url || product.imageUrl;
    if (!url) return noImage;
    
    // Si la URL ya es una ruta completa (contiene / o http), usarla directamente
    if (url.includes('/') || url.startsWith('http')) {
      return url;
    }
    
    // Si la URL es solo un nombre de archivo (ej: "1.jpg"), construir la ruta completa
    // En Vite, para acceder a assets dinámicamente, usamos new URL con import.meta.url
    try {
      // Construir la ruta usando new URL para que Vite pueda resolverla correctamente
      const basePath = import.meta.env.VITE_URL_IMAGES || '/src/assets/product-image';
      // Si basePath es relativo, construir la URL correctamente
      if (basePath.startsWith('/')) {
        // En desarrollo, Vite sirve desde la raíz, así que usamos la ruta directamente
        return `${basePath}/${url}`;
      }
      return `${basePath}/${url}`;
    } catch {
      // Fallback a noImage si hay algún error
      return noImage;
    }
  }, [product.image_url, product.imageUrl]);
  
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
    <Box 
      className={styles.productCard}
      onClick={() => navigate(`/catalog/${product.id}`)}
    >
      <Box className={styles.productCard__imageWrapper}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.productCard__image}
          onError={(e) => {
            e.currentTarget.src = noImage;
          }}
        />
      </Box>
      <Box className={styles.productCard__content}>
        <Typography className={styles.productCard__title}>
          {product.name}
        </Typography>
        <Typography className={styles.productCard__price}>
          {priceDisplay}
        </Typography>
      </Box>
    </Box>
  );
}
