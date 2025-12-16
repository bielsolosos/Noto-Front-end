import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLProgressElement> {
  value?: number;
  max?: number;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
}

const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  (
    { value, max = 100, variant = "primary", className = "", ...props },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      primary: "progress-primary",
      secondary: "progress-secondary",
      accent: "progress-accent",
      info: "progress-info",
      success: "progress-success",
      warning: "progress-warning",
      error: "progress-error",
    };

    const classes = ["progress", variantClasses[variant], "w-full", className]
      .filter(Boolean)
      .join(" ");

    return (
      <progress
        ref={ref}
        className={classes}
        value={value}
        max={max}
        {...props}
      />
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
export default Progress;
