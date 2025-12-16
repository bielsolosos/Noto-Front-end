import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "ghost"
    | "link"
    | "outline"
    | "error"
    | "success"
    | "warning"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  wide?: boolean;
  block?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      wide = false,
      block = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      neutral: "btn-neutral",
      ghost: "btn-ghost",
      link: "btn-link",
      outline: "btn-outline",
      error: "btn-error",
      success: "btn-success",
      warning: "btn-warning",
      info: "btn-info",
    };

    const sizeClasses: Record<string, string> = {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    };

    const classes = [
      "btn",
      variantClasses[variant],
      sizeClasses[size],
      wide && "btn-wide",
      block && "btn-block",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="loading loading-spinner loading-sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
