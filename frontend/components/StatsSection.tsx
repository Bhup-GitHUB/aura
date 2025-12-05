
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "₹12K Cr+", label: "Value Analyzed" },
  { value: "45,000+", label: "Transactions" },
  { value: "Mumbai", label: "Prime Market" },
  { value: "98.5%", label: "Accuracy" }
];

export const StatsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-luxury-black py-16 md:py-24 border-b border-white/5 relative z-30 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0, transparent 32%), radial-gradient(circle at 80% 50%, rgba(217,164,65,0.2) 0, transparent 30%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "120px 120px" }} />
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item relative flex flex-col items-center text-center group bg-white/5 border border-white/10 rounded-xl py-8 md:py-10 shadow-[0_20px_70px_rgba(0,0,0,0.4)] hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-lg"
            >
              <div className="absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2 md:mb-4 group-hover:text-luxury-gold transition-colors duration-500">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-white/40 uppercase group-hover:text-white transition-colors duration-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
