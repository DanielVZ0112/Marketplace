import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#111111",
    },
    secondary: {
      main: "#999999",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
});
