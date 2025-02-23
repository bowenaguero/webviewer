import { Provider } from "@/components/ui/provider";
import Topbar from "@/components/general/Topbar";
import Footer from "@/components/general/Footer";
import { Box } from "@chakra-ui/react";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
