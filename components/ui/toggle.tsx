import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  labelPosition?: "start" | "end";
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info";
  toggleSize?: "xs" | "sm" | "md" | "lg";
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      labelPosition = "end",
      variant = "primary",
      toggleSize = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      primary: "toggle-primary",
      secondary: "toggle-secondary",
      accent: "toggle-accent",
      success: "toggle-success",
      warning: "toggle-warning",
      error: "toggle-error",
      info: "toggle-info",
    };

    const sizeClasses: Record<string, string> = {
      xs: "toggle-xs",
      sm: "toggle-sm",
      md: "",
      lg: "toggle-lg",
    };

    const toggleClasses = [
      "toggle",
      variantClasses[variant],
      sizeClasses[toggleSize],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const toggle = (
      <input ref={ref} type="checkbox" className={toggleClasses} {...props} />
    );

    if (!label) {
      return toggle;
    }

    return (
      <label className="label cursor-pointer gap-2">
        {labelPosition === "start" && (
          <span className="label-text">{label}</span>
        )}
        {toggle}
        {labelPosition === "end" && <span className="label-text">{label}</span>}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
export default Toggle;
