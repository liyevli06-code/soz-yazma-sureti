import React from "react";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: 'Söz Yazma Sürəti Ölçücü',
  description: 'Azərbaycanca söz yazma sürətinizi ölçün.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
