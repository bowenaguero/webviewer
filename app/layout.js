import './globals.css';
import Topbar from '@/components/topbar/Topbar';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Viewer',
  description: 'Analyze browser history',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            ::selection {
              background-color: #a0aec0;
              color: white;
            }

            ::-moz-selection {
              background-color: #a0aec0;
              color: white;
            }
          `}
        </style>
      </head>
      <body className={GeistSans.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Toaster />
          <div className="min-h-screen bg-gray-900">
            <Topbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
