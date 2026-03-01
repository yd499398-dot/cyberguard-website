import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.maxDistance = 10;
    controls.minDistance = 1.5;
    // Disable pan to keep it centered
    controls.enablePan = false;

    // Particles Globe
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: '#00f2ff',
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Network Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7a00ff,
      transparent: true,
      opacity: 0.1
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      linePositions[i] = (Math.random() - 0.5) * 8;
    }
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Drifting Particles (Ambient Dust/Data)
    const driftParticlesCount = 400;
    const driftGeometry = new THREE.BufferGeometry();
    const driftPosArray = new Float32Array(driftParticlesCount * 3);
    const driftVelocities: {x: number, y: number, z: number}[] = [];

    for (let i = 0; i < driftParticlesCount * 3; i += 3) {
      driftPosArray[i] = (Math.random() - 0.5) * 15;
      driftPosArray[i+1] = (Math.random() - 0.5) * 15;
      driftPosArray[i+2] = (Math.random() - 0.5) * 15;
      
      driftVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005
      });
    }

    driftGeometry.setAttribute('position', new THREE.BufferAttribute(driftPosArray, 3));
    
    // Create a soft circular texture for particles programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const driftMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: '#7a00ff',
      transparent: true,
      opacity: 0.4,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const driftParticlesMesh = new THREE.Points(driftGeometry, driftMaterial);
    scene.add(driftParticlesMesh);

    // Interactive Nodes (Cybersecurity Components)
    const nodeGeometry = new THREE.IcosahedronGeometry(0.2, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00f2ff,
      wireframe: true
    });
    
    const nodesData = [
      { id: 'server', position: new THREE.Vector3(-2.5, 1.5, 1), name: 'Core Server', desc: 'Mainframe processing unit with quantum encryption.' },
      { id: 'database', position: new THREE.Vector3(2.5, -1, 0.5), name: 'Secure Database', desc: 'Encrypted data vault storing sensitive user credentials.' },
      { id: 'firewall', position: new THREE.Vector3(0, 2.5, -1.5), name: 'Perimeter Firewall', desc: 'Advanced AI-driven firewall blocking unauthorized access.' },
      { id: 'auth', position: new THREE.Vector3(-1, -2, 2), name: 'Auth Gateway', desc: 'Zero-trust authentication and identity verification.' },
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    nodesData.forEach(node => {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      mesh.position.copy(node.position);
      mesh.userData = { name: node.name, desc: node.desc };
      scene.add(mesh);
      nodeMeshes.push(mesh);
      
      // Add glow
      const glowGeo = new THREE.SphereGeometry(0.3, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0x7a00ff, 
        transparent: true, 
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      mesh.add(glow);
    });

    camera.position.z = 6;

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      // Ignore clicks on UI elements
      if ((event.target as HTMLElement).closest('.ui-layer')) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Zoom to object
        gsap.to(camera.position, {
          x: object.position.x + 0.5,
          y: object.position.y + 0.5,
          z: object.position.z + 1.5,
          duration: 1.5,
          ease: 'power3.inOut'
        });
        
        gsap.to(controls.target, {
          x: object.position.x,
          y: object.position.y,
          z: object.position.z,
          duration: 1.5,
          ease: 'power3.inOut'
        });
        
        setActiveNode({ name: object.userData.name, desc: object.userData.desc });
      } else {
        // Reset camera if clicking empty space
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 6,
          duration: 1.5,
          ease: 'power3.inOut'
        });
        gsap.to(controls.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: 'power3.inOut'
        });
        setActiveNode(null);
      }
    };

    window.addEventListener('click', onMouseClick);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate background elements
      particlesMesh.rotation.y = elapsedTime * 0.05;
      linesMesh.rotation.y = -elapsedTime * 0.05;

      // Animate drifting particles
      const positions = driftGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < driftParticlesCount; i++) {
        const i3 = i * 3;
        positions[i3] += driftVelocities[i].x;
        positions[i3+1] += driftVelocities[i].y;
        positions[i3+2] += driftVelocities[i].z;

        // Wrap around to keep them in frame
        if (positions[i3] > 7.5) positions[i3] = -7.5;
        if (positions[i3] < -7.5) positions[i3] = 7.5;
        if (positions[i3+1] > 7.5) positions[i3+1] = -7.5;
        if (positions[i3+1] < -7.5) positions[i3+1] = 7.5;
        if (positions[i3+2] > 7.5) positions[i3+2] = -7.5;
        if (positions[i3+2] < -7.5) positions[i3+2] = 7.5;
      }
      driftGeometry.attributes.position.needsUpdate = true;
      driftParticlesMesh.rotation.y = elapsedTime * 0.02;

      // Animate interactive nodes
      nodeMeshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        // Floating effect
        mesh.position.y += Math.sin(elapsedTime * 2 + index) * 0.002;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // GSAP Animations
    if (mountRef.current) {
      gsap.fromTo(mountRef.current,
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, opacity: 1, duration: 2, ease: "power3.out", delay: 1.5,
          scrollTrigger: {
            trigger: mountRef.current,
            start: "top 80%",
          }
        }
      );
    }

    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { scale: 0.9, y: 80, opacity: 0 },
        { 
          scale: 1, y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "expo.out", delay: 2.2,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      driftGeometry.dispose();
      driftMaterial.dispose();
      particleTexture.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const resetView = () => {
    setActiveNode(null);
    // The actual camera reset is handled by clicking empty space, 
    // but we can also trigger a custom event or just let the user click away.
    // For simplicity, we'll just clear the UI. To fully reset camera from UI:
    window.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D Canvas Container - Must have pointer events to allow OrbitControls and Raycaster */}
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"></div>
      
      {/* Main Text UI - Pointer events none so it doesn't block 3D interaction, but children have auto */}
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
          <br/><span className="text-[#00f2ff] text-sm mt-4 block animate-pulse">Drag to rotate • Scroll to zoom • Click nodes to inspect</span>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto ui-layer">
          <button 
            onClick={() => navigate('/scanner')}
            className="glow-border px-8 py-4 bg-[#00f2ff]/10 text-[#00f2ff] rounded font-mono tracking-widest hover:bg-[#00f2ff]/20 transition-all w-full sm:w-auto"
          >
            GET PROTECTED
          </button>
          <button 
            onClick={() => {
              document.getElementById('threat-map')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-[#7a00ff]/50 text-white rounded font-mono tracking-widest hover:bg-[#7a00ff]/20 transition-all w-full sm:w-auto"
          >
            EXPLORE THREAT INTEL
          </button>
        </div>
      </div>

      {/* Node Info Overlay */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto ui-layer transition-all duration-500 transform ${activeNode ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {activeNode && (
          <div className="glass-card p-6 rounded-xl border border-[#00f2ff]/50 shadow-[0_0_30px_rgba(0,242,255,0.2)] max-w-md w-full flex flex-col items-center text-center relative">
            <button onClick={resetView} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-[#00f2ff]/20 flex items-center justify-center mb-4 text-[#00f2ff]">
              {activeNode.name.includes('Server') ? <Server size={24} /> : 
               activeNode.name.includes('Database') ? <Database size={24} /> : 
               activeNode.name.includes('Auth') ? <Lock size={24} /> : 
               <Shield size={24} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">{activeNode.name}</h3>
            <p className="text-gray-300 text-sm">{activeNode.desc}</p>
            <div className="mt-4 w-full bg-black/50 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-400">STATUS</span>
                <span className="text-[#00f2ff]">SECURE</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className="bg-[#00f2ff] h-1.5 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
