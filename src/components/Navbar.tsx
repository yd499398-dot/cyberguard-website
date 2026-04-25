import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();
  const activeTab = location.pathname;

  const checkAuth = () => {
    const token = localStorage.getItem('cyberguard_token');
    const userStr = localStorage.getItem('cyberguard_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.firstName || 'Operator');
      } catch (e) {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check auth on mount
    checkAuth();
    
    // Listen for custom auth change event
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkAuth);
    };
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

        <Link 
          to="/login"
          className={`glow-border px-6 py-2 rounded font-mono text-sm tracking-widest transition-all flex items-center gap-2 ${activeTab === '/login' ? 'bg-[#00f2ff]/30 text-[#00f2ff] border-[#00f2ff]' : 'bg-[#7a00ff]/20 text-white hover:bg-[#7a00ff]/40'}`}
        >
          {userName ? (
            <>
              <div className="w-5 h-5 rounded-full bg-[#00f2ff] text-black flex items-center justify-center font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[#00f2ff] font-bold">{userName.toUpperCase()}</span>
            </>
          ) : (
            'LOGIN'
          )}
        </Link>
      </div>
    </nav>
  );
}
