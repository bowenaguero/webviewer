import { memo, useMemo } from 'react';
import { EVENT_TYPE_COLORS, ICON_SIZES } from '@/lib/constants/index';
import {
  FaEye,
  FaDownload,
  FaICursor,
  FaBookmark,
  FaSearch,
} from 'react-icons/fa';
import Image from 'next/image';

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

const EventIcon = memo(function EventIcon({ eventType, size = 'md' }) {
  const sizeInPx = ICON_SIZES[size] || ICON_SIZES.default;
  const numericSize = parseInt(sizeInPx, 10);

  const browserLogo = BROWSER_LOGOS[eventType];
  if (browserLogo) {
    return (
      <Image
        src={browserLogo.src}
        alt={browserLogo.alt}
        width={numericSize}
        height={numericSize}
      />
    );
  }

  const IconComponent = EVENT_TYPE_ICONS[eventType];
  if (!IconComponent) {
    return null;
  }

  const iconStyle = useMemo(
    () => ({
      width: sizeInPx,
      height: sizeInPx,
      color: EVENT_TYPE_COLORS[eventType],
    }),
    [sizeInPx, eventType],
  );

  return <IconComponent style={iconStyle} />;
});

export default EventIcon;
