import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { NavigationProps } from '../types';
import { ArrowLeft, Check } from 'lucide-react';
import { authService } from '../src/services/auth.service';

export const SignupPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authService.signup({ username, password });
      setSuccess(true);
      setTimeout(() => {
        onNavigate('login');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-luxury-black flex items-center justify-center relative overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#2D6DF620,_transparent_50%)] opacity-30 pointer-events-none"></div>
      
      <div ref={contentRef} className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className="hidden lg:block pr-12">
          <button 
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors uppercase text-xs tracking-widest font-bold"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h1 className="text-5xl font-serif text-white leading-tight mb-8">
            Join the future of <br />
            <span className="text-luxury-gold italic">luxury real estate.</span>
          </h1>
          
          <p className="text-gray-400 font-light text-lg mb-12 max-w-md">
            Aura is currently invite-only for select brokerages. Apply now to join our waitlist or activate your brokerage invite code.
          </p>

          <div className="space-y-6">
            {[
              "AI-Powered Valuation Models",
              "Off-Market Listing Matches",
              "Automated Client Nurturing",
              "White-Glove Onboarding"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-luxury-gold/50 flex items-center justify-center text-luxury-gold">
                  <Check size={12} />
                </div>
                <span className="text-white/80 font-sans text-sm tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-10 md:p-14 rounded-sm border border-white/10 shadow-2xl backdrop-blur-2xl relative">
           <div className="lg:hidden mb-8">
            <button 
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase text-xs tracking-widest font-bold"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>

          <h2 className="text-2xl font-serif text-white mb-8">Request Access</h2>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <Input 
              label="Username" 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
            <Input 
              label="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}
            
            {success && (
              <div className="text-green-400 text-sm mt-2">Account created successfully! Redirecting to login...</div>
            )}
            
            <div className="pt-6">
              <Button className="w-full flex justify-center" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Submit Application'}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm font-light">
              Already a member?{' '}
              <button 
                onClick={() => onNavigate('login')}
                className="text-white hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold transition-all ml-1 font-medium"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};