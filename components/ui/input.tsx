import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: "bordered" | "ghost";
  inputSize?: "xs" | "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      variant = "bordered",
      inputSize = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      xs: "input-xs",
      sm: "input-sm",
      md: "",
      lg: "input-lg",
    };

    const variantClasses: Record<string, string> = {
      bordered: "input-bordered",
      ghost: "input-ghost",
    };

    const inputClasses = [
      "input",
      variantClasses[variant],
      sizeClasses[inputSize],
      error && "input-error",
      "w-full",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {(helperText || error) && (
          <label className="label">
            <span className={`label-text-alt ${error ? "text-error" : ""}`}>
              {error || helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;
