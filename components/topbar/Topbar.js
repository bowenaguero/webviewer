import Navbar from '@/components/topbar/Navbar';
import Socials from '@/components/topbar/Socials';

export default function Topbar() {
  return (
    <header className="flex justify-between items-center p-5 bg-gray-900 transition-all duration-200">
      <Navbar />
      <Socials />
    </header>
  );
}
