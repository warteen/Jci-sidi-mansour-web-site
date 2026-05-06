import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JCI Sidi Mansour | Empowering Young Leaders",
  description: "Welcome to JCI Sidi Mansour. We represent leadership, innovation, and community impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
