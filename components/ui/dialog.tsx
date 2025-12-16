import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export interface DialogProps extends HTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  actions?: ReactNode;
  closeOnBackdrop?: boolean;
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  (
    {
      open = false,
      onClose,
      title,
      actions,
      closeOnBackdrop = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const classes = ["modal", open && "modal-open", className]
      .filter(Boolean)
      .join(" ");

    const handleBackdropClick = () => {
      if (closeOnBackdrop && onClose) {
        onClose();
      }
    };

    return (
      <dialog ref={ref} className={classes} {...props}>
        <div className="modal-box">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          <div className="py-4">{children}</div>
          {actions && <div className="modal-action">{actions}</div>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleBackdropClick}>close</button>
        </form>
      </dialog>
    );
  }
);

Dialog.displayName = "Dialog";

export { Dialog };
export default Dialog;
