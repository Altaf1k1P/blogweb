import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2 group cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
        <i className="fas fa-bolt text-white text-lg"></i>
      </div>
      <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-gray-200 to-indigo-400 bg-clip-text text-transparent uppercase">
        Blog<span className="text-indigo-500">web</span>
      </span>
    </div>
  );
}
