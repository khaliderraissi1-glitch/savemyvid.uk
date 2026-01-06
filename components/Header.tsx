
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  onViewChange: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => onViewChange('home')} 
            className="flex items-center group focus:outline-none"
            aria-label="SaveMyVid.uk Home"
          >
            <span className="text-2xl font-black tracking-tighter text-white transition-colors group-hover:text-red-500">
              savemyvid<span className="text-red-600">.uk</span>
            </span>
          </button>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-400">
          <button onClick={() => onViewChange('home')} className="hover:text-white transition-colors">Downloader</button>
          <button onClick={() => onViewChange('legal')} className="hover:text-white transition-colors">Legal</button>
          <button onClick={() => onViewChange('terms')} className="hover:text-white transition-colors">Terms</button>
          <button onClick={() => onViewChange('privacy')} className="hover:text-white transition-colors">Privacy</button>
        </nav>
        <div className="flex items-center">
          <button className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95">
            Support UK
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
