import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
}

const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  (
    { variant = "spinner", size = "md", color, className = "", ...props },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      spinner: "loading-spinner",
      dots: "loading-dots",
      ring: "loading-ring",
      ball: "loading-ball",
      bars: "loading-bars",
      infinity: "loading-infinity",
    };

    const sizeClasses: Record<string, string> = {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
    };

    const colorClasses: Record<string, string> = {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    };

    const classes = [
      "loading",
      variantClasses[variant],
      sizeClasses[size],
      color && colorClasses[color],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <span ref={ref} className={classes} {...props} />;
  }
);

Loading.displayName = "Loading";

export { Loading };
export default Loading;
