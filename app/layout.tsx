import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CZ World Briefing',
  description: 'Český souhrn světových zpráv podle regionů a témat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
