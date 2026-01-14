import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full">
      <Link href="/">
        <Image
          src="/v_logo.png"
          alt="Home"
          width={30}
          height={30}
          className="dark:invert-0 invert"
        />
      </Link>
      <ThemeToggle />
    </nav>
  );
}
