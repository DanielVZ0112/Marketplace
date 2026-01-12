import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 60 }}>
      <h1>Nueva Colección</h1>
      <p>Descubre nuestras nuevas llegadas</p>

      <Button variant="contained" onClick={() => navigate("/catalog")}>
        Ver catálogo
      </Button>
    </div>
  );
}
