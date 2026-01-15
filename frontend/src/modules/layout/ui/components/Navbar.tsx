import { AppBar, Toolbar, Typography, IconButton, Badge, Button, Box } from "@mui/material";
import CartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCartStore } from "@/shared/stores/cart.store";
import { useSessionStore } from "@/shared/stores/session.store";
import { useLogout } from "@/modules/auth/application/useLogout";
import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.scss";

export function Navbar() {
  const navigate = useNavigate();
  const openCart = useCartStore((s) => s.openCart);
  const itemsCount = useCartStore((s) => s.getTotalItems());
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const user = useSessionStore((s) => s.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} className={styles.navbar}>
      <Toolbar className={styles.navbar__container}>
        <Typography
          className={styles.navbar__logo}
          variant="h5"
          onClick={() => navigate("/")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate("/");
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Ir a la página de inicio"
        >
          <span className={styles.navbar__logoLetter}>D</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>i</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>f</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>f</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>e</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>r</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>e</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>n</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>t</span>
          <span className={styles.navbar__logoLetter}>S</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>t</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>y</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>l</span>
          <span className={`${styles.navbar__logoLetter} ${styles.navbar__logoLetterExpand}`}>e</span>
          <span className={styles.navbar__logoText}> for You</span>
        </Typography>

        <div className={styles.navbar__actions}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => navigate("/orders")} 
                  color="inherit"
                  aria-label="Ver mis órdenes"
                >
                  Mis Órdenes
                </Button>
                {user && (
                  <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                    {user.email}
                  </Typography>
                )}
                <Button 
                  onClick={handleLogout} 
                  color="inherit"
                  aria-label="Cerrar sesión"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                color="inherit"
                startIcon={<AccountCircleIcon aria-hidden="true" />}
                aria-label="Iniciar sesión"
              >
                Iniciar Sesión
              </Button>
            )}

            <IconButton 
              onClick={openCart}
              aria-label={`Abrir carrito de compras, ${itemsCount} ${itemsCount === 1 ? 'artículo' : 'artículos'}`}
              aria-expanded={false}
            >
              <Badge badgeContent={itemsCount} color="primary">
                <CartIcon aria-hidden="true" />
              </Badge>
            </IconButton>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
}
