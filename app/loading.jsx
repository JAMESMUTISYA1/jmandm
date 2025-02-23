import React from 'react'

const loading = () => {
  return (
    <div className = "fixed inse-0 flex items-center justify-center bg-white bg-opacity-80 z-50 " >
       <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin "  ></div>


    </div>
  )
}

export default loading