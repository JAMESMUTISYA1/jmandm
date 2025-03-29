// components/Headeradmin.jsx
'use client';

import { getAuth, signOut } from 'firebase/auth';
import { app } from '../Shared/Firebaseconfig';
import { useRouter } from 'next/navigation';

export default function Header({ showMenu = true, showLogout = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-indigo-600 shadow-sm">
      <div className="flex items-center justify-between p-4">
        {showMenu && (
          <button className="lg:hidden">
            {/* Your menu icon */}
          </button>
        )}
        <div className="flex-1"></div>
        {showLogout && (
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}