// app/(admin)/layout.jsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../Shared/Firebaseconfig';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from './Sidebar';
import Header from '@/components/Headeradmin';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname === '/admin';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ProtectedRoute>
      <html lang="en" className="h-full">
        <body className="h-full flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {!isAdminDashboard && (
              <div className="w-64 h-full bg-white border-r border-gray-200">
                <Sidebar isLoggedIn={isLoggedIn} />
              </div>
            )}
            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                {children}
              </main>
              <footer className="bg-gray-800 py-4 px-6">
                <p className="text-sm text-white text-center">
                  © {new Date().getFullYear()} Developed by JMandM tech James Mutisya
                </p>
              </footer>
            </div>
          </div>
        </body>
      </html>
    </ProtectedRoute>
  );
}