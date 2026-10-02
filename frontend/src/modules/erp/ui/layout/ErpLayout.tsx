import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useSessionStore } from "@/shared/stores/session.store";
import { SidebarErp } from "../components/SidebarErp";

export function ErpLayout() {
  const location = useLocation();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(() => useSessionStore.persist.hasHydrated());

  useEffect(() => {
    if (useSessionStore.persist.hasHydrated()) {
      return;
    }
    return useSessionStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <SidebarErp />
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
