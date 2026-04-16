export type ExportType = "MD" | "NOTO_PDF";

export const EXPORT_OPTIONS: { type: ExportType; label: string }[] = [
  { type: "MD", label: "Markdown (.md)" },
  { type: "NOTO_PDF", label: "Noto PDF (.pdf)" },
];
