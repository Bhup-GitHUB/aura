
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
    <section ref={containerRef} className="bg-luxury-black py-16 md:py-24 border-b border-white/5 relative z-30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item relative flex flex-col items-center text-center group">
              {index !== 0 && (
                <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              )}
              
              <span className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-2 md:mb-4 group-hover:text-luxury-gold transition-colors duration-500">{stat.value}</span>
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-white/40 uppercase group-hover:text-white transition-colors duration-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
