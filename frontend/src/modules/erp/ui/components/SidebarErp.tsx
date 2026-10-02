import {
  Dashboard,
  Calculate,
  ReceiptLong,
  Inventory2,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/erp", label: "Dashboard", icon: <Dashboard />, end: true },
  { to: "/erp/cotizador", label: "Cotizador", icon: <Calculate />, end: false },
  { to: "/erp/cotizaciones", label: "Histórico", icon: <ReceiptLong />, end: false },
  { to: "/erp/insumos", label: "Insumos y costos", icon: <Inventory2 />, end: false },
  { to: "/erp/parametros", label: "Parámetros", icon: <Tune />, end: false },
];

export function SidebarErp() {
  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ px: 1, mb: 2 }}>
        D-E-J Creaciones
      </Typography>
      <List>
        {LINKS.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            end={link.end}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              "&.active": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "inherit" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
