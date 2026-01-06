'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EXTERNAL_URLS } from '../utils/constants';
import { FaEllipsisV, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'sonner';

const COPY_TYPES = {
  event: {
    getValue: (event) => JSON.stringify(event),
    description: 'Event copied to clipboard',
  },
  url: {
    getValue: (event) => event.url,
    description: 'URL copied to clipboard',
  },
  domain: {
    getValue: (event) => event.domain,
    description: 'Domain copied to clipboard',
  },
};

const SEND_TO_PROVIDERS = {
  virustotal: { label: 'VirusTotal', getUrl: EXTERNAL_URLS.virustotal },
  browserling: { label: 'Browserling', getUrl: EXTERNAL_URLS.browserling },
  urlscan: { label: 'URLScan', getUrl: EXTERNAL_URLS.urlscan },
};

export default function ActionsMenu({ event }) {
  const handleCopy = (type) => {
    const config = COPY_TYPES[type];
    if (!config) return;

    navigator.clipboard.writeText(config.getValue(event));
    toast.success('Copied to clipboard', {
      description: config.description,
    });
  };

  const handleSendTo = (provider) => {
    const config = SEND_TO_PROVIDERS[provider];
    if (!config) return;

    const urlParam = provider === 'browserling' ? event.url : event.domain;
    window.open(config.getUrl(urlParam), '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-gray-400">
          <FaEllipsisV className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Copy</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.keys(COPY_TYPES).map((type) => (
              <DropdownMenuItem key={type} onClick={() => handleCopy(type)}>
                <FaCopy className="size-3" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Send to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.entries(SEND_TO_PROVIDERS).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => handleSendTo(key)}>
                <FaExternalLinkAlt className="size-3" />
                {config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
