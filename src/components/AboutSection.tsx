import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Lock, Fingerprint } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    gsap.fromTo(sectionRef.current.querySelector('.about-title'),
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(cardsRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 about-title">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">About Cyber Defense</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We build impenetrable digital fortresses using advanced AI and machine learning algorithms to predict and neutralize threats before they happen.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-xl hover:border-[#00f2ff] transition-all duration-300 group">
            <ShieldAlert size={48} className="text-[#00f2ff] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 font-mono">Proactive Defense</h3>
            <p className="text-gray-400">Our systems don't just react to threats; they anticipate them using predictive modeling and global threat intelligence.</p>
          </div>
          
          <div className="glass-card p-8 rounded-xl hover:border-[#7a00ff] transition-all duration-300 group">
            <Lock size={48} className="text-[#7a00ff] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 font-mono">Zero Trust Architecture</h3>
            <p className="text-gray-400">Never trust, always verify. We implement strict access controls and continuous authentication across your entire network.</p>
          </div>

          <div className="glass-card p-8 rounded-xl hover:border-[#00f2ff] transition-all duration-300 group">
            <Fingerprint size={48} className="text-[#00f2ff] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 font-mono">Identity Protection</h3>
            <p className="text-gray-400">Safeguard user identities with advanced biometric integration and behavioral analytics to detect anomalies instantly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
