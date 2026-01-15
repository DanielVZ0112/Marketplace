import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  margin?: "normal" | "dense" | "none";
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function PasswordInput({
  value,
  onChange,
  label = "Contraseña",
  required = false,
  fullWidth = true,
  margin = "normal",
  autoComplete = "current-password",
  error = false,
  helperText,
  disabled = false,
  name = "password",
  id,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      label={label}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      autoComplete={autoComplete}
      error={error}
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              tabIndex={-1}
            >
              {showPassword ? (
                <VisibilityOffIcon aria-hidden="true" />
              ) : (
                <VisibilityIcon aria-hidden="true" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
