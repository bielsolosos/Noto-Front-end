import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "ghost"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md" | "lg";
  outline?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "primary",
      size = "md",
      outline = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      neutral: "badge-neutral",
      ghost: "badge-ghost",
      info: "badge-info",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
    };

    const sizeClasses: Record<string, string> = {
      xs: "badge-xs",
      sm: "badge-sm",
      md: "",
      lg: "badge-lg",
    };

    const classes = [
      "badge",
      variantClasses[variant],
      sizeClasses[size],
      outline && "badge-outline",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
export default Badge;
