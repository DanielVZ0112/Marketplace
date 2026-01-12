import { useState } from "react";
import { useCartStore } from "@/shared/stores/cart.store";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../application/useCheckout";
import type { CreateCustomerDto } from "../../domain/Customer";
import { NavigationButton } from "@/shared/components";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const checkoutMutation = useCheckout();

  const [formData, setFormData] = useState<CreateCustomerDto>({
    first_name: "",
    last_name: "",
    document_number: "",
    birth_date: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
  });

  // Validar que todos los items tengan variante
  const hasItemsWithoutVariant = items.some((item) => !item.variant);
  
  if (items.length === 0) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <NavigationButton to="/catalog" label="Ir al catálogo" variant="contained" />
      </Container>
    );
  }

  if (hasItemsWithoutVariant) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Algunos productos en tu carrito no tienen variante seleccionada.
          Por favor, vuelve al catálogo y selecciona una variante para cada producto.
        </Alert>
        <NavigationButton to="/catalog" label="Volver al catálogo" variant="contained" />
      </Container>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name) {
      return;
    }

    checkoutMutation.mutate(
      {
        customer: formData,
        payment_method: "credit_card",
        payment_provider: "simulated",
        simulate_success: true,
      },
      {
        onSuccess: (result) => {
          navigate("/checkout/success", {
            state: { order: result.order },
          });
        },
      }
    );
  };

  const handleInputChange = (field: keyof CreateCustomerDto) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Formulario de Customer */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.first_name}
                onChange={handleInputChange("first_name")}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Apellido"
                value={formData.last_name}
                onChange={handleInputChange("last_name")}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Dirección"
                value={formData.address}
                onChange={handleInputChange("address")}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Ciudad"
                value={formData.city}
                onChange={handleInputChange("city")}
                margin="normal"
              />

              <TextField
                fullWidth
                label="País"
                value={formData.country}
                onChange={handleInputChange("country")}
                margin="normal"
              />

              {checkoutMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {checkoutMutation.error instanceof Error
                    ? checkoutMutation.error.message
                    : "Error al procesar el checkout"}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={checkoutMutation.isPending}
                sx={{ mt: 3 }}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Procesando pago...
                  </>
                ) : (
                  `Pagar $${total.toFixed(2)}`
                )}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Resumen del pedido */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>

            <Box sx={{ mt: 2 }}>
              {items.map((item) => {
                const price = item.variant?.price ?? item.product.price ?? item.product.price;
                return (
                  <Box
                    key={`${item.product.id}-${item.variant?.id ?? 0}`}
                    sx={{ py: 2, borderBottom: "1px solid #e0e0e0" }}
                  >
                    <Typography variant="subtitle1">
                      {item.product.name}
                    </Typography>
                    {item.variant && (
                      <Typography variant="body2" color="text.secondary">
                        {item.variant.size} - {item.variant.color}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                      <Typography variant="body2">
                        Cantidad: {item.quantity}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${(Number(price) * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
