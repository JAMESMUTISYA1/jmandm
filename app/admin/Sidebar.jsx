'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiTruck,  // Changed from FiCar to FiTruck
  FiPieChart, 
  FiSettings, 
  FiFileText 
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Vehicles', href: '/admin/vehicles', icon: <FiTruck className="w-5 h-5" /> }, // Changed to FiTruck
    { name: 'Users', href: '/admin/users', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Reports', href: '/admin/reports', icon: <FiFileText className="w-5 h-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:justify-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button 
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}