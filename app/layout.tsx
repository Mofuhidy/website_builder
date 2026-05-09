import type { Metadata } from "next";
import { Cairo, Tajawal, Almarai } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

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
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        "h-full antialiased",
        "font-sans",
        cairo.variable,
        tajawal.variable,
        almarai.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
