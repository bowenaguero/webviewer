import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuItemCommand,
  MenuTriggerItem,
  MenuRoot,
} from "@/components/ui/menu";
import { FaExternalLinkAlt, FaCopy } from "react-icons/fa";

export default function ContextMenu({ item, type, handleAlert }) {
    const securityTools = {
        browserling: 'https://www.browserling.com/browse/win10/chrome127/${url}',
        vt: 'https://www.virustotal.com/gui/domain/${url}',
        domainTools: 'https://whois.domaintools.com/${url}',
    }

  const truncateText = (text) => {
    if (text.length <= 100) return text;
    return text.slice(0, 100) + "...";
  };

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item);
  };

  const handleOpen = (item) => {
    handleAlert('url', item);
  };

  const handleSendTo = (platform, item) => {
    if (platform === 'domainTools' || platform === 'vt') {
      try {
        const urlObj = new URL(item); 
        item = urlObj.hostname;
      } catch (error) {
        console.error("Invalid URL:", item); 
      }
    }
    const url = securityTools[platform].replace('${url}', encodeURIComponent(item));
    window.open(url, '_blank');
  };

  return (
    <>
      <MenuRoot variant="subtle">
        <MenuContextTrigger>{truncateText(item)}</MenuContextTrigger>
        <MenuContent>
          <MenuItem value="copy-a" onClick={() => handleCopy(item)}>
            Copy{" "}
            <MenuItemCommand>
              <FaCopy />
            </MenuItemCommand>
          </MenuItem>
          {type === "url" && (
            <>
              <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
                <MenuTriggerItem value="filter-by">Filter By</MenuTriggerItem>
                <MenuContent>
                  <MenuItem value="url">URL</MenuItem>
                  <MenuItem value="domain">Domain</MenuItem>
                </MenuContent>
              </MenuRoot>
              <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
                <MenuTriggerItem value="send-to">Send To</MenuTriggerItem>
                <MenuContent>
                  <MenuItem value="browserling" onClick={() => handleSendTo('browserling', item)}>Browserling</MenuItem>
                  <MenuItem value="vt" onClick={() => handleSendTo('vt', item)}>VirusTotal</MenuItem>
                  <MenuItem value="domain-tools" onClick={() => handleSendTo('domainTools', item)}>DomainTools</MenuItem>
                </MenuContent>
              </MenuRoot>
              <MenuItem value="open" onClick={() => handleOpen(item)}>
                Open{" "}
                <MenuItemCommand>
                  <FaExternalLinkAlt />
                </MenuItemCommand>
              </MenuItem>
            </>
          )}
          {type === "title" && (
            <MenuItem value="add-to-filter">Add To Filter</MenuItem>
          )}
        </MenuContent>
      </MenuRoot>
    </>
  );
}
