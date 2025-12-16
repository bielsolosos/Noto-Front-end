import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "../styles/markdown.css";
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
    <html lang="pt-BR" data-theme="bielLight" suppressHydrationWarning>
      <head>
        <link
          color="white"
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('noto-theme');
                const isDark = savedTheme === 'dark' || 
                              (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                const theme = isDark ? 'bielDark' : 'bielLight';
                document.documentElement.setAttribute('data-theme', theme);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
