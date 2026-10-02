import { Paper, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}
