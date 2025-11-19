
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "₹12K Cr+", label: "Property Value Analyzed" },
  { value: "45,000+", label: "Verified Transactions" },
  { value: "Mumbai", label: "Primary Focus Market" },
  { value: "98.5%", label: "Projection Accuracy" }
];

export const StatsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
      
      gsap.from(".divider-line", {
        scaleY: 0,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      })
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-luxury-black py-24 border-b border-white/5 relative z-30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item relative flex flex-col items-center text-center group">
              {index !== 0 && (
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent divider-line"></div>
              )}
              
              <span className="text-5xl md:text-6xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-500">{stat.value}</span>
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-white/40 uppercase group-hover:text-white transition-colors duration-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
