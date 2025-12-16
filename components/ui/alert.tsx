import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  icon?: ReactNode;
  title?: string;
  actions?: ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      icon,
      title,
      actions,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
      error: "alert-error",
    };

    const defaultIcons: Record<string, ReactNode> = {
      info: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      success: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      warning: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      error: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };

    const classes = ["alert", variantClasses[variant], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} role="alert" className={classes} {...props}>
        {icon || defaultIcons[variant]}
        <div>
          {title && <h3 className="font-bold">{title}</h3>}
          <div className="text-xs">{children}</div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
export default Alert;
