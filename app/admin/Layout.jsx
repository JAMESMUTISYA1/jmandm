//import './admin.css';
import Header from './Header';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin control panel',
};

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute> {/* Protect the entire admin section */}
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}