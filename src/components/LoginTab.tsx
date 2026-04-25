import React, { useState, useEffect } from 'react';
import { Lock, User, Key, ShieldCheck, Fingerprint, Loader2, UserPlus, FileText } from 'lucide-react';

export default function LoginTab() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [userName, setUserName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('cyberguard_token');
    const userStr = localStorage.getItem('cyberguard_user');
    
    // Check remembered credentials
    const remembered = localStorage.getItem('cyberguard_remembered');
    if (remembered) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(remembered);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } catch (e) {}
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.firstName) {
          setUserName(user.firstName);
        } else {
          setUserName('Operator');
        }
      } catch (e) {
        console.error("Failed to parse user data");
        setUserName('Operator');
      }
      setAuthSuccess(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !firstName)) return;
    
    setIsAuthenticating(true);
    setErrorMsg('');
    
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isRegistering) {
        // Mock Registration using localStorage
        const existingUsers = JSON.parse(localStorage.getItem('cyberguard_users') || '{}');
        
        if (existingUsers[email]) {
          throw new Error('Operator ID already registered in the system.');
        }
        
        // Store user (Note: In a real app, NEVER store plain text passwords)
        existingUsers[email] = { password, firstName }; 
        localStorage.setItem('cyberguard_users', JSON.stringify(existingUsers));
        
        // Auto-login after registration
        const token = btoa(email + Date.now()); // Mock token
        localStorage.setItem('cyberguard_token', token);
        localStorage.setItem('cyberguard_user', JSON.stringify({ email, firstName, role: 'Operator' }));
        setUserName(firstName);
        setAuthSuccess(true);
        
        // Dispatch event so Navbar can update
        window.dispatchEvent(new Event('auth-change'));
        
      } else {
        // Mock Login
        const existingUsers = JSON.parse(localStorage.getItem('cyberguard_users') || '{}');
        const user = existingUsers[email];
        
        // Hardcoded demo admin account
        if (email === 'admin@cyberguard.net' && password === 'admin') {
           const token = btoa(email + Date.now());
           localStorage.setItem('cyberguard_token', token);
           localStorage.setItem('cyberguard_user', JSON.stringify({ email, firstName: 'Admin', role: 'Admin' }));
           setUserName('Admin');
           setAuthSuccess(true);
           setIsAuthenticating(false);
           window.dispatchEvent(new Event('auth-change'));
           return;
        }

        if (!user || user.password !== password) {
          throw new Error('Invalid Operator ID or Encryption Key.');
        }
        
        if (rememberMe) {
          localStorage.setItem('cyberguard_remembered', JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem('cyberguard_remembered');
        }
        
        const token = btoa(email + Date.now());
        const finalName = user.firstName || email.split('@')[0];
        localStorage.setItem('cyberguard_token', token);
        localStorage.setItem('cyberguard_user', JSON.stringify({ email, firstName: finalName, role: 'Operator' }));
        setUserName(finalName);
        setAuthSuccess(true);
        
        // Dispatch event so Navbar can update
        window.dispatchEvent(new Event('auth-change'));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberguard_token');
    localStorage.removeItem('cyberguard_user');
    setAuthSuccess(false);
    
    // Only clear email/password if not remembered
    if (!rememberMe) {
      setEmail('');
      setPassword('');
    }
    
    setFirstName('');
    setUserName('');
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <section className="py-12 relative z-10 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Lock className="text-[#00f2ff]" size={36} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7a00ff]">
              {isRegistering ? 'Create Clearance' : 'Secure Login'}
            </span>
          </h2>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Level 5 Clearance Required</p>
        </div>

        <div className="glass-card rounded-2xl p-8 border-[#00f2ff]/30 shadow-[0_0_40px_rgba(0,242,255,0.1)] relative overflow-hidden">
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f2ff] opacity-50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#7a00ff] opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#7a00ff] opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f2ff] opacity-50"></div>

          {authSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <ShieldCheck size={48} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-green-400 mb-2 text-center">ACCESS GRANTED</h3>
              <p className="text-gray-300 text-center text-lg mt-2">Welcome back, <span className="text-[#00f2ff] font-bold">{userName}</span>.</p>
              <p className="text-gray-500 text-center text-xs font-mono mt-2">Secure connection established.</p>
              <button 
                onClick={handleLogout}
                className="mt-8 px-6 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors font-mono text-sm flex items-center gap-2"
              >
                <Lock size={16} />
                TERMINATE SESSION
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              
              {errorMsg && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded text-sm font-mono text-center">
                  {errorMsg}
                </div>
              )}

              {isRegistering && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      required={isRegistering}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all font-mono text-sm"
                      placeholder="John"
                      disabled={isAuthenticating}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">Operator ID / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] focus:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all font-mono text-sm"
                    placeholder="admin@cyberguard.net"
                    disabled={isAuthenticating}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#00f2ff] mb-2 tracking-widest uppercase">Encryption Key / Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#7a00ff] focus:shadow-[0_0_15px_rgba(122,0,255,0.3)] transition-all font-mono text-sm"
                    placeholder="••••••••••••"
                    disabled={isAuthenticating}
                  />
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-2">
                  <label className="flex items-center cursor-pointer hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      className="mr-2 accent-[#00f2ff]" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isAuthenticating} 
                    />
                    Remember Device
                  </label>
                  <a href="#" className="hover:text-[#00f2ff] transition-colors">Forgot Key?</a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isAuthenticating || !email || !password || (isRegistering && !firstName)}
                className={`w-full mt-4 py-4 rounded-lg font-mono tracking-widest flex items-center justify-center transition-all duration-300 ${
                  isAuthenticating 
                    ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/50 text-[#00f2ff]' 
                    : 'bg-gradient-to-r from-[#00f2ff]/20 to-[#7a00ff]/20 hover:from-[#00f2ff]/40 hover:to-[#7a00ff]/40 text-white border border-white/10 hover:border-white/30 glow-border'
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    <span>VERIFYING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    {isRegistering ? <UserPlus size={18} className="mr-2" /> : <Fingerprint size={18} className="mr-2" />}
                    <span>{isRegistering ? 'INITIALIZE CLEARANCE' : 'AUTHENTICATE'}</span>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
                  className="text-xs font-mono text-gray-400 hover:text-[#00f2ff] transition-colors"
                  disabled={isAuthenticating}
                >
                  {isRegistering ? 'Already have clearance? Login here.' : 'Need clearance? Register here.'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
