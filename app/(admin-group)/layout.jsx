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
        <body className="h-full">
        <Header showMenu={!isAdminDashboard} showLogout={isLoggedIn} />
          <div className="flex h-screen bg-gray-100">
            <div> {!isAdminDashboard && <Sidebar isLoggedIn={isLoggedIn} />}</div>
           
            {/* Main content area */}
            <div className={` overflow-hidden ${!isAdminDashboard ? '' : 'pl-0'}`}>
             
              
              <main className=" overflow-y-auto p-4 md:p-6">
                {children}
              </main>
              
             
            </div>
          </div>
          <footer className="bg-gray-800 py-4 px-6">
                <p className="text-sm text-white text-center">
                  © {new Date().getFullYear()} Developed by JMandM tech James Mutisya
                </p>
              </footer>
        </body>
      </html>
    </ProtectedRoute>
  );
}