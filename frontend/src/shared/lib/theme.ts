import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6B7280",
    },
    error: {
      main: "#DC2626",
    },
    success: {
      main: "#16A34A",
    },
    warning: {
      main: "#F59E0B",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#0F0F0F",
      secondary: "#6B7280",
    },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#0F0F0F",
    },
    h2: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.2,
      color: "#0F0F0F",
    },
    h3: {
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.2,
      color: "#0F0F0F",
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#0F0F0F",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#6B7280",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        },
      },
    },
  },
});
