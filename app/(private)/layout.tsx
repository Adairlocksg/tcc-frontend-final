import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";
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
            <div className="flex min-h-screen w-full flex-col">
              <main className="flex-1 pb-16">{children}</main>
              <MobileNav />
            </div>
            <Toaster position="top-center" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
