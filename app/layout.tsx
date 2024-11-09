import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';

import Cursor from '@/components/animated-cursor';
import Footer from '@/components/footer';
// import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://windsornguyen.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Windsor Nguyen',
    template: '%s | Windsor Nguyen',
  },
  description: "Windsor's personal website",
  openGraph: {
    title: "Windsor Nguyen's website",
    description: 'Windsor Nguyen is a [TBD].',
    url: 'https://windsornguyen.com',
    siteName: "Windsor Nguyen's website",
  },
  twitter: {
    card: 'summary_large_image',
    site: '@windsornguyen',
    creator: '@windsornguyen',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang='en' className={`${inter.className}`}>
        <body className='antialiased tracking-tight'>
          <div className='min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-white text-gray-900'>
            <main className='max-w-[60ch] mx-auto w-full space-y-6'>
              {children}
              <Cursor />
            </main>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </div>
        </body>
        <GoogleAnalytics gaId={`${process.env.gaID}`} />
      </html>
    </ViewTransitions>
  );
}
