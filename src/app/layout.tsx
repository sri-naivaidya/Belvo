import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Client Admin Panel",
  description: "Premium client collaboration platform for digital agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
