import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as ThemeContextProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noto - Editor",
  description: "Simple APP para gerar anotações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          color="white"
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
      </head>
      <body className={inter.className}>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="noto-theme"
        >
          <ThemeContextProvider>
            <AuthProvider>
              <Toaster position="bottom-right" />
              {children}
            </AuthProvider>
          </ThemeContextProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
