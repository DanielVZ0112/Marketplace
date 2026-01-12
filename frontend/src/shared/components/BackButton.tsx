import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import type { ComponentProps } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type ButtonProps = ComponentProps<typeof Button>;

interface BackButtonProps extends Omit<ButtonProps, "onClick" | "startIcon"> {
  to?: string;
  label?: string;
  showIcon?: boolean;
}

export function BackButton({
  to,
  label = "Volver",
  showIcon = true,
  variant = "outlined",
  ...props
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      startIcon={showIcon ? <ArrowBackIcon /> : undefined}
      {...props}
    >
      {label}
    </Button>
  );
}
