'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const navItems = [
    { name: 'Chat', path: '/chatlist' },
    { name: 'Main', path: '/main' },
    { name: 'Setting', path: '/setting' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-md border-t border-gray-200 flex justify-around items-center py-3 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`text-sm font-medium ${
            pathname === item.path
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;

