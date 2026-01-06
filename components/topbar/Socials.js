import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaGithub, FaCoffee } from 'react-icons/fa';

export default function Socials() {
  return (
    <div className="flex gap-1 items-center">
      <Link href="https://github.com/bowenaguero/webviewer" target="_blank">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-gray-500 hover:opacity-80"
        >
          <FaGithub className="size-4" />
        </Button>
      </Link>
      <Link href="https://buymeacoffee.com/bowenaguero" target="_blank">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-gray-500 hover:opacity-80"
        >
          <FaCoffee className="size-4" />
        </Button>
      </Link>
    </div>
  );
}
