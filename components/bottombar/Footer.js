import Link from 'next/link';
import { FaCoffee } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bottom-0 w-full py-4 text-center bg-surface-page">
      <div className="flex justify-center gap-4">
        <Link
          href="https://buymeacoffee.com/bowenaguero"
          target="_blank"
          className="text-fg-disabled hover:text-fg-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <FaCoffee className="size-3.5" />
            <span className="text-sm">Coffee</span>
          </div>
        </Link>
      </div>
    </footer>
  );
}
