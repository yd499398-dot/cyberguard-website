import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-wrapper ${!loading ? 'hidden' : ''}`}>
      <div className="cyber-loader"></div>
      <div className="mt-8 text-[var(--color-cyber-blue)] font-mono tracking-[0.2em] animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    </div>
  );
}
