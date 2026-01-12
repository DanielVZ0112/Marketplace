import { Skeleton, Box } from "@mui/material";

interface SkeletonLoaderProps {
  count?: number;
  variant?: "card" | "list" | "detail";
}

export function SkeletonLoader({ count = 8, variant = "card" }: SkeletonLoaderProps) {
  if (variant === "card") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant="rectangular" height={260} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === "list") {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === "detail") {
    return (
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="30%" height={32} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="100%" height={24} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="rectangular" width={200} height={40} sx={{ mt: 3 }} />
        </Box>
      </Box>
    );
  }

  return null;
}
