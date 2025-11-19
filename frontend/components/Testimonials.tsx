
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-item", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-[#080808] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="testimonial-item">
            <Quote className="text-luxury-gold mb-8 opacity-50" size={48} />
            <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8">
              "Aura MarketVision exposed a 15% overvaluation on a Worli sea-facing unit. <span className="text-luxury-gold italic">It saved my client ₹2.5 Crores</span> in a single negotiation."
            </h3>
            <div>
              <p className="text-white font-bold tracking-widest uppercase text-sm">Anjali Mehta</p>
              <p className="text-luxury-gold/70 text-xs mt-1 uppercase tracking-wider">Director, Luxury Listings Mumbai</p>
            </div>
          </div>

          <div className="grid gap-8">
             <div className="testimonial-item glass-panel p-8 border border-white/5 rounded-sm">
                <p className="text-gray-300 font-light leading-relaxed mb-6">
                  "The predictive analysis regarding the new Metro Line impact was spot on. We invested in Andheri West based on Aura's data and saw 22% appreciation in 18 months."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Rajiv Kapoor</p>
                    <p className="text-gray-500 text-xs">Property Investor, Delhi NCR</p>
                  </div>
                </div>
             </div>

             <div className="testimonial-item glass-panel p-8 border border-white/5 rounded-sm translate-x-0 lg:translate-x-8">
                <p className="text-gray-300 font-light leading-relaxed mb-6">
                  "Finally, transparency for the Indian buyer. The Fair Price Engine is the first thing I check before scheduling a site visit."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1573496359-7e0ef0a91396?auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Priya Desai</p>
                    <p className="text-gray-500 text-xs">Homebuyer, Bangalore</p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
