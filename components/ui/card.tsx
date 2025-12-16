import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  bordered?: boolean;
  compact?: boolean;
  side?: boolean;
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      description,
      image,
      imageAlt = "",
      actions,
      bordered = false,
      compact = false,
      side = false,
      glass = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      "card",
      "bg-base-100",
      bordered && "card-bordered",
      compact && "card-compact",
      side && "card-side",
      glass && "glass",
      "shadow-xl",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {image && (
          <figure>
            <img src={image} alt={imageAlt} />
          </figure>
        )}
        <div className="card-body">
          {title && <h2 className="card-title">{title}</h2>}
          {description && <p>{description}</p>}
          {children}
          {actions && <div className="card-actions justify-end">{actions}</div>}
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
export default Card;
