import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    ButtonGroup,
  } from "@mui/material";
  import { useCartStore } from "@/shared/stores/cart.store";
  import CloseIcon from "@mui/icons-material/Close";
  import DeleteIcon from "@mui/icons-material/Delete";
  import AddIcon from "@mui/icons-material/Add";
  import RemoveIcon from "@mui/icons-material/Remove";
  
  export function CartDrawer() {
    const { 
      isOpen, 
      closeCart, 
      items, 
      removeItem, 
      increaseItem,
      decreaseItem,
      getTotalItems,
      getTotalPrice 
    } = useCartStore();
  
    return (
      <Drawer anchor="right" open={isOpen} onClose={closeCart}>
        <Box sx={{ width: 360, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Carrito ({getTotalItems()})</Typography>
            <IconButton onClick={closeCart}>
              <CloseIcon />
            </IconButton>
          </Box>
  
          <Divider sx={{ my: 1 }} />
  
          {/* Items */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {items.length === 0 ? (
              <Typography sx={{ mt: 2 }}>El carrito está vacío</Typography>
            ) : (
              <List>
                {items.map((item) => {
                  const key = `${item.product.id}-${item.variant?.id ?? "no-variant"}`;
                  const price = item.variant?.price ?? item.product.price ?? 0;
  
                  return (
                    <ListItem
                      key={key}
                      secondaryAction={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ButtonGroup size="small" orientation="vertical">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                increaseItem(item.product.id, item.variant?.id);
                              }}
                              disabled={item.variant ? item.quantity >= item.variant.stock : false}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                decreaseItem(item.product.id, item.variant?.id);
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </ButtonGroup>
                          <IconButton
                            edge="end"
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          item.product.name +
                          (item.variant
                            ? ` - ${item.variant.size ?? ""} ${item.variant.color ?? ""}`.trim()
                            : "")
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Cantidad: {item.quantity}
                              {item.variant && ` (Stock: ${item.variant.stock})`}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${(price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
  
          <Divider sx={{ my: 1 }} />
  
          {/* Footer */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6">Total: ${getTotalPrice().toFixed(2)}</Typography>
          </Box>
        </Box>
      </Drawer>
    );
  }
  