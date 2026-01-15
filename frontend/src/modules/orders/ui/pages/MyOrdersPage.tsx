import { useMyOrders } from "../../application/useMyOrders";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useSessionStore } from "@/shared/stores/session.store";
import { NavigationButton } from "@/shared/components";

export function MyOrdersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data: orders, isLoading, error } = useMyOrders();

  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Debes iniciar sesión para ver tus órdenes
        </Alert>
        <NavigationButton to="/login" label="Iniciar Sesión" variant="contained" />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Error al cargar tus órdenes</Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No tienes órdenes aún
        </Typography>
        <NavigationButton 
          to="/catalog" 
          label="Explorar Productos" 
          variant="contained" 
          sx={{ mt: 2 }} 
        />
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Mis Órdenes
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Orden</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Cantidad de productos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell>{order.items?.length || 0} productos</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Ver Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
