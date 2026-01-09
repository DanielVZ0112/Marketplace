import { AppBar, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useCartStore } from "@/shared/stores/cart.store";
import "./Navbar.scss";

export function Navbar() {
  const openCart = useCartStore((s) => s.openCart);
  const itemsCount = useCartStore((s) => s.totalItems);

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar className="navbar">
        <Typography className="navbar__logo" variant="h5">
          MAISON
        </Typography>

        <div className="navbar__actions">
          <IconButton onClick={openCart}>
            <Badge badgeContent={itemsCount} color="primary">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
