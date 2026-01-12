import { useParams } from "react-router-dom";
import { useOrder } from "../../application/useOrder";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { BackButton } from "@/shared/components";
import type { OrderItem } from "@/modules/checkout/domain/Order";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Orden no encontrada</Alert>
        <BackButton to="/orders" label="Volver a Mis Órdenes" variant="contained" sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Orden #{order.id}</Typography>
        <Chip label={order.status} color="primary" />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información de la Orden
        </Typography>
        <Typography>
          <strong>Fecha:</strong>{" "}
          {order.created_at
            ? new Date(order.created_at).toLocaleString()
            : "N/A"}
        </Typography>
        <Typography>
          <strong>Estado:</strong> {order.status}
        </Typography>
        <Typography>
          <strong>Total:</strong> ${Number(order.total).toFixed(2)}
        </Typography>
      </Paper>

      {order.items && order.items.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          {order.items.map((item: OrderItem) => (
            <Box key={item.id} sx={{ py: 2 }}>
              <Typography variant="subtitle1">
                {item.productVariant?.product?.name || "Producto"}
              </Typography>
              {(item.productVariant?.size || item.productVariant?.color) && (
                <Typography variant="body2" color="text.secondary">
                  {item.productVariant.size} - {item.productVariant.color}
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography>Cantidad: {item.quantity}</Typography>
                <Typography fontWeight="bold">
                  ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Paper>
      )}

      <BackButton to="/orders" label="Volver a Mis Órdenes" variant="contained" sx={{ mt: 3 }} />
    </Container>
  );
}
