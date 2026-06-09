import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skorky News',
  description: 'Přehled nejdůležitějších světových a českých zpráv v češtině',

  manifest: '/manifest.json',

  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Skorky News',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}