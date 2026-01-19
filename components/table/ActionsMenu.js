'use client';

import { memo, useCallback } from 'react';
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
import { COPY_TYPES, SEND_TO_PROVIDERS } from './config';
import { FaEllipsisV, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'sonner';

const ActionsMenu = memo(function ActionsMenu({ event }) {
  const handleCopy = useCallback(
    (type) => {
      const config = COPY_TYPES[type];
      if (!config) return;

      navigator.clipboard.writeText(config.getValue(event));
      toast.success('Copied to clipboard', {
        description: config.description,
      });
    },
    [event],
  );

  const handleSendTo = useCallback(
    (provider) => {
      const config = SEND_TO_PROVIDERS[provider];
      if (!config) return;

      const urlParam = provider === 'browserling' ? event.url : event.domain;
      window.open(config.getUrl(urlParam), '_blank');
    },
    [event.url, event.domain],
  );

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
});

export default ActionsMenu;
