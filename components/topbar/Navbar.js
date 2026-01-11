import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">
        <Image src="/v_logo.png" alt="Home" width={30} height={30} />
      </Link>
    </nav>
  );
}
