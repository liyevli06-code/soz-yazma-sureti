import React from "react";

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
      <body>{children}</body>
    </html>
  );
}
