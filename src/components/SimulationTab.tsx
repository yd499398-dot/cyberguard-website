import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, Database, ServerCrash, CheckCircle2 } from 'lucide-react';

export default function SimulationTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'recon' | 'exploit' | 'post' | 'complete'>('idle');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const simulationSteps = [
    { text: "Initializing Penetration Testing Protocol...", delay: 500, phase: 'recon' },
    { text: "Target acquired: 192.168.1.104 (Production Server)", delay: 1000, phase: 'recon' },
    { text: "Running Nmap stealth scan (-sS)...", delay: 1500, phase: 'recon' },
    { text: "Discovered open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL)", delay: 2000, phase: 'recon' },
    { text: "Analyzing service banners...", delay: 2500, phase: 'recon' },
    { text: "Vulnerability detected: Outdated Apache Struts (CVE-2017-5638)", delay: 3500, phase: 'exploit' },
    { text: "Preparing payload delivery mechanism...", delay: 4000, phase: 'exploit' },
    { text: "Bypassing Web Application Firewall (WAF)...", delay: 5000, phase: 'exploit' },
    { text: "WAF bypassed successfully using chunked encoding.", delay: 5500, phase: 'exploit' },
    { text: "Executing remote code execution (RCE) payload...", delay: 6500, phase: 'exploit' },
    { text: "Reverse shell connection established on port 4444.", delay: 7000, phase: 'post' },
    { text: "Attempting privilege escalation...", delay: 8000, phase: 'post' },
    { text: "Kernel exploit successful. Root access granted.", delay: 9000, phase: 'post' },
    { text: "Extracting shadow file hashes...", delay: 9500, phase: 'post' },
    { text: "Simulation Complete. Generating vulnerability report...", delay: 10500, phase: 'complete' },
  ];

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setProgress(0);
    setPhase('recon');

    let currentStep = 0;

    const executeNextStep = () => {
      if (currentStep >= simulationSteps.length) {
        setIsRunning(false);
        setPhase('complete');
        setProgress(100);
        return;
      }

      const step = simulationSteps[currentStep];
      
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);
        setPhase(step.phase as any);
        setProgress(Math.floor(((currentStep + 1) / simulationSteps.length) * 100));
        currentStep++;
        executeNextStep();
      }, step.delay - (currentStep > 0 ? simulationSteps[currentStep - 1].delay : 0));
    };

    executeNextStep();
  };

  return (
    <section className="py-24 relative z-10 min-h-screen flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
            <Terminal className="text-[#00f2ff]" size={40} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">
              Attack Simulation
            </span>
          </h2>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            Authorized Penetration Testing Environment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Control Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-card rounded-xl p-6 border-[#00f2ff]/30 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
              <h3 className="text-xl font-bold font-mono text-[#00f2ff] mb-4 border-b border-[#00f2ff]/20 pb-2">
                TARGET PARAMETERS
              </h3>
              <div className="space-y-4 font-mono text-sm text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="text-white">192.168.1.104</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OS:</span>
                  <span className="text-white">Linux (Ubuntu 20.04)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vector:</span>
                  <span className="text-white">Web Application</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Intensity:</span>
                  <span className="text-red-400">Aggressive</span>
                </div>
              </div>

              <button 
                onClick={runSimulation}
                disabled={isRunning}
                className={`w-full mt-8 py-3 rounded font-mono tracking-widest transition-all ${
                  isRunning 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] glow-border'
                }`}
              >
                {isRunning ? 'SIMULATION IN PROGRESS' : 'LAUNCH ATTACK'}
              </button>
            </div>

            {/* Status Indicators */}
            <div className="glass-card rounded-xl p-6 border-[#7a00ff]/30">
              <h3 className="text-xl font-bold font-mono text-[#7a00ff] mb-4 border-b border-[#7a00ff]/20 pb-2">
                ATTACK PHASES
              </h3>
              <div className="space-y-4 font-mono text-sm">
                <div className={`flex items-center gap-3 ${phase === 'recon' || phase === 'exploit' || phase === 'post' || phase === 'complete' ? 'text-[#00f2ff]' : 'text-gray-600'}`}>
                  <Cpu size={18} />
                  <span>1. Reconnaissance</span>
                  {(phase === 'exploit' || phase === 'post' || phase === 'complete') && <CheckCircle2 size={16} className="ml-auto text-green-400" />}
                </div>
                <div className={`flex items-center gap-3 ${phase === 'exploit' || phase === 'post' || phase === 'complete' ? 'text-[#7a00ff]' : 'text-gray-600'}`}>
                  <ShieldAlert size={18} />
                  <span>2. Exploitation</span>
                  {(phase === 'post' || phase === 'complete') && <CheckCircle2 size={16} className="ml-auto text-green-400" />}
                </div>
                <div className={`flex items-center gap-3 ${phase === 'post' || phase === 'complete' ? 'text-red-400' : 'text-gray-600'}`}>
                  <ServerCrash size={18} />
                  <span>3. Post-Exploitation</span>
                  {phase === 'complete' && <CheckCircle2 size={16} className="ml-auto text-green-400" />}
                </div>
                <div className={`flex items-center gap-3 ${phase === 'complete' ? 'text-green-400' : 'text-gray-600'}`}>
                  <Database size={18} />
                  <span>4. Report Generation</span>
                  {phase === 'complete' && <CheckCircle2 size={16} className="ml-auto text-green-400" />}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl border-[#00f2ff]/30 h-[600px] flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,242,255,0.1)]">
              
              {/* Terminal Header */}
              <div className="bg-black/80 border-b border-white/10 p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 font-mono text-xs text-gray-400">root@kali:~# msfconsole</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-900 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7a00ff] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 bg-[#050508] p-6 overflow-y-auto font-mono text-sm md:text-base">
                {logs.length === 0 && !isRunning && phase === 'idle' && (
                  <div className="text-gray-600 flex flex-col items-center justify-center h-full opacity-50">
                    <Terminal size={64} className="mb-4" />
                    <p>SYSTEM READY.</p>
                    <p>AWAITING COMMAND TO INITIATE SIMULATION.</p>
                  </div>
                )}
                
                {logs.map((log, index) => {
                  let colorClass = "text-green-400";
                  if (log.includes("Vulnerability detected") || log.includes("Reverse shell") || log.includes("Root access")) {
                    colorClass = "text-red-400 font-bold";
                  } else if (log.includes("Bypassing") || log.includes("Attempting")) {
                    colorClass = "text-yellow-400";
                  } else if (log.includes("Simulation Complete")) {
                    colorClass = "text-[#00f2ff] font-bold";
                  }

                  return (
                    <div key={index} className={`mb-2 ${colorClass} animate-in fade-in slide-in-from-bottom-2`}>
                      <span className="text-gray-500 mr-2">&gt;</span>
                      {log}
                    </div>
                  );
                })}
                
                {isRunning && (
                  <div className="text-gray-500 animate-pulse mt-4">
                    <span className="mr-2">&gt;</span>_
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
