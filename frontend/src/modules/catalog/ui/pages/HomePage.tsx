import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import homeHero from "@/assets/Home.png";
import leftImage from "@/assets/left-image.png";
import rightImage from "@/assets/rigth-image.png";
import envioGratis from "@/assets/envio-gratis.png";
import devolucionesFaciles from "@/assets/devoluciones-faciles.png";
import ofertaEspecial from "@/assets/oferta-especial.png";
import hombreCategoria from "@/assets/hombre-categoria.png";
import mujerCategoria from "@/assets/mujer-categoria.png";
import accesoriosCategoria from "@/assets/acessorios-feat.jpg";
import promoBanner from "@/assets/promo-banner.jpg";
import { useGetProducts } from "../../application/useGetProducts";
import { ProductCard } from "../components/ProductCard";
import styles from "./home-page.module.scss";
import type { Product } from "../../domain/Product";

export function HomePage() {
  const navigate = useNavigate();
  
  const { data: productsResponse, isLoading } = useGetProducts();
  
  const featuredProducts = useMemo(() => {
    if (!productsResponse) return [];

    if (Array.isArray(productsResponse)) {
      return productsResponse.slice(0, 4);
    }
    
    if (productsResponse && 'data' in productsResponse && Array.isArray(productsResponse.data)) {
      return productsResponse.data.slice(0, 4);
    }
    
    return [];
  }, [productsResponse]);

  return (
    <Box className={styles.homePage}>
      {/* Hero Section */}
      <Box className={styles.homePage__hero}>
        <Box className={styles.homePage__heroImages}>
          <img 
            src={leftImage} 
            alt="Modelo izquierdo" 
            className={styles.homePage__heroSideImage}
          />
          <Box className={styles.homePage__heroCenter}>
            <img 
              src={homeHero} 
              alt="Find your style" 
              className={styles.homePage__heroImage}
            />
            <Box className={styles.homePage__heroOverlay} />
            <Box className={styles.homePage__heroContent}>
              <Typography variant="h1" className={styles.homePage__title}>
                Encuentra tu estilo.
              </Typography>
              <Typography variant="body1" className={styles.homePage__subtitle}>
                Descubre las últimas tendencias y eleva tu vestuario.
              </Typography>
              <button
                onClick={() => navigate("/catalog")}
                className={styles.homePage__ctaButton}
                data-back="Descubrelo Ahora"
                data-front="Ver Catálogo"
              >
              </button>
            </Box>
          </Box>
          <img 
            src={rightImage} 
            alt="Modelo derecho" 
            className={styles.homePage__heroSideImage}
          />
        </Box>
      </Box>

      {/* Categories Section */}
      <Box className={styles.homePage__categoriesSection}>
        <Typography variant="h2" className={styles.homePage__sectionTitle}>
          Compra por Categoría
        </Typography>
        <Box className={styles.homePage__categories}>
          <Box 
            className={styles.homePage__category}
            onClick={() => navigate("/catalog?category=hombres")}
          >
            <img 
              src={hombreCategoria} 
              alt="Hombres" 
              className={styles.homePage__categoryImage}
            />
            <Box className={styles.homePage__categoryOverlay}>
              <Typography variant="h3" className={styles.homePage__categoryTitle}>
                Hombres
              </Typography>
            </Box>
          </Box>
          
          <Box 
            className={styles.homePage__category}
            onClick={() => navigate("/catalog?category=mujeres")}
          >
            <img 
              src={mujerCategoria} 
              alt="Mujeres" 
              className={styles.homePage__categoryImage}
            />
            <Box className={styles.homePage__categoryOverlay}>
              <Typography variant="h3" className={styles.homePage__categoryTitle}>
                Mujeres
              </Typography>
            </Box>
          </Box>
          
          <Box 
            className={styles.homePage__category}
            onClick={() => navigate("/catalog?category=accesorios")}
          >
            <img 
              src={accesoriosCategoria} 
              alt="Accesorios" 
              className={styles.homePage__categoryImage}
            />
            <Box className={styles.homePage__categoryOverlay}>
              <Typography variant="h3" className={styles.homePage__categoryTitle}>
                Accesorios
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Box className={styles.homePage__featuredSection}>
        <Typography variant="h2" className={styles.homePage__sectionTitle}>
          Productos Destacados
        </Typography>
        <Typography variant="body1" className={styles.homePage__sectionSubtitle}>
          Descubre nuestras selecciones especiales
        </Typography>
        
        {isLoading ? (
          <Box className={styles.homePage__loading}>Cargando productos...</Box>
        ) : (
          <Box className={styles.homePage__featuredProducts}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <Typography variant="body2" className={styles.homePage__noProducts}>
                No hay productos disponibles
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Promo Banner */}
      <Box 
        className={styles.homePage__promoBanner}
        onClick={() => navigate("/catalog")}
      >
        <img 
          src={promoBanner} 
          alt="Nueva Colección" 
          className={styles.homePage__promoImage}
        />
        <Box className={styles.homePage__promoOverlay}>
          <Typography variant="h2" className={styles.homePage__promoTitle}>
            Nueva Colección Disponible
          </Typography>
          <button className={styles.homePage__promoButton}>
            Explorar Ahora
          </button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box className={styles.homePage__featuresSection}>
        <Typography variant="h2" className={styles.homePage__featuresTitle}>
          ¿Por qué elegirnos?
        </Typography>
        <Typography variant="body1" className={styles.homePage__featuresSubtitle}>
          Comprometidos con tu experiencia de compra
        </Typography>

        <Box className={styles.homePage__features}>
          <Box className={styles.homePage__feature}>
            <img 
              src={envioGratis} 
              alt="Envío Gratis" 
              className={styles.homePage__featureImage}
            />
            <Box className={styles.homePage__featureContent}>
              <Typography variant="h6" className={styles.homePage__featureTitle}>
                Envío Gratis
              </Typography>
              <Typography variant="body2" className={styles.homePage__featureDescription}>
                En compras mayores a $50
              </Typography>
            </Box>
          </Box>

          <Box className={styles.homePage__feature}>
            <img 
              src={devolucionesFaciles} 
              alt="Devoluciones Fáciles" 
              className={styles.homePage__featureImage}
            />
            <Box className={styles.homePage__featureContent}>
              <Typography variant="h6" className={styles.homePage__featureTitle}>
                Devoluciones Fáciles
              </Typography>
              <Typography variant="body2" className={styles.homePage__featureDescription}>
                Hasta 30 días para devolver
              </Typography>
            </Box>
          </Box>

          <Box className={styles.homePage__feature}>
            <img 
              src={ofertaEspecial} 
              alt="Oferta Especial" 
              className={styles.homePage__featureImage}
            />
            <Box className={styles.homePage__featureContent}>
              <Typography variant="h6" className={styles.homePage__featureTitle}>
                Ofertas Especiales
              </Typography>
              <Typography variant="body2" className={styles.homePage__featureDescription}>
                Descuentos exclusivos
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
