import { Provider } from "@/components/ui/provider";
import Topbar from "@/components/general/Topbar";
import Footer from "@/components/general/Footer";
import { Box } from "@chakra-ui/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <Provider>
          <Topbar />
          <Box minH={"calc(100vh - 120px)"}>
            {children}
          </Box>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
