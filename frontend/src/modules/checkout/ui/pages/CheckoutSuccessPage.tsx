import { useLocation } from "react-router-dom";
import { Box, Typography, Divider, Container, Paper, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GoHomeButton } from "@/shared/components";
import type { Order, OrderItem } from "@/modules/checkout/domain/Order";

export function CheckoutSuccessPage() {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se encontró información de la orden
        </Alert>
        <GoHomeButton />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h3" gutterBottom color="success.main">
          ¡Pago realizado exitosamente!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Orden #{order.id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gracias por tu compra. Recibirás un email de confirmación pronto.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Información del Cliente */}
        {order.customer && (
          <Paper sx={{ p: 3, flex: 1, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {order.customer.first_name} {order.customer.last_name}
            </Typography>
            {order.customer.email && (
              <Typography variant="body2" color="text.secondary">
                {order.customer.email}
              </Typography>
            )}
            {order.customer.phone && (
              <Typography variant="body2" color="text.secondary">
                {order.customer.phone}
              </Typography>
            )}
            {(order.customer.address || order.customer.city || order.customer.country) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {[
                  order.customer.address,
                  order.customer.city,
                  order.customer.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            )}
          </Paper>
        )}

        {/* Resumen de Items */}
        <Paper sx={{ p: 3, flex: 1, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Items del Pedido
          </Typography>

          {order.items && order.items.length > 0 ? (
            <>
              {order.items.map((item: OrderItem) => {
                const productName =
                  item.productVariant?.product?.name || "Producto";
                const size = item.productVariant?.size;
                const color = item.productVariant?.color;
                const unitPrice = Number(item.unit_price || 0);
                const totalItemPrice = unitPrice * item.quantity;

                return (
                  <Box
                    key={item.id}
                    sx={{ py: 2, borderBottom: "1px solid #e0e0e0" }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="body1">{productName}</Typography>
                        {(size || color) && (
                          <Typography variant="body2" color="text.secondary">
                            {[size, color].filter(Boolean).join(" - ")}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Cantidad: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${totalItemPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${Number(order.total).toFixed(2)}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay items disponibles
            </Typography>
          )}
        </Paper>
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <GoHomeButton size="large" />
      </Box>
    </Container>
  );
}
