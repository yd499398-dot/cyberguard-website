import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for coordinates to avoid re-renders
  const mouse = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = (e: MouseEvent | TouchEvent) => {
      if (!isVisible) setIsVisible(true);
      
      if ('touches' in e && e.touches.length > 0) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if ('clientX' in e) {
        mouse.current = { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
      }

      // Update main cursor immediately for zero lag
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
    };

    // Smooth trail animation loop
    const animateTrail = () => {
      // Lerp (linear interpolation) for smooth trailing effect
      trail.current.x += (mouse.current.x - trail.current.x) * 0.15;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.15;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animateTrail);
    };

    animateTrail();

    const handleMouseOver = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.tagName) return;
      
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('touchmove', updatePosition, { passive: true });
    window.addEventListener('touchstart', updatePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('touchmove', updatePosition);
      window.removeEventListener('touchstart', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('touchend', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      <div 
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`} 
        style={{ 
          opacity: isVisible ? 1 : 0,
          left: 0, 
          top: 0 
        }}
      ></div>
      <div 
        ref={trailRef}
        className="cursor-trail" 
        style={{ 
          opacity: isVisible ? 1 : 0,
          left: 0, 
          top: 0 
        }}
      ></div>
    </>
  );
}
