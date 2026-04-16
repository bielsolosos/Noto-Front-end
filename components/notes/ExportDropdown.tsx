"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { EXPORT_OPTIONS, ExportType } from "@/types/export";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportDropdownProps {
  pageId: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export function ExportDropdown({
  pageId,
  size = "sm",
  variant = "outline",
  className,
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: ExportType) => {
    if (isExporting) return;

    setIsExporting(true);
    const toastId = toast.loading("Preparando exportação...");

    try {
      const response = await api.get(`/api/pages/${pageId}/export`, {
        params: { type },
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `export_${pageId}.${type === "MD" ? "md" : "pdf"}`;

      if (contentDisposition && contentDisposition.includes("filename=")) {
        const filenameMatch = contentDisposition.match(/filename="?([^";]*)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download iniciado com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Ocorreu um erro ao tentar exportar a página.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 md:mr-2" />
          )}
          <span className="hidden md:inline">Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {EXPORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={() => handleExport(option.type)}
            disabled={isExporting}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
