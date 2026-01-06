'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaChrome, FaFirefox, FaSafari, FaEdge, FaOpera } from 'react-icons/fa';

const supportedBrowsers = new Map([
  ['chrome', { icon: FaChrome, tooltip: 'Chromium (Supported)' }],
  ['firefox', { icon: FaFirefox, tooltip: 'Firefox (Supported)' }],
  ['edge', { icon: FaEdge, tooltip: 'Edge (Supported)' }],
]);

const unsupportedBrowsers = new Map([
  ['safari', { icon: FaSafari, tooltip: 'Safari (Not Supported)' }],
  ['opera', { icon: FaOpera, tooltip: 'Opera (Not Supported)' }],
]);

export default function Supports() {
  return (
    <div className="flex items-center gap-2">
      {Array.from(supportedBrowsers.entries()).map(
        ([browser, { icon: Icon, tooltip }]) => (
          <Tooltip key={browser}>
            <TooltipTrigger asChild>
              <span className="text-gray-500 opacity-80 cursor-default">
                <Icon className="size-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ),
      )}
      {Array.from(unsupportedBrowsers.entries()).map(
        ([browser, { icon: Icon, tooltip }]) => (
          <Tooltip key={browser}>
            <TooltipTrigger asChild>
              <span className="text-gray-500 opacity-10 cursor-default">
                <Icon className="size-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ),
      )}
    </div>
  );
}
