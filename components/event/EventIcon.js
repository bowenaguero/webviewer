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
    visit: FaEye,
    download: FaDownload,
    autofill: FaICursor,
    bookmark: FaBookmark,
    keyword: FaSearch,
  }

  const iconColor = { 
    visit: "#AA4586",
    download: "#1B998B",
    autofill: "#F2DC5D",
    bookmark: "#F46036",
    keyword: "#468C98",
  }
  
  return (
    <Icon size={size} as={icons[eventType]} color={iconColor[eventType]} />
  );
}
