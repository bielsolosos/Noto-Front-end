import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: "bordered" | "ghost";
  selectSize?: "xs" | "sm" | "md" | "lg";
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      variant = "bordered",
      selectSize = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      xs: "select-xs",
      sm: "select-sm",
      md: "",
      lg: "select-lg",
    };

    const variantClasses: Record<string, string> = {
      bordered: "select-bordered",
      ghost: "select-ghost",
    };

    const selectClasses = [
      "select",
      variantClasses[variant],
      sizeClasses[selectSize],
      error && "select-error",
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
        <select ref={ref} className={selectClasses} {...props}>
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";

export { Select };
export default Select;
