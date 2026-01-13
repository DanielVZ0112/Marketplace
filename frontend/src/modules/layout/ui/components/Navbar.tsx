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
    <AppBar position="sticky" color="transparent" elevation={0} className={styles.navbar}>
      <Toolbar className={styles.navbar__container}>
        <Typography
          className={styles.navbar__logo}
          variant="h5"
          onClick={() => navigate("/")}
        >
          DS for You
        </Typography>

        <div className={styles.navbar__actions}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/orders")} color="inherit">
                  Mis Órdenes
                </Button>
                {user && (
                  <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                    {user.email}
                  </Typography>
                )}
                <Button onClick={handleLogout} color="inherit">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                color="inherit"
                startIcon={<AccountCircleIcon />}
              >
                Iniciar Sesión
              </Button>
            )}

            <IconButton onClick={openCart}>
              <Badge badgeContent={itemsCount} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
}
