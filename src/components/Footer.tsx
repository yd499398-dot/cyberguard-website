import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#0a0a0f] border-t border-white/10 pt-16 pb-8 overflow-hidden">
      {/* Animated background grid for footer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#7a00ff 1px, transparent 1px), linear-gradient(90deg, #7a00ff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'top'
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-[#00f2ff] mb-6">
              <Shield size={32} />
              <span className="text-2xl font-bold tracking-wider font-mono">CYBER<span className="text-[#7a00ff]">GUARD</span></span>
            </div>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
              Next-generation cybersecurity solutions protecting the world's most critical infrastructure from advanced persistent threats.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00f2ff] hover:bg-white/10 transition-all border border-white/10 hover:border-[#00f2ff]/50">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#7a00ff] hover:bg-white/10 transition-all border border-white/10 hover:border-[#7a00ff]/50">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00f2ff] hover:bg-white/10 transition-all border border-white/10 hover:border-[#00f2ff]/50">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#7a00ff] hover:bg-white/10 transition-all border border-white/10 hover:border-[#7a00ff]/50">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold mb-6 tracking-widest uppercase text-sm">Solutions</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f2ff] transition-colors">Enterprise Security</a></li>
              <li><a href="#" className="hover:text-[#00f2ff] transition-colors">Cloud Protection</a></li>
              <li><a href="#" className="hover:text-[#00f2ff] transition-colors">Threat Intelligence</a></li>
              <li><a href="#" className="hover:text-[#00f2ff] transition-colors">Incident Response</a></li>
              <li><a href="#" className="hover:text-[#00f2ff] transition-colors">Compliance & Audit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold mb-6 tracking-widest uppercase text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#7a00ff] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#7a00ff] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#7a00ff] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#7a00ff] transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-[#7a00ff] transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
          <p>&copy; {new Date().getFullYear()} CyberGuard Systems Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
