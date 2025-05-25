"use client";

import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <style jsx global>{`
          :root {
            --background: 0 0% 100%;
            --foreground: 240 10% 3.9%;
            --card: 0 0% 100%;
            --card-foreground: 240 10% 3.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 240 10% 3.9%;
            --muted: 240 4.8% 95.9%;
            --muted-foreground: 240 3.8% 46.1%;
            --accent: 240 4.8% 95.9%;
            --accent-foreground: 240 5.9% 10%;
            --border: 240 5.9% 90%;
            --input: 240 5.9% 90%;
            --ring: 346 84% 61%;
            --radius: 0.5rem;
            --primary: 346 90% 50%;
            --primary-foreground: 0 0% 98%;
            --secondary: 346 70% 80%;
            --secondary-foreground: 346 10% 20%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 0 0% 98%;
          }

          .dark {
            --background: 240 10% 3.9%;
            --foreground: 0 0% 98%;
            --card: 240 10% 3.9%;
            --card-foreground: 0 0% 98%;
            --popover: 240 10% 3.9%;
            --popover-foreground: 0 0% 98%;
            --muted: 240 3.7% 15.9%;
            --muted-foreground: 240 5% 64.9%;
            --accent: 240 3.7% 15.9%;
            --accent-foreground: 0 0% 98%;
            --border: 240 3.7% 15.9%;
            --input: 240 3.7% 15.9%;
            --ring: 346 84% 61%;
            --primary: 346 84% 61%;
            --primary-foreground: 0 0% 98%;
            --secondary: 346 40% 30%;
            --secondary-foreground: 0 0% 98%;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: ${inter.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
