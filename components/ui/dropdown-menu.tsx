import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface DropdownItemProps extends HTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
}

export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  ({ disabled = false, className = "", children, ...props }, ref) => {
    return (
      <li ref={ref} className={disabled ? "disabled" : ""} {...props}>
        <a className={className}>{children}</a>
      </li>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  align?: "start" | "end";
  position?: "top" | "bottom" | "left" | "right";
  hover?: boolean;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      trigger,
      align = "start",
      position = "bottom",
      hover = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const positionClasses: Record<string, string> = {
      top: "dropdown-top",
      bottom: "",
      left: "dropdown-left",
      right: "dropdown-right",
    };

    const alignClasses: Record<string, string> = {
      start: "",
      end: "dropdown-end",
    };

    const classes = [
      "dropdown",
      positionClasses[position],
      alignClasses[align],
      hover && "dropdown-hover",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <div tabIndex={0} role="button" className="btn m-1">
          {trigger}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {children}
        </ul>
      </div>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export { DropdownMenu };
export default DropdownMenu;
