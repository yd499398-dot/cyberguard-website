import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState('SCANNING');
  
  // Dynamic metrics state
  const [cpuLoad, setCpuLoad] = useState(34);
  const [memory, setMemory] = useState(68);
  const [network, setNetwork] = useState(1.2);

  const fullText = `> Initializing CyberGuard Protocol v4.2.1...
> Connecting to global threat intelligence network... [OK]
> Scanning local network topology... [OK]
> Analyzing incoming traffic patterns...
> WARNING: Anomalous packet sequence detected on port 443.
> Source IP: 185.23.xxx.xx (Known malicious actor)
> Attempting SQL injection payload delivery...
> Deploying countermeasures...
> Isolating threat... [SUCCESS]
> Connection terminated. IP blacklisted.
> System secure. Resuming normal operations.`;

  useEffect(() => {
    // Live metrics simulation
    const metricsInterval = setInterval(() => {
      setCpuLoad(prev => {
        const change = (Math.random() * 10) - 5;
        const newVal = prev + change;
        return Math.min(Math.max(newVal, 10), 95); // Keep between 10 and 95
      });
      
      setMemory(prev => {
        const change = (Math.random() * 4) - 2;
        const newVal = prev + change;
        return Math.min(Math.max(newVal, 40), 90); // Keep between 40 and 90
      });
      
      setNetwork(prev => {
        const change = (Math.random() * 0.4) - 0.2;
        const newVal = prev + change;
        return Math.min(Math.max(newVal, 0.1), 5.0); // Keep between 0.1 and 5.0
      });
    }, 1500);

    return () => clearInterval(metricsInterval);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !terminalRef.current) return;

    let i = 0;
    let typingInterval: NodeJS.Timeout;
    let isMounted = true;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (!isMounted) return;
        
        // Update DOM directly to avoid React re-render lag
        const textElement = document.getElementById('dashboard-typed-text');
        if (textElement) {
          textElement.textContent = fullText.substring(0, i);
        }
        
        i += 2; // Type faster, fewer updates
        if (i > fullText.length) {
          clearInterval(typingInterval);
          setStatus('SECURE');
          setTimeout(() => {
            if (!isMounted) return;
            i = 0;
            setStatus('SCANNING');
            startTyping();
          }, 5000); // Restart after 5s
        } else if (i > 150 && i < 250) {
          setStatus('THREAT DETECTED');
        } else if (i >= 250 && i < 350) {
          setStatus('MITIGATING');
        }
      }, 40); // Slower interval, bigger chunks
    };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        if (i === 0) startTyping();
      },
      once: true
    });

    gsap.fromTo(sectionRef.current.querySelector('.dashboard-ui'),
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    return () => {
      isMounted = false;
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <section id="dashboard" ref={sectionRef} className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a00ff] to-[#00f2ff]">Live Security Dashboard</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Experience our advanced automated threat mitigation system in action with live telemetry.
          </p>
        </div>

        <div className="dashboard-ui max-w-4xl mx-auto glass-card rounded-xl overflow-hidden border-[#00f2ff]/20 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
          {/* Dashboard Header */}
          <div className="bg-black/50 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 font-mono text-sm">
              <Terminal size={18} />
              <span>root@cyberguard:~</span>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Terminal Window */}
            <div className="flex-1 bg-black/80 rounded border border-white/5 p-4 font-mono text-sm md:text-base h-80 overflow-y-auto" ref={terminalRef}>
              <pre className="text-[#00f2ff] whitespace-pre-wrap leading-relaxed">
                <span id="dashboard-typed-text"></span>
                <span className="animate-pulse">_</span>
              </pre>
            </div>

            {/* Status Panel */}
            <div className="w-full md:w-64 flex flex-col gap-4">
              <div className={`p-4 rounded border flex flex-col items-center justify-center text-center transition-colors duration-300 ${
                status === 'SECURE' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                status === 'THREAT DETECTED' ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' :
                status === 'MITIGATING' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' :
                'bg-[#00f2ff]/10 border-[#00f2ff]/50 text-[#00f2ff]'
              }`}>
                {status === 'SECURE' ? <ShieldCheck size={40} className="mb-2" /> :
                 status === 'THREAT DETECTED' ? <AlertTriangle size={40} className="mb-2" /> :
                 <Activity size={40} className="mb-2 animate-spin" />}
                <span className="font-mono font-bold tracking-widest text-sm">{status}</span>
              </div>

              <div className="flex-1 glass-card rounded border-[#7a00ff]/20 p-4">
                 <h4 className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest border-b border-white/10 pb-2 flex justify-between">
                   <span>System Metrics</span>
                   <span className="text-[#00f2ff] animate-pulse">LIVE</span>
                 </h4>
                 <div className="space-y-3 mt-3">
                   <div>
                     <div className="flex justify-between text-xs font-mono mb-1">
                       <span>CPU Load</span>
                       <span className="text-[#00f2ff] transition-all duration-300">{cpuLoad.toFixed(1)}%</span>
                     </div>
                     <div className="w-full bg-black/50 h-1.5 rounded overflow-hidden">
                       <div className="bg-[#00f2ff] h-full transition-all duration-500 ease-out" style={{ width: `${cpuLoad}%` }}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs font-mono mb-1">
                       <span>Memory</span>
                       <span className="text-[#7a00ff] transition-all duration-300">{memory.toFixed(1)}%</span>
                     </div>
                     <div className="w-full bg-black/50 h-1.5 rounded overflow-hidden">
                       <div className="bg-[#7a00ff] h-full transition-all duration-500 ease-out" style={{ width: `${memory}%` }}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs font-mono mb-1">
                       <span>Network</span>
                       <span className="text-green-400 transition-all duration-300">{network.toFixed(2)} Gbps</span>
                     </div>
                     <div className="w-full bg-black/50 h-1.5 rounded overflow-hidden">
                       <div className="bg-green-400 h-full transition-all duration-500 ease-out" style={{ width: `${(network / 5) * 100}%` }}></div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


