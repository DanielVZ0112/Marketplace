import { useState } from "react";
import { useLogin } from "../../application/useLogin";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(formData, {
      onSuccess: () => {
        navigate(from);
      },
    });
  };

  return (
    <Container sx={{ py: 6, maxWidth: 400 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Iniciar Sesión
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Inicia sesión para ver tus órdenes y disfrutar de beneficios exclusivos
        </Typography>

        {loginMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Error al iniciar sesión"}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            margin="normal"
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            margin="normal"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loginMutation.isPending}
            sx={{ mt: 3 }}
          >
            {loginMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tienes cuenta? Puedes comprar sin registrarte
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
