import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current.querySelector('.contact-form'),
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 relative z-10 bg-[#050508]/80">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">Secure Comms Channel</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Initiate an encrypted connection with our security experts.
          </p>
        </div>

        <div className="max-w-2xl mx-auto contact-form">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-xl border-[#7a00ff]/30 relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f2ff]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f2ff]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f2ff]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f2ff]"></div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">Operator Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all font-mono text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">Secure Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#7a00ff] focus:shadow-[0_0_15px_rgba(122,0,255,0.3)] transition-all font-mono text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">Encrypted Message</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all font-mono text-sm resize-none"
                placeholder="Describe your security needs..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full glow-border py-4 rounded font-mono tracking-widest flex items-center justify-center transition-all ${
                submitted ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-[#7a00ff]/20 text-white hover:bg-[#7a00ff]/40'
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">ENCRYPTING & SENDING...</span>
              ) : submitted ? (
                <span>TRANSMISSION SUCCESSFUL</span>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  <span>TRANSMIT DATA</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
