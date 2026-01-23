import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Söz Yazma Dünyası",
  description: "Azərbaycanca yazma testi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
