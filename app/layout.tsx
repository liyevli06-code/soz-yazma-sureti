import "./globals.css";

export const metadata = {
  title: "Söz Yazma Dünyası",
  description: "Azərbaycanca yazma testi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body style={{ margin: 0, backgroundColor: '#f7fafc' }}>
        {children}
      </body>
    </html>
  );
}
