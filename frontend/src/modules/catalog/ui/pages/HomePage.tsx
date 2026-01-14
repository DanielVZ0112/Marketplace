import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeHero from "@/assets/Home.png";
import envioGratis from "@/assets/envio-gratis.png";
import devolucionesFaciles from "@/assets/devoluciones-faciles.png";
import ofertaEspecial from "@/assets/oferta-especial.png";
import styles from "./home-page.module.scss";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box className={styles.homePage}>
      <Box className={styles.homePage__hero}>
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
