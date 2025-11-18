import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

export const CtaBanner: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-luxury-black overflow-hidden">
      {/* Background Image blurred */}
      <div className="absolute inset-0 w-full h-full opacity-30 bg-cover bg-fixed bg-center" 
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop")' }} />
      
      <div ref={cardRef} className="relative z-10 container mx-auto">
        <div className="glass-panel p-12 md:p-24 rounded-sm border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Find out how Aura can help you <span className="text-luxury-gold italic">dominate your market</span>
            </h2>
            <p className="text-gray-300 text-lg font-light">
              Join the elite tier of real estate professionals using AI to close more deals in less time.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Button variant="primary" className="min-w-[200px]">Book a Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
};