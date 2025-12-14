import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Nexus - Pusat Proyek Tim Anda",
  description:
    "Platform all-in-one untuk tim berkolaborasi dalam proyek, kelola anggota, dan atur tagihan — semua dalam satu dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className={`${figtree.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
