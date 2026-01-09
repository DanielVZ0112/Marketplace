import { Drawer, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCartStore } from "@/shared/stores/cart.store";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeCart}>
      <div style={{ width: 360, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </div>

        <Typography sx={{ mt: 4 }}>Cart is empty</Typography>
      </div>
    </Drawer>
  );
}
