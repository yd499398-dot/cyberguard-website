import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles Globe
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 500; // Reduced from 2000 to fix lag
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: '#00f2ff',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Network Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7a00ff,
      transparent: true,
      opacity: 0.15
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      linePositions[i] = (Math.random() - 0.5) * 8;
    }
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      particlesMesh.rotation.y += 0.002;
      particlesMesh.rotation.x += 0.001;
      
      linesMesh.rotation.y -= 0.001;
      linesMesh.rotation.x -= 0.002;

      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      renderer.render(scene, camera);
    };

    animate();

    // GSAP Animations
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "expo.out", delay: 2.2 } // Delay after loader
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
      document.removeEventListener('mousemove', onDocumentMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center" ref={textRef}>
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
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
    </section>
  );
}
