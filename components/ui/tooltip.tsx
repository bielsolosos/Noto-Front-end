import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  open?: boolean;
  children: ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      position = "top",
      variant,
      open = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const positionClasses: Record<string, string> = {
      top: "tooltip-top",
      bottom: "tooltip-bottom",
      left: "tooltip-left",
      right: "tooltip-right",
    };

    const variantClasses: Record<string, string> = {
      primary: "tooltip-primary",
      secondary: "tooltip-secondary",
      accent: "tooltip-accent",
      info: "tooltip-info",
      success: "tooltip-success",
      warning: "tooltip-warning",
      error: "tooltip-error",
    };

    const classes = [
      "tooltip",
      positionClasses[position],
      variant && variantClasses[variant],
      open && "tooltip-open",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} data-tip={content} {...props}>
        {children}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
export default Tooltip;
