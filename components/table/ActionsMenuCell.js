import { MenuContent, MenuItem, MenuRoot, MenuTrigger, MenuItemCommand, MenuTriggerItem } from "../ui/menu";
import { FaEllipsisV } from "react-icons/fa";
import { Icon, IconButton } from "@chakra-ui/react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";

export default function ActionsMenu({ event }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(event.url);
  }

  const handleSendTo = (provider) => {
    if (provider === "virustotal") {
      window.open(`https://www.virustotal.com/ui/search?limit=2&relationships%5Bcomment%5D=author%2Citem&query=${event.url}`, "_blank");
    } else if (provider === "browserling") {
      window.open(`https://www.browserling.com/browse/win10/chrome127/${event.url}`, "_blank");
    } else if (provider === "urlscan") {
      window.open(`https://urlscan.io/search/#${event.url}`, "_blank");
    }
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" size="sm" color="gray.400">
          <Icon as={FaEllipsisV} />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="copy" onClick={handleCopy}><Icon as={FaCopy} /> Copy</MenuItem>
        <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
            <MenuTriggerItem value="send-to">
                Send to
            </MenuTriggerItem>
            <MenuContent>
                <MenuItem value="virustotal" onClick={() => handleSendTo("virustotal")}><Icon as={FaExternalLinkAlt} /> VirusTotal</MenuItem>
                <MenuItem value="browserling" onClick={() => handleSendTo("browserling")}><Icon as={FaExternalLinkAlt} /> Browserling</MenuItem>
                <MenuItem value="urlscan" onClick={() => handleSendTo("urlscan")}><Icon as={FaExternalLinkAlt} /> URLScan</MenuItem>
            </MenuContent>
        </MenuRoot>
      </MenuContent>
    </MenuRoot>
  );
}
