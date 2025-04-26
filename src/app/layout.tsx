import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

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
      <body className={`${inter.variable} ${geistMono.variable} font-sans bg-black text-white min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
