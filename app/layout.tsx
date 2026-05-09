import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mini Website Builder",
  description: "A website builder inspired by Rekaz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cn("h-full antialiased", "font-sans")}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
