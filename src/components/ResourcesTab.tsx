import React from 'react';
import { ExternalLink, Shield, BookOpen, Globe, Lock, Server } from 'lucide-react';

export default function ResourcesTab() {
  const resources = [
    { 
      title: 'CERT-In', 
      desc: 'Indian Computer Emergency Response Team. The national nodal agency for responding to computer security incidents.', 
      url: 'https://www.cert-in.org.in/', 
      icon: <Shield size={32} className="text-[#00f2ff]" /> 
    },
    { 
      title: 'NCIIPC', 
      desc: 'National Critical Information Infrastructure Protection Centre. Protects India\'s critical information infrastructure.', 
      url: 'https://nciipc.gov.in/', 
      icon: <Server size={32} className="text-[#7a00ff]" /> 
    },
    { 
      title: 'Cyber Swachhta Kendra', 
      desc: 'Botnet Cleaning and Malware Analysis Centre. Provides free tools to secure devices from botnet infections.', 
      url: 'https://www.csk.gov.in/', 
      icon: <Globe size={32} className="text-[#00f2ff]" /> 
    },
    { 
      title: 'National Cyber Crime Portal', 
      desc: 'Initiative of Government of India to facilitate victims/complainants to report cybercrime complaints online.', 
      url: 'https://cybercrime.gov.in/', 
      icon: <Lock size={32} className="text-[#7a00ff]" /> 
    },
    { 
      title: 'DSCI', 
      desc: 'Data Security Council of India. A not-for-profit, industry body on data protection in India, setup by NASSCOM.', 
      url: 'https://www.dsci.in/', 
      icon: <BookOpen size={32} className="text-[#00f2ff]" /> 
    },
    { 
      title: 'MeitY Cyber Security', 
      desc: 'Ministry of Electronics and Information Technology. Policy, framework, and guidelines for cybersecurity in India.', 
      url: 'https://www.meity.gov.in/cyber-security', 
      icon: <Shield size={32} className="text-[#7a00ff]" /> 
    }
  ];

  return (
    <section className="py-12 relative z-10 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a00ff] to-[#00f2ff]">Official Resources</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Access global standards, frameworks, and official government cybersecurity portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res, idx) => (
            <a 
              key={idx} 
              href={res.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-xl border border-white/10 hover:border-[#00f2ff]/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,242,255,0.15)] flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-lg bg-black/40 border border-white/5 group-hover:scale-110 transition-transform">
                  {res.icon}
                </div>
                <ExternalLink size={20} className="text-gray-500 group-hover:text-[#00f2ff] transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-mono mb-3 text-white group-hover:text-[#00f2ff] transition-colors">{res.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{res.desc}</p>
              
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-gray-500 group-hover:text-[#7a00ff] transition-colors uppercase tracking-widest">
                <span>Access Portal</span>
                <span className="ml-2">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
