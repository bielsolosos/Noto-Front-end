import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: "bordered" | "ghost";
  textareaSize?: "xs" | "sm" | "md" | "lg";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      variant = "bordered",
      textareaSize = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      xs: "textarea-xs",
      sm: "textarea-sm",
      md: "",
      lg: "textarea-lg",
    };

    const variantClasses: Record<string, string> = {
      bordered: "textarea-bordered",
      ghost: "textarea-ghost",
    };

    const textareaClasses = [
      "textarea",
      variantClasses[variant],
      sizeClasses[textareaSize],
      error && "textarea-error",
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
        <textarea ref={ref} className={textareaClasses} {...props} />
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

Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;
