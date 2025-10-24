import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Cubos Movies',
  description: 'Front do Cubos Movies',
}

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
     <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
