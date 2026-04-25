import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const activeTab = location.pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#00f2ff]/20 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link 
          to="/"
          className="flex items-center space-x-2 text-[#00f2ff] cursor-pointer"
        >
          <Shield size={32} className="animate-pulse" />
          <span className="text-2xl font-bold tracking-wider font-mono">CYBER<span className="text-[#7a00ff]">GUARD</span></span>
        </Link>
        
        <div className="hidden md:flex space-x-8 font-mono text-sm tracking-widest">
          <Link 
            to="/" 
            className={`hover:text-[#00f2ff] transition-colors ${activeTab === '/' ? 'text-[#00f2ff] border-b-2 border-[#00f2ff] pb-1' : 'text-gray-300'}`}
          >HOME</Link>
          <Link 
            to="/scanner" 
            className={`hover:text-[#00f2ff] transition-colors ${activeTab === '/scanner' ? 'text-[#00f2ff] border-b-2 border-[#00f2ff] pb-1' : 'text-gray-300'}`}
          >SCANNER</Link>
          <Link 
            to="/ai" 
            className={`hover:text-[#00f2ff] transition-colors ${activeTab === '/ai' ? 'text-[#00f2ff] border-b-2 border-[#00f2ff] pb-1' : 'text-gray-300'}`}
          >AI AGENT</Link>
          <Link 
            to="/resources" 
            className={`hover:text-[#00f2ff] transition-colors ${activeTab === '/resources' ? 'text-[#00f2ff] border-b-2 border-[#00f2ff] pb-1' : 'text-gray-300'}`}
          >RESOURCES</Link>
        </div>
      </div>
    </nav>
  );
}
