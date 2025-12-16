import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "circle" | "rounded" | "squircle";
  online?: boolean;
  offline?: boolean;
  ring?: boolean;
  ringColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "",
      placeholder,
      size = "md",
      shape = "circle",
      online = false,
      offline = false,
      ring = false,
      ringColor = "primary",
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<string, string> = {
      xs: "w-8",
      sm: "w-12",
      md: "w-16",
      lg: "w-24",
    };

    const shapeClasses: Record<string, string> = {
      circle: "rounded-full",
      rounded: "rounded-xl",
      squircle: "mask mask-squircle",
    };

    const ringColorClasses: Record<string, string> = {
      primary: "ring-primary",
      secondary: "ring-secondary",
      accent: "ring-accent",
      success: "ring-success",
      warning: "ring-warning",
      error: "ring-error",
    };

    const statusClass = online ? "online" : offline ? "offline" : "";

    const containerClasses = [
      "avatar",
      statusClass,
      placeholder && !src ? "placeholder" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const avatarClasses = [
      sizeClasses[size],
      shape !== "squircle" ? shapeClasses[shape] : "",
      shape === "squircle" ? shapeClasses[shape] : "",
      ring &&
        `ring ring-offset-base-100 ring-offset-2 ${ringColorClasses[ringColor]}`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {src ? (
          <div className={avatarClasses}>
            <img src={src} alt={alt} />
          </div>
        ) : placeholder ? (
          <div className={`bg-neutral text-neutral-content ${avatarClasses}`}>
            <span className="text-xl">{placeholder}</span>
          </div>
        ) : null}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
export default Avatar;
