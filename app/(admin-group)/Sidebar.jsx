// app/(admin)/Sidebar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiTruck, 
  FiPieChart, 
  FiSettings, 
  FiFileText, 
  FiLogOut,
  FiUser 
} from 'react-icons/fi';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Shared/Firebaseconfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setUserEmail(user?.email || '');
    });
    return () => unsubscribe();
  }, []);

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
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FiHome size={18} /> },
    { name: 'Staff', href: '/admin/staff', icon: <FiUsers size={18} /> },
    { name: 'Vehicles', href: '/admin/vehicles', icon: <FiTruck size={18} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FiPieChart size={18} /> },
    { name: 'Contacts', href: '/admin/contacts', icon: <FiFileText size={18} /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings size={18} /> },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-20 flex flex-col ">
      {/* User Info */}
      <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
        <div className="bg-blue-500 p-2 rounded-full">
          <FiUser size={18} />
        </div>
        <div>
          <p className="font-medium">Admin</p>
          <p className="text-xs text-gray-400 truncate">{userEmail}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <span className="mr-3"><FiLogOut size={18} /></span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}