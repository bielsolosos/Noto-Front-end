import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useState } from "react";

export interface AccordionItemProps {
  title: string;
  content: ReactNode;
  name?: string;
  defaultOpen?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  variant?: "arrow" | "plus";
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      variant = "arrow",
      className = "",
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = useState<Set<number>>(
      new Set(items.filter((item) => item.defaultOpen).map((_, index) => index))
    );

    const toggleItem = (index: number) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          if (!allowMultiple) {
            newSet.clear();
          }
          newSet.add(index);
        }
        return newSet;
      });
    };

    const variantClass =
      variant === "plus" ? "collapse-plus" : "collapse-arrow";

    return (
      <div ref={ref} className={`${className}`} {...props}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`collapse ${variantClass} bg-base-200 mb-2 rounded-box`}
          >
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              name={item.name || "accordion"}
              checked={openItems.has(index)}
              onChange={() => toggleItem(index)}
            />
            <div className="collapse-title text-xl font-medium">
              {item.title}
            </div>
            <div className="collapse-content">{item.content}</div>
          </div>
        ))}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion };
export default Accordion;
