import { Center, VStack, Separator, Box } from "@chakra-ui/react";
import { FaFileDownload, FaUpload, FaEye } from "react-icons/fa";
import HowToTimeline from "@/components/How/HowToTimeline";
import SupportedBrowsersTable from "@/components/How/SupportedBrowsersTable";
import HowItWorks from "@/components/How/HowItWorks";

const instructions = [
  {
    title: "Fetch your browser history file",
    description: "Supported browser history files are listed below.",
    gif: "/images/fetch-browser-history-file.gif",
    icon: <FaFileDownload />,
  },
  {
    title: "Upload your browser history file",
    description: "Upload your browser history file to WebViewer.",
    gif: "/images/upload-browser-history-file.gif",
    icon: <FaUpload />,
  },
  {
    title: "View your browser history",
    description:
      "Browser history is displayed in a table format, which can be filtered by date, event type, and more.",
    gif: "/images/view-browser-history.gif",
    icon: <FaEye />,
  },
];

const supportedBrowsers = [
  {
    name: "Chromium",
    supported: true,
    fileName: "History",
    filePath: [
      "Windows: AppData/Local/Google/Chrome/User Data/Default/History",
      "macOS: Library/Application Support/Google/Chrome/Default/History",
    ],
  },
  {
    name: "Firefox",
    supported: true,
    fileName: "places.sqlite",
    filePath: [
      "Windows: AppData/Local/Mozilla/Firefox/Profiles/Default/places.sqlite",
      "macOS: Library/Application Support/Mozilla/Firefox/Profiles/Default/places.sqlite",
    ],
  },
  {
    name: "Edge",
    supported: true,
    fileName: "History",
    filePath: [
      "Windows: AppData/Local/Microsoft/Edge/User Data/Default/History",
      "macOS: Library/Application Support/Microsoft/Edge/Default/History",
    ],
  },
  {
    name: "Safari",
    supported: false,
    fileName: "History",
    filePath: [
      "Windows: AppData/Local/Apple Computer/Safari/History",
      "macOS: Library/Application Support/Apple/Safari/History",
    ],
  },
  {
    name: "Opera (Not Tested)",
    supported: false,
    fileName: "History",
    filePath: [
      "Windows: AppData/Local/Opera Software/Opera Stable/History",
      "macOS: Library/Application Support/Opera Software/Opera Stable/History",
    ],
  },
  {
    name: "Brave (Not Tested)",
    supported: false,
    fileName: "History",
    filePath: [
      "Windows: AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History",
      "macOS: Library/Application Support/BraveSoftware/Brave-Browser/Default/History",
    ],
  },
];

export default function How() {
  return (
    <Center p={10}>
      <Box
        borderColor="gray.800"
        pl={10}
        pr={10}
      >
        <VStack gap={10} p={10} alignItems="start">
          <HowToTimeline instructions={instructions} />
          <Separator />
          <SupportedBrowsersTable supportedBrowsers={supportedBrowsers} />
          <Separator />
          <HowItWorks />
        </VStack>
      </Box>
    </Center>
  );
}
