import { ReactScan } from './ReactScan';
import Topbar from '@/components/topbar/Topbar';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
// import Footer from "@/components/general/Footer";
import { Box } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'WebViewer',
  description: 'A tool to analyze browser history',
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
      <body className={inter.className}>
        {/* <ReactScan/> */}
        <Analytics />
        <Provider>
          <Toaster />
          <Box minH={'100vh'} bg="gray.900">
            <Topbar />
            {children}
          </Box>
          {/* <Footer /> */}
        </Provider>
      </body>
    </html>
  );
}
