import { Icon } from "@chakra-ui/react";
import { FaEye, FaDownload, FaICursor, FaBookmark, FaQuestion } from "react-icons/fa";

export default function Event({ eventType }) {

  const icons = {
    visit: FaEye,
    download: FaDownload,
    autofill: FaICursor,
    bookmark: FaBookmark,
  }

  const iconColor = { 
    visit: "#AA4586",
    download: "#1B998B",
    autofill: "#F2DC5D",
    bookmark: "#F46036",
  }
  
  return (
    <Icon as={icons[eventType]} color={iconColor[eventType]} />
  );
}
