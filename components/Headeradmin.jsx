// components/Headeradmin.jsx
'use client';

export default function Header({ showMenu = true, showLogout = false }) {
 
  return (
    <header className="bg-indigo-600  h-40 shadow-sm">
      <div className="flex items-center justify-between p-4">

      <div className="g-6" > {showMenu && (
          <button className="lg:hidden">
            {/* Your menu icon */}
          </button>
        )}
        <p>ADMIN</p></div>
       
         <div className="flex items-center">
           
              <img
                src="/Logo.png" // Replace with your logo path
                alt="Logo"
                className="h-20 w-20"
              />
              <span className="ml-2 text-xl text-black font-semibold">JM and M</span>
        
          </div>

      </div>
    </header>
  );
}