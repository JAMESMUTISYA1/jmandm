//import Sidebar from './Sidebar';
import Header from '@/components/Headeradmin';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar  <Sidebar /> - Always visible on desktop */}
       

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
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
    </ProtectedRoute>
  );
}