import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import type { ComponentProps } from "react";
import HomeIcon from "@mui/icons-material/Home";

type ButtonProps = ComponentProps<typeof Button>;

interface GoHomeButtonProps extends Omit<ButtonProps, "onClick" | "startIcon"> {
  label?: string;
  showIcon?: boolean;
}

export function GoHomeButton({
  label = "Volver al inicio",
  showIcon = true,
  variant = "contained",
  ...props
}: GoHomeButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      startIcon={showIcon ? <HomeIcon /> : undefined}
      {...props}
    >
      {label}
    </Button>
  );
}
