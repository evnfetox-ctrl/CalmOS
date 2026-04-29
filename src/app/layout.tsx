import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  metadataBase: new URL('https://calm-os.vercel.app/'),
  title: 'CalmOS - AI Emotional Wellness Assistant',
  description: 'A private, empathetic emotional wellness companion helping you manage stress through AI insights and breathing exercises.',
  openGraph: {
    title: 'CalmOS',
    description: 'Personal AI emotional wellness assistant',
    url: 'https://calm-os.vercel.app/',
    siteName: 'CalmOS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalmOS',
    description: 'Personal AI emotional wellness assistant',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-1 pb-24">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
