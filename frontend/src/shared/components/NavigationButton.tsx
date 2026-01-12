import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface NavigationButtonProps extends Omit<ButtonProps, "onClick" | "startIcon"> {
  to: string;
  label: string;
  icon?: ReactNode;
}

export function NavigationButton({
  to,
  label,
  icon,
  variant = "contained",
  ...props
}: NavigationButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      startIcon={icon}
      {...props}
    >
      {label}
    </Button>
  );
}
