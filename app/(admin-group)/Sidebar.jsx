// app/(admin)/Sidebar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiTruck, FiPieChart, FiSettings, FiFileText, FiLogOut } from 'react-icons/fi';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Shared/Firebaseconfig';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isLoggedIn }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome /> },
    { name: 'Vehicles', href: '/admin/vehicles', icon: <FiTruck /> },
    // ... other nav items
  ];

  return (
    <div className="  w-64   text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Welcome Admin </h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full"
              >
                <span className="mr-3"><FiLogOut /></span>
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}