import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { NavigationProps } from '../types';
import { ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-luxury-black flex items-center justify-center relative overflow-hidden px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#D9A44120,_transparent_40%)] opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div ref={formRef} className="w-full max-w-md relative z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors uppercase text-xs tracking-widest font-bold"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="glass-panel p-10 md:p-12 rounded-sm border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-white mb-2">Welcome Back</h2>
            <p className="text-white/40 font-light text-sm">Access your agent dashboard.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <Input label="Email Address" type="email" />
            <Input label="Password" type="password" />
            
            <div className="flex justify-end mb-8">
              <a href="https://bhupeshkumar.tech" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-luxury-gold transition-colors">Forgot Password?</a>
            </div>

            <Button className="w-full flex justify-center" onClick={() => console.log('Login clicked')}>
              Log In
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm font-light">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')}
                className="text-white hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold transition-all ml-1 font-medium"
              >
                Request Access
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};