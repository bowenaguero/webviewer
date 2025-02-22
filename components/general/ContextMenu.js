import {
    MenuContent,
    MenuContextTrigger,
    MenuItem,
    MenuItemCommand,
    MenuTriggerItem,
    MenuRoot
} from "@/components/ui/menu"

export default function ContextMenu({item}) {

    const truncateText = (text) => {
        if (text.length <= 100) return text;
        return text.slice(0, 100) + "...";
      };

    const handleCopy = (item) => {
        console.log("hello");
        navigator.clipboard.writeText(item);
    }

    return (
        <MenuRoot variant="subtle">
            <MenuContextTrigger>
                {truncateText(item)}
            </MenuContextTrigger>
            <MenuContent>
                <MenuItem value="copy-a" onSelect={handleCopy}>
                    Copy
                </MenuItem>
                <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
                    <MenuTriggerItem value="filter-on">
                        Filter By
                    </MenuTriggerItem>
                    <MenuContent>
                        <MenuItem value="url">URL</MenuItem>
                        <MenuItem value="domain">Domain</MenuItem>
                    </MenuContent>
                </MenuRoot>
                <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
                    <MenuTriggerItem value="send-to">
                        Send To
                    </MenuTriggerItem>
                    <MenuContent>
                        <MenuItem value="browserling">Browserling</MenuItem>
                        <MenuItem value="vt">VirusTotal</MenuItem>
                        <MenuItem value="domain-tools">DomainTools</MenuItem>
                    </MenuContent>
                </MenuRoot>
            </MenuContent>
        </MenuRoot>
    )
}
