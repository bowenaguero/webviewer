import { useState } from "react";
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
                  <MenuItem value="browserling">Browserling</MenuItem>
                  <MenuItem value="vt">VirusTotal</MenuItem>
                  <MenuItem value="domain-tools">DomainTools</MenuItem>
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
