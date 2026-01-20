'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BROWSER_ICONS_SUPPORTED,
  BROWSER_ICONS_UNSUPPORTED,
} from '@/lib/constants/index';

export default function Supports() {
  return (
    <div className="flex items-center gap-2">
      {BROWSER_ICONS_SUPPORTED.map(({ id, icon: Icon, tooltip }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <span className="text-fg-secondary opacity-80 cursor-default">
              <Icon className="size-5" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ))}
      {BROWSER_ICONS_UNSUPPORTED.map(({ id, icon: Icon, tooltip }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <span className="text-fg-secondary opacity-10 cursor-default">
              <Icon className="size-5" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
