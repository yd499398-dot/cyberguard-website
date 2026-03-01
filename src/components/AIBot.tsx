import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, ShieldAlert, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

// Initialize lazily to prevent crashes if env var is missing during build/deploy
let ai: GoogleGenAI | null = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } else {
    console.warn("VITE_GEMINI_API_KEY is missing from environment variables.");
  }
} catch (e) {
  console.warn("Gemini API key not found or invalid.");
}

export default function AIBot() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hello. I am the CyberGuard AI Oracle. Ask me anything about cybersecurity laws, compliance (GDPR, HIPAA), threat mitigation, or system vulnerabilities.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ai) return;
    try {
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are an elite cybersecurity AI assistant named CyberGuard Oracle. You provide expert advice on cybersecurity laws, compliance, threat mitigation, and hacking prevention. Be professional, slightly futuristic, and highly informative. Format your responses using markdown.',
        }
      });
    } catch (e) {
      console.error("Failed to initialize AI chat:", e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    if (!chatRef.current) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', text: 'ERROR: AI core offline. API key missing or invalid.' }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ERROR: Connection to AI core severed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 relative z-10 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-4xl h-[75vh] flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <ShieldAlert className="text-[#00f2ff]" size={36} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">CyberGuard AI Oracle</span>
          </h2>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Secure Intelligence Interface</p>
        </div>

        <div className="flex-1 glass-card rounded-xl border-[#7a00ff]/30 flex flex-col overflow-hidden relative shadow-[0_0_30px_rgba(122,0,255,0.15)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'bg-[#7a00ff]/20 text-[#7a00ff]'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-4 rounded-xl ${msg.role === 'user' ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-right' : 'bg-black/50 border border-white/10 text-left'}`}>
                    {msg.role === 'user' ? (
                      <p className="text-sm font-mono">{msg.text}</p>
                    ) : (
                      <div className="markdown-body text-sm text-gray-300 prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[80%] flex-row">
                  <div className="w-10 h-10 rounded-full bg-[#7a00ff]/20 text-[#7a00ff] flex items-center justify-center shrink-0">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center">
                    <span className="text-sm font-mono text-gray-400 animate-pulse">Processing query...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/60 border-t border-white/10">
            <form onSubmit={handleSend} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cybersecurity laws, compliance, or threats..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all font-mono text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="glow-border px-6 py-3 bg-[#7a00ff]/20 text-white rounded-lg font-mono tracking-widest hover:bg-[#7a00ff]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
