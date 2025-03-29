"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  const menuItems = [
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'Spare Parts', href: '/spareparts' },
    { name: 'Garage', href: '/garage' },
    { name: 'About Us', href: '/aboutus' },
    { name: 'Contact Us', href: '/contactus' },
  ];

  return (
    <header className="bg-indigo-100 shadow-lg shadow-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center">
              <img
                src="/Logo.png" // Replace with your logo path
                alt="Logo"
                className="h-20 w-20"
              />
              <span className="ml-2 text-xl text-black font-semibold">JM and M</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                  pathname === item.href ? 'border-b-2 font-bold border-red-500' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                  pathname === item.href ? 'border-b-2 font-bold border-red-500' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;