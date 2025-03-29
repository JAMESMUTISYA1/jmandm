// app/(admin)/layout.jsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';
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
        <body className="h-full">
          <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Hidden on /admin route */}
            {!isAdminDashboard && <Sidebar isLoggedIn={isLoggedIn} />}

            {/* Main content area */}
            <div className={`flex-1 flex flex-col overflow-hidden ${!isAdminDashboard ? '' : 'pl-0'}`}>
              <Header showMenu={!isAdminDashboard} showLogout={isLoggedIn} />
              
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
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