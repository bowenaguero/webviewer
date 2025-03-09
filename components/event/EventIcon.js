import { Icon, Image } from "@chakra-ui/react";
import { FaEye, FaDownload, FaICursor, FaBookmark, FaSearch } from "react-icons/fa";

export default function Event({ eventType, size = "md" }) {
  const sizeInPx = {
    sm: "14px",
    md: "18px",
    lg: "26px",
    xl: "32px"
  }[size] || "16px";

  if (eventType === "chrome") {
    return <Image src="/images/chrome-logo.svg" alt="Chrome" w={sizeInPx} h={sizeInPx} />;
  }
  if (eventType === "firefox") {
    return <Image src="/images/firefox-logo.svg" alt="Firefox" w={sizeInPx} h={sizeInPx} />;
  }

  const icons = {
    Visit: FaEye,
    Download: FaDownload,
    Autofill: FaICursor,
    Bookmark: FaBookmark,
    Keyword: FaSearch,
  }

  const iconColor = { 
    Visit: "#AA4586",
    Download: "#1B998B",
    Autofill: "#F2DC5D",
    Bookmark: "#F46036",
    Keyword: "#468C98",
  }
  
  return (
    <Icon size={size} as={icons[eventType]} color={iconColor[eventType]} />
  );
}
