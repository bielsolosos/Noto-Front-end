import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('noto-theme');
                const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <link
          color="white"
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="bottom-right" />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
