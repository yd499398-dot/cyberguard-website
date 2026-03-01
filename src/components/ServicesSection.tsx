import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Server, Cloud, Activity, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const services = [
    {
      icon: <Server size={40} className="text-[#00f2ff]" />,
      title: "Penetration Testing",
      desc: "Rigorous simulated cyberattacks to identify and patch vulnerabilities before malicious hackers can exploit them.",
      color: "#00f2ff",
      actionText: "RUN SIMULATION",
      action: () => navigate('/simulation')
    },
    {
      icon: <Cloud size={40} className="text-[#7a00ff]" />,
      title: "Cloud Security",
      desc: "Comprehensive protection for your cloud infrastructure, ensuring data integrity and compliance across AWS, Azure, and GCP.",
      color: "#7a00ff",
      actionText: "VIEW RESOURCES",
      action: () => navigate('/resources')
    },
    {
      icon: <Activity size={40} className="text-[#00f2ff]" />,
      title: "Threat Intelligence",
      desc: "Real-time analysis of global cyber threats, providing actionable insights to fortify your defenses proactively.",
      color: "#00f2ff",
      actionText: "VIEW THREAT MAP",
      action: () => {
        document.getElementById('threat-map')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: <Eye size={40} className="text-[#7a00ff]" />,
      title: "AI-Based Monitoring",
      desc: "24/7 continuous surveillance using advanced machine learning models to detect anomalous behavior instantly.",
      color: "#7a00ff",
      actionText: "CONSULT AI",
      action: () => navigate('/ai')
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current.querySelectorAll('.service-card'),
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 relative z-10 bg-[#050508]/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a00ff] to-[#00f2ff]">Core Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Enterprise-grade security solutions tailored for modern digital ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto">
          {services.map((service, index) => (
            <div key={index} className="flip-card service-card h-80 cursor-pointer">
              <div className="flip-card-inner">
                {/* Front */}
                <div className="flip-card-front bg-[#0a0a0f] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-xl flex flex-col items-center justify-center p-6 border-t-4" style={{ borderTopColor: service.color }}>
                  <div className="mb-6 p-4 rounded-full bg-black/30 border border-white/5">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold font-mono text-center">{service.title}</h3>
                  <div className="mt-4 text-xs tracking-widest text-gray-500 uppercase">Hover to scan</div>
                </div>
                
                {/* Back */}
                <div className="flip-card-back bg-[#0a0a0f] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-xl flex flex-col items-center justify-center p-6 border-b-4" style={{ borderBottomColor: service.color }}>
                  <h3 className="text-lg font-bold font-mono mb-4 text-center" style={{ color: service.color }}>{service.title}</h3>
                  <p className="text-gray-300 text-sm text-center leading-relaxed">
                    {service.desc}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      service.action();
                    }}
                    className="mt-6 px-4 py-2 text-xs font-mono border border-white/20 rounded hover:bg-white/10 transition-colors"
                  >
                    {service.actionText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
