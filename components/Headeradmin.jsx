// components/Headeradmin.jsx
'use client';

export default function Header({ showMenu = true, showLogout = false }) {
 
  return (
    <header className="bg-indigo-600 w-full h-17   shadow-sm fixed">
      <div className="flex items-center justify-between py-5">

      <div className="g-6" > 
        <p>ADMIN</p></div>
       
         <div className="flex items-center">
           
              <img
                src="/Logo.png" // Replace with your logo path
                alt="Logo"
                className="h-15 w-15 "
              />
              <span className="ml-2 text-xl text-black font-semibold">JM and M</span>
        
          </div>

      </div>
    </header>
  );
}