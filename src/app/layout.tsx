import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Vibe Café - Keep the Vibe",
  description: "A community of Vibe Creators - where innovation meets inspiration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="font-sans bg-black text-white min-h-screen">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
