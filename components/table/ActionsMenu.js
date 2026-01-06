import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuTriggerItem,
} from '../ui/menu';
import { toaster } from '../ui/toaster';
import { EXTERNAL_URLS } from '../utils/constants';
import { Icon, IconButton } from '@chakra-ui/react';
import { FaEllipsisV, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

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
    toaster.create({
      title: 'Copied to clipboard',
      description: config.description,
      type: 'success',
    });
  };

  const handleSendTo = (provider) => {
    const config = SEND_TO_PROVIDERS[provider];
    if (!config) return;

    const urlParam = provider === 'browserling' ? event.url : event.domain;
    window.open(config.getUrl(urlParam), '_blank');
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" size="sm" color="gray.400">
          <Icon as={FaEllipsisV} />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuRoot positioning={{ placement: 'right-start', gutter: 2 }}>
          <MenuTriggerItem value="copy">Copy</MenuTriggerItem>
          <MenuContent>
            {Object.keys(COPY_TYPES).map((type) => (
              <MenuItem key={type} value={type} onClick={() => handleCopy(type)}>
                <Icon as={FaCopy} />{' '}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>
        <MenuRoot positioning={{ placement: 'right-start', gutter: 2 }}>
          <MenuTriggerItem value="send-to">Send to</MenuTriggerItem>
          <MenuContent>
            {Object.entries(SEND_TO_PROVIDERS).map(([key, config]) => (
              <MenuItem key={key} value={key} onClick={() => handleSendTo(key)}>
                <Icon as={FaExternalLinkAlt} /> {config.label}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>
      </MenuContent>
    </MenuRoot>
  );
}
