import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "VibeCafé - Keep the Vibe",
  description: "A community of Vibe Creators - where innovation meets inspiration",
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value || 'zh';
  return (
    <html lang={lang}>
      <body className="font-sans bg-black text-white min-h-screen">
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
