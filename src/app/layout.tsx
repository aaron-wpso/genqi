import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenQi Invoice',
  description: 'GenQi Wellness Centre — Invoice Generator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
