import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface TabItem {
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  activeTab?: number;
  onChange?: (index: number) => void;
  variant?: "bordered" | "lifted" | "boxed";
  size?: "xs" | "sm" | "md" | "lg";
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      activeTab = 0,
      onChange,
      variant = "bordered",
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<string, string> = {
      bordered: "tabs-bordered",
      lifted: "tabs-lifted",
      boxed: "tabs-boxed",
    };

    const sizeClasses: Record<string, string> = {
      xs: "tabs-xs",
      sm: "tabs-sm",
      md: "",
      lg: "tabs-lg",
    };

    const tabsClasses = [
      "tabs",
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} {...props}>
        <div role="tablist" className={tabsClasses}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              role="tab"
              className={`tab ${index === activeTab ? "tab-active" : ""}`}
              disabled={tab.disabled}
              onClick={() => onChange?.(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">{tabs[activeTab]?.content}</div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs };
export default Tabs;
