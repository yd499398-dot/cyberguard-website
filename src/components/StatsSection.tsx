import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Live ticking state for threats blocked
  const [threatsBlocked, setThreatsBlocked] = useState(14589230);

  useEffect(() => {
    // Live ticking simulation for threats
    const tickInterval = setInterval(() => {
      setThreatsBlocked(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 2000);

    return () => clearInterval(tickInterval);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    countersRef.current.forEach((counter, index) => {
      if (!counter || index === 0) return; // Skip the first one as it's handled by React state now
      
      const targetStr = counter.getAttribute('data-target') || '0';
      const isFloat = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const suffix = counter.getAttribute('data-suffix') || '';
      
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        onUpdate: function() {
          counter.innerHTML = (isFloat ? obj.val.toFixed(2) : Math.round(obj.val)) + suffix;
        }
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative z-10 bg-[#00f2ff]/5 border-y border-[#00f2ff]/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          
          <div className="p-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-[#00f2ff] mb-2 flex justify-center items-center">
              <span>{threatsBlocked.toLocaleString()}</span>
            </div>
            <p className="text-gray-400 tracking-widest uppercase text-sm font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse"></span>
              Live Threats Blocked
            </p>
          </div>

          <div className="p-6 border-y md:border-y-0 md:border-x border-white/10">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white mb-2 flex justify-center items-center">
              <span ref={el => { countersRef.current[1] = el; }} data-target="99.99" data-suffix="%">0</span>
            </div>
            <p className="text-gray-400 tracking-widest uppercase text-sm font-bold">System Uptime</p>
          </div>

          <div className="p-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-[#7a00ff] mb-2 flex justify-center items-center">
              <span ref={el => { countersRef.current[2] = el; }} data-target="24" data-suffix="/7">0</span>
            </div>
            <p className="text-gray-400 tracking-widest uppercase text-sm font-bold">Active Monitoring</p>
          </div>

        </div>
      </div>
    </section>
  );
}
