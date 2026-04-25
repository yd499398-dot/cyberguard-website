import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Server, Database, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState<{name: string, desc: string} | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // KEY FIX: set pointer-events:none directly on the canvas element.
    // CSS pointer-events:none on a parent div does NOT cascade to HTML children
    // (only SVG inherits it). OrbitControls also adds wheel listeners that
    // hijack scroll — so we removed OrbitControls entirely and do rotation manually.
    renderer.domElement.style.pointerEvents = 'none';

    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 10;
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.02, color: '#00f2ff', transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Network Lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7a00ff, transparent: true, opacity: 0.1 });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) linePositions[i] = (Math.random() - 0.5) * 8;
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Drifting Particles
    const driftCount = 400;
    const driftGeometry = new THREE.BufferGeometry();
    const driftPos = new Float32Array(driftCount * 3);
    const driftVel: {x: number, y: number, z: number}[] = [];
    for (let i = 0; i < driftCount * 3; i += 3) {
      driftPos[i]   = (Math.random() - 0.5) * 15;
      driftPos[i+1] = (Math.random() - 0.5) * 15;
      driftPos[i+2] = (Math.random() - 0.5) * 15;
      driftVel.push({ x: (Math.random()-0.5)*0.005, y: (Math.random()-0.5)*0.005, z: (Math.random()-0.5)*0.005 });
    }
    driftGeometry.setAttribute('position', new THREE.BufferAttribute(driftPos, 3));
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = 16;
    const ctx = cvs.getContext('2d')!;
    const grad = ctx.createRadialGradient(8,8,0,8,8,8);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,16,16);
    const particleTexture = new THREE.CanvasTexture(cvs);
    const driftMat = new THREE.PointsMaterial({ size: 0.08, color: '#7a00ff', transparent: true, opacity: 0.4, map: particleTexture, blending: THREE.AdditiveBlending, depthWrite: false });
    const driftMesh = new THREE.Points(driftGeometry, driftMat);
    scene.add(driftMesh);

    // Nodes
    const nodeGeo = new THREE.IcosahedronGeometry(0.2, 1);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true });
    const nodesData = [
      { position: new THREE.Vector3(-2.5,  1.5,  1  ), name: 'Core Server',       desc: 'Mainframe processing unit with quantum encryption.' },
      { position: new THREE.Vector3( 2.5, -1,    0.5), name: 'Secure Database',    desc: 'Encrypted data vault storing sensitive user credentials.' },
      { position: new THREE.Vector3( 0,    2.5, -1.5), name: 'Perimeter Firewall', desc: 'Advanced AI-driven firewall blocking unauthorized access.' },
      { position: new THREE.Vector3(-1,   -2,    2  ), name: 'Auth Gateway',       desc: 'Zero-trust authentication and identity verification.' },
    ];
    const nodeBaseY = nodesData.map(n => n.position.y);
    const nodeMeshes: THREE.Mesh[] = [];
    nodesData.forEach(node => {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(node.position);
      mesh.userData = { name: node.name, desc: node.desc };
      scene.add(mesh);
      nodeMeshes.push(mesh);
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x7a00ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
      );
      mesh.add(glowMesh);
    });

    camera.position.set(0, 0, 6);

    // Camera auto-orbit state
    let cameraAngle = 0;
    let isZoomedToNode = false;

    // Raycaster for node clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest?.('.ui-layer')) return;
      mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length > 0) {
        const obj = hits[0].object;
        isZoomedToNode = true;
        gsap.to(camera.position, { x: obj.position.x+0.5, y: obj.position.y+0.5, z: obj.position.z+1.5, duration: 1.5, ease: 'power3.inOut' });
        setActiveNode({ name: obj.userData.name, desc: obj.userData.desc });
      } else {
        isZoomedToNode = false;
        gsap.to(camera.position, {
          x: Math.sin(cameraAngle)*6, y: Math.sin(cameraAngle*0.3)*1.5, z: Math.cos(cameraAngle)*6,
          duration: 1.5, ease: 'power3.inOut',
          onComplete: () => { isZoomedToNode = false; }
        });
        setActiveNode(null);
      }
    };
    window.addEventListener('click', onMouseClick);

    // Animation loop
    let rafId: number;
    const clock = new THREE.Clock();
    const ORBIT_SPEED = 0.008;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth auto-orbit — no OrbitControls needed
      if (!isZoomedToNode) {
        cameraAngle += ORBIT_SPEED;
        camera.position.x = Math.sin(cameraAngle) * 6;
        camera.position.z = Math.cos(cameraAngle) * 6;
        camera.position.y = Math.sin(cameraAngle * 0.15) * 0.8;
        camera.lookAt(0, 0, 0);
      }

      particlesMesh.rotation.y =  t * 0.05;
      linesMesh.rotation.y     = -t * 0.05;

      const dp = driftGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < driftCount; i++) {
        const i3 = i * 3;
        dp[i3]   += driftVel[i].x;
        dp[i3+1] += driftVel[i].y;
        dp[i3+2] += driftVel[i].z;
        if (dp[i3]   >  7.5) dp[i3]   = -7.5; if (dp[i3]   < -7.5) dp[i3]   = 7.5;
        if (dp[i3+1] >  7.5) dp[i3+1] = -7.5; if (dp[i3+1] < -7.5) dp[i3+1] = 7.5;
        if (dp[i3+2] >  7.5) dp[i3+2] = -7.5; if (dp[i3+2] < -7.5) dp[i3+2] = 7.5;
      }
      driftGeometry.attributes.position.needsUpdate = true;
      driftMesh.rotation.y = t * 0.02;

      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y = nodeBaseY[idx] + Math.sin(t * 2 + idx) * 0.15;
      });

      renderer.render(scene, camera);
    };
    animate();

    // GSAP entrance
    gsap.fromTo(mountRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power3.out", delay: 1.5, scrollTrigger: { trigger: mountRef.current, start: "top 80%" } });
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, { scale: 0.9, y: 80, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "expo.out", delay: 2.2, scrollTrigger: { trigger: textRef.current, start: "top 80%" } });
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      geometry.dispose(); material.dispose();
      lineGeometry.dispose(); lineMaterial.dispose();
      driftGeometry.dispose(); driftMat.dispose(); particleTexture.dispose();
      nodeGeo.dispose(); nodeMat.dispose();
      renderer.dispose();
    };
  }, []);

  const resetView = () => {
    setActiveNode(null);
    window.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0"></div>
      
      <div className={`container mx-auto px-6 relative z-10 text-center pointer-events-none transition-opacity duration-500 ${activeNode ? 'opacity-0' : 'opacity-100'}`} ref={textRef}>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Shield size={80} className="text-[#00f2ff] animate-pulse" strokeWidth={1} />
            <div className="absolute inset-0 blur-xl bg-[#00f2ff]/30 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-[#00f2ff] font-mono tracking-[0.3em] text-sm md:text-base mb-4 uppercase">Secure Your Digital Future</h2>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight glitch" data-text="Next Generation Cybersecurity Protection">
          Next Generation <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">Cybersecurity</span> Protection
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          Advanced threat detection, AI-powered monitoring, and impenetrable defense systems for the modern enterprise.
          <br/><span className="text-[#00f2ff] text-sm mt-4 block animate-pulse">Click nodes to inspect the network</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto ui-layer">
          <button onClick={() => navigate('/scanner')} className="glow-border px-8 py-4 bg-[#00f2ff]/10 text-[#00f2ff] rounded font-mono tracking-widest hover:bg-[#00f2ff]/20 transition-all w-full sm:w-auto">
            GET PROTECTED
          </button>
          <button onClick={() => document.getElementById('threat-map')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 border border-[#7a00ff]/50 text-white rounded font-mono tracking-widest hover:bg-[#7a00ff]/20 transition-all w-full sm:w-auto">
            EXPLORE THREAT INTEL
          </button>
        </div>
      </div>

      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto ui-layer transition-all duration-500 transform ${activeNode ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {activeNode && (
          <div className="glass-card p-6 rounded-xl border border-[#00f2ff]/50 shadow-[0_0_30px_rgba(0,242,255,0.2)] max-w-md w-full flex flex-col items-center text-center relative">
            <button onClick={resetView} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            <div className="w-12 h-12 rounded-full bg-[#00f2ff]/20 flex items-center justify-center mb-4 text-[#00f2ff]">
              {activeNode.name.includes('Server') ? <Server size={24} /> : activeNode.name.includes('Database') ? <Database size={24} /> : activeNode.name.includes('Auth') ? <Lock size={24} /> : <Shield size={24} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">{activeNode.name}</h3>
            <p className="text-gray-300 text-sm">{activeNode.desc}</p>
            <div className="mt-4 w-full bg-black/50 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between text-xs font-mono mb-1"><span className="text-gray-400">STATUS</span><span className="text-[#00f2ff]">SECURE</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#00f2ff] h-1.5 rounded-full w-full"></div></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
