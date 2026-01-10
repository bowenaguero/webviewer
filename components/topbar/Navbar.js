import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex gap-5 items-center">
      <Link href="/">
        <Image src="/v_logo.png" alt="BHV" width={30} height={30} />
      </Link>
      <Link
        href="/"
        className="font-medium text-sm text-gray-500 hover:opacity-80"
      >
        Home
      </Link>
      <Link
        href="/viewer"
        className="font-medium text-sm text-gray-500 hover:opacity-80"
      >
        Viewer
      </Link>
      <Link
        href="/learn-how"
        className="font-medium text-sm text-gray-500 hover:opacity-80"
      >
        Help
      </Link>
    </nav>
  );
}
