import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
