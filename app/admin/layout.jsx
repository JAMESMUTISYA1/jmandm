'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from './Sidebar';

import Header from '@/components/Headeradmin';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin control panel',
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
         
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="bg-gray-800 py-4 px-6">
          <p className="text-sm text-gray-600 text-center">
  © {new Date().getFullYear()} Developed by JMandM tech James Mutisys
</p>
</footer>

        </div>
      </div>
    </ProtectedRoute>
  );
}