import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ToasterProvider } from "@/components/toaster-provider";
import { ReactQueryProvider } from "@/components/react-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Conta comigo",
  description: "Gerencie suas despesas e grupos de forma simples e eficiente",
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-pattern`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ReactQueryProvider>
            <div className="flex min-h-screen items-center justify-center">
              {children}
            </div>
          </ReactQueryProvider>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
