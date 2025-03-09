import { MenuContent, MenuItem, MenuRoot, MenuTrigger, MenuItemCommand, MenuTriggerItem } from "../ui/menu";
import { FaEllipsisV } from "react-icons/fa";
import { Icon, IconButton } from "@chakra-ui/react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";

export default function ActionsMenu({ event }) {
  const handleCopy = (type) => {
    if (type === "url") {
      navigator.clipboard.writeText(event.url);
    } else if (type === "domain") {
      navigator.clipboard.writeText(event.domain);
    }
  }

  const handleSendTo = (provider) => {
    if (provider === "virustotal") {
      window.open(`https://www.virustotal.com/gui/domain/${event.domain}`, "_blank");
    } else if (provider === "browserling") {
      window.open(`https://www.browserling.com/browse/win10/chrome127/${event.url}`, "_blank");
    } else if (provider === "urlscan") {
      window.open(`https://urlscan.io/search/#${event.domain}`, "_blank");
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
        <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
            <MenuTriggerItem value="copy" onClick={handleCopy}>Copy</MenuTriggerItem>
            <MenuContent>
                <MenuItem value="url" onClick={() => handleCopy("url")}><Icon as={FaCopy} /> URL</MenuItem>
                <MenuItem value="domain" onClick={() => handleCopy("domain")}><Icon as={FaCopy} /> Domain</MenuItem>
            </MenuContent>
        </MenuRoot>
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
