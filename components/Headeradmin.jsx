'use client';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function Header({ onMenuClick }) {
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}