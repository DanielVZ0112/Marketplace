import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onGoHome={this.handleGoHome} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onGoHome }: { error: Error | null; onGoHome: () => void }) {

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Algo salió mal
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
      </Typography>
      {import.meta.env.DEV && error && (
        <Box
          sx={{
            bgcolor: "error.light",
            color: "error.contrastText",
            p: 2,
            borderRadius: 1,
            mb: 4,
            textAlign: "left",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            {error.toString()}
            {error.stack}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Recargar Página
        </Button>
        <Button variant="outlined" onClick={onGoHome}>
          Ir al Inicio
        </Button>
      </Box>
    </Container>
  );
}
