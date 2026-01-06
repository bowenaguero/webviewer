import { EVENT_TYPE_COLORS, ICON_SIZES } from '../utils/constants';
import { Icon, Image } from '@chakra-ui/react';
import {
  FaEye,
  FaDownload,
  FaICursor,
  FaBookmark,
  FaSearch,
} from 'react-icons/fa';

const EVENT_TYPE_ICONS = {
  Visit: FaEye,
  Download: FaDownload,
  Autofill: FaICursor,
  Bookmark: FaBookmark,
  Keyword: FaSearch,
};

const BROWSER_LOGOS = {
  chrome: { src: '/images/chrome-logo.svg', alt: 'Chrome' },
  firefox: { src: '/images/firefox-logo.svg', alt: 'Firefox' },
};

export default function EventIcon({ eventType, size = 'md' }) {
  const sizeInPx = ICON_SIZES[size] || ICON_SIZES.default;

  const browserLogo = BROWSER_LOGOS[eventType];
  if (browserLogo) {
    return (
      <Image
        src={browserLogo.src}
        alt={browserLogo.alt}
        w={sizeInPx}
        h={sizeInPx}
      />
    );
  }

  const IconComponent = EVENT_TYPE_ICONS[eventType];
  if (!IconComponent) {
    return null;
  }

  return (
    <Icon size={size} as={IconComponent} color={EVENT_TYPE_COLORS[eventType]} />
  );
}
