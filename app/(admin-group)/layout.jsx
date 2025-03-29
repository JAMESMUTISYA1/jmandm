// app/(admin)/layout.jsx
'use client'; // Needed for ProtectedRoute and any interactive elements
import ProtectedRoute from '@/components/ProtectedRoute';

// This layout will completely override the root layout
export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <html lang="en" className="h-full">
        <body className="h-full">
          <div className="flex h-screen bg-gray-100">
            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
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