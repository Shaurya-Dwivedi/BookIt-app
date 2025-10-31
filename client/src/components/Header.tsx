// client/src/components/Header.tsx
import React from 'react';
import { imageUrl } from '../assets/imageUrl';
const Header = () => {
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={imageUrl} alt="Highway Delite Logo" className="h-16.5 w-25 object-contain"  />
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Search experiences"
            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary text-gray-900 font-semibold px-6 py-2 rounded-r-md hover:bg-yellow-400 transition-colors">
            Search
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;