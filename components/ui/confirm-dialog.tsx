"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCallback, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook para facilitar o uso do dialog
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveRef, setResolveRef] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
  }>({
    title: "",
    description: "",
  });

  const confirm = useCallback(
    (options: {
      title: string;
      description: string;
      confirmText?: string;
      cancelText?: string;
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig(options);
        setResolveRef({ resolve });
        setIsOpen(true);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef?.resolve(true);
    setResolveRef(null);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef?.resolve(false);
    setResolveRef(null);
  }, [resolveRef]);

  const ConfirmDialogComponent = useCallback(
    () => (
      <ConfirmDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}
        onConfirm={handleConfirm}
        {...config}
      />
    ),
    [isOpen, config, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}
