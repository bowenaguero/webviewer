import { Provider } from "@/components/ui/provider";
import Topbar from "@/components/general/Topbar";
import Footer from "@/components/general/Footer";
import { Box } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { ReactScan } from "./ReactScan";

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ReactScan/> */}
        <Provider>
          <Topbar />
          <Box minH={"calc(100vh - 120px)"} bg="gray.900">
              {children}
          </Box>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
