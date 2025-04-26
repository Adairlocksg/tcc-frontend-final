import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ToasterProvider } from "@/components/toaster-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Management App",
  description: "Track and manage expenses with friends and family",
  manifest: "/manifest.json",
  generator: "v0.dev",
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
          <div className="flex min-h-screen items-center justify-center">
            {children}
          </div>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
