import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot, User, ShieldAlert, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

// Initialize with the Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default function AIBot() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hello. I am the CyberGuard AI Oracle. Ask me anything about cybersecurity laws, compliance (GDPR, HIPAA), threat mitigation, or system vulnerabilities.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!genAI) return;
    try {
      chatRef.current = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are an elite cybersecurity AI assistant named CyberGuard Oracle. You provide expert advice on cybersecurity laws, compliance, threat mitigation, and hacking prevention. Be professional, slightly futuristic, and highly informative. Format your responses using markdown.",
      }).startChat({
        history: [],
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
      setMessages(prev => [...prev, { role: 'model', text: 'ERROR: AI core offline. API key missing or invalid.' }]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await chatRef.current.sendMessage(userMsg);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ERROR: Connection to AI core severed. Please check your API key and connection.' }]);
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
                      <div className="markdown-body text-sm text-gray-300 prose prose-invert max-w-none prose-p:leading-relaxed">
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
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10">
                    <span className="text-sm font-mono text-gray-400 animate-pulse">Processing query...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/60 border-t border-white/10">
            <form onSubmit={handleSend} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cybersecurity laws..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] font-mono text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-[#7a00ff]/20 text-white rounded-lg hover:bg-[#7a00ff]/40 transition-all flex items-center justify-center"
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
