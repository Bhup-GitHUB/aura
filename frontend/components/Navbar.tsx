import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from './ui/Button';
import { NavigationProps } from '../types';

export const Navbar: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initial fade down
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 }
    );
  }, []);

  const navLinks = [
    { name: 'Products', hasDropdown: true },
    { name: 'Solutions', hasDropdown: true },
    { name: 'Company', hasDropdown: true },
    { name: 'Case Studies', hasDropdown: false },
    { name: 'Resources', hasDropdown: true },
  ];

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-luxury-black/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 border border-luxury-gold rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out flex items-center justify-center">
            <div className="w-3 h-3 bg-luxury-gold" />
          </div>
          <span className="text-2xl font-serif tracking-wider text-white ml-2">AURA</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group cursor-pointer">
              <div className="flex items-center gap-1 text-xs font-semibold tracking-widest text-white hover:text-luxury-gold transition-colors uppercase">
                {link.name}
                {link.hasDropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />}
              </div>
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full"></span>
            </div>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => onNavigate('login')}
            className="text-xs font-bold tracking-widest text-white hover:text-luxury-gold transition-colors uppercase"
          >
            Log In
          </button>
          <Button variant="primary" onClick={() => onNavigate('signup')}>Get Started</Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu (Simple overlay for demo) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-luxury-black border-b border-white/10 p-6 flex flex-col gap-6 lg:hidden">
          {navLinks.map((link) => (
            <div key={link.name} className="text-white text-sm font-semibold tracking-widest uppercase">
              {link.name}
            </div>
          ))}
          <button onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} className="text-left text-white text-sm font-semibold tracking-widest uppercase">Log In</button>
          <Button variant="primary" onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }}>Get Started</Button>
        </div>
      )}
    </nav>
  );
};