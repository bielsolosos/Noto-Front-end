"use client";

import { BookOpen } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-border"></div>
          <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-primary border-t-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-base md:text-lg text-muted-foreground animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
