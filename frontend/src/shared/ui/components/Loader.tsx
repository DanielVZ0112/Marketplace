import { CircularProgress, Box } from "@mui/material";

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export function Loader({ size = 40, fullScreen = false }: LoaderProps) {
  const content = <CircularProgress size={size} />;

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      {content}
    </Box>
  );
}
