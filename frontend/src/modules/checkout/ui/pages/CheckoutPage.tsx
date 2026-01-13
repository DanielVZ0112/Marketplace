import { useState, useEffect } from "react";
import { useCartStore } from "@/shared/stores/cart.store";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../application/useCheckout";
import { useGetCustomerByUserId } from "../../application/useGetCustomerByUserId";
import { useProfile } from "@/modules/auth/application/useProfile";
import { useSessionStore } from "@/shared/stores/session.store";
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
  const setCustomer = useSessionStore((s) => s.setCustomer);
  const customerFromStore = useSessionStore((s) => s.customer);

  // Obtener usuario logueado
  const { data: user } = useProfile();

  // Obtener customer si hay usuario logueado
  const { data: customerData, isLoading: isLoadingCustomer } = useGetCustomerByUserId(!!user);

  // Guardar customer en el store cuando se obtiene
  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    }
  }, [customerData, setCustomer]);

  // Usar customer del store o el obtenido de la query
  const customer = customerFromStore || customerData;
  const isFormLocked = !!customer;

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

  // Prellenar formulario cuando hay customer
  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        document_number: customer.document_number || "",
        birth_date: customer.birth_date
          ? typeof customer.birth_date === "string"
            ? customer.birth_date.split("T")[0]
            : new Date(customer.birth_date).toISOString().split("T")[0]
          : "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        country: customer.country || "",
        user_id: customer.user_id || null,
      });
    }
  }, [customer]);

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

    // Limpiar campos vacíos antes de enviar
    const cleanData: CreateCustomerDto = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      document_number: formData.document_number || undefined,
      birth_date: formData.birth_date || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      user_id: user?.id || null,
    };

    checkoutMutation.mutate(
      {
        customer: cleanData,
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
    if (isFormLocked) return; // No permitir cambios si el formulario está bloqueado
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

            {isLoadingCustomer && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {isFormLocked && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Tus datos están guardados. Los campos están bloqueados para proteger tu información.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.first_name}
                onChange={handleInputChange("first_name")}
                required
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="Apellido"
                value={formData.last_name}
                onChange={handleInputChange("last_name")}
                required
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                value={formData.birth_date}
                onChange={handleInputChange("birth_date")}
                margin="normal"
                disabled={isFormLocked}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="Dirección"
                value={formData.address}
                onChange={handleInputChange("address")}
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="Ciudad"
                value={formData.city}
                onChange={handleInputChange("city")}
                margin="normal"
                disabled={isFormLocked}
              />

              <TextField
                fullWidth
                label="País"
                value={formData.country}
                onChange={handleInputChange("country")}
                margin="normal"
                disabled={isFormLocked}
              />

              {checkoutMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {(() => {
                    const error = checkoutMutation.error as any;
                    if (error?.response?.data?.message) {
                      return Array.isArray(error.response.data.message)
                        ? error.response.data.message.join(", ")
                        : error.response.data.message;
                    }
                    if (error?.message) {
                      return error.message;
                    }
                    return "Error al procesar el checkout";
                  })()}
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
