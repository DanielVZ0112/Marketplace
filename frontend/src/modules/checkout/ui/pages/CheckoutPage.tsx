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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { PasswordInput } from "@/shared/ui/components/PasswordInput";

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const checkoutMutation = useCheckout();
  const setCustomer = useSessionStore((s) => s.setCustomer);
  const customerFromStore = useSessionStore((s) => s.customer);

  const { data: user } = useProfile();

  const { data: customerData, isLoading: isLoadingCustomer } = useGetCustomerByUserId(!!user);

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    }
  }, [customerData, setCustomer]);

  const customer = customerFromStore || customerData;
  const isFormLocked = !!customer;

  const isNotLoggedIn = !user;

  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

    if (wantsToRegister && isNotLoggedIn) {
      if (!password || password.length < 6) {
        setPasswordError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
        return;
      }
      if (!formData.email) {
        setPasswordError("El email es requerido para registrarse");
        return;
      }
      setPasswordError("");
    }

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
        wantsToRegister: wantsToRegister && isNotLoggedIn,
        password: wantsToRegister && isNotLoggedIn ? password : undefined,
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
    if (isFormLocked) return;
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Pago de Pedido
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
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
                required={wantsToRegister && isNotLoggedIn}
              />

              {isNotLoggedIn && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={wantsToRegister}
                      onChange={(e) => {
                        setWantsToRegister(e.target.checked);
                        if (!e.target.checked) {
                          setPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                        }
                      }}
                    />
                  }
                  label="¿Quieres registrarte?"
                  sx={{ mt: 2, mb: 1 }}
                />
              )}

              {wantsToRegister && isNotLoggedIn && (
                <>
                  <PasswordInput
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    label="Contraseña"
                    margin="normal"
                    required
                    error={!!passwordError}
                    helperText={passwordError || "Mínimo 6 caracteres"}
                    autoComplete="new-password"
                  />

                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    label="Confirmar Contraseña"
                    margin="normal"
                    required
                    error={!!passwordError && password !== confirmPassword}
                    helperText={
                      passwordError && password !== confirmPassword
                        ? passwordError
                        : ""
                    }
                    autoComplete="new-password"
                    name="confirmPassword"
                  />
                </>
              )}

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
