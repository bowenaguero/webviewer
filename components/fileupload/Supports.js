import { Tooltip } from '@/components/ui/tooltip';
import { Box, Icon } from '@chakra-ui/react';
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
    <Box display="flex" alignItems="center" gap={2}>
      {Array.from(supportedBrowsers.entries()).map(
        ([browser, { icon, tooltip }]) => (
          <Tooltip key={browser} content={tooltip}>
            <Icon color="gray.500" opacity={0.8} as={icon} />
          </Tooltip>
        ),
      )}
      {Array.from(unsupportedBrowsers.entries()).map(
        ([browser, { icon, tooltip }]) => (
          <Tooltip key={browser} content={tooltip}>
            <Icon color="gray.500" opacity={0.1} as={icon} />
          </Tooltip>
        ),
      )}
    </Box>
  );
}
