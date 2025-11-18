import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PropertyFeature } from '../types';
import { ArrowRight, BarChart3, Sparkles, Users, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeatureBlockProps {
  feature: PropertyFeature;
  index: number;
}

export const FeatureBlock: React.FC<FeatureBlockProps> = ({ feature, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content Fade In
      gsap.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );

      // Parallax Image Effect
      if (imageRef.current && imageContainerRef.current) {
        gsap.fromTo(imageRef.current,
          { scale: 1.2, yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: imageContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }

      // Overlay Card Reveal
      gsap.fromTo(overlayRef.current,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isReversed = feature.alignment === 'right';

  // Render different AI overlays based on the feature ID for visual variety
  const renderOverlay = () => {
    if (feature.id === '1') { // Valuation
      return (
        <div ref={overlayRef} className="absolute -bottom-10 -right-10 md:bottom-8 md:-left-8 bg-luxury-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-sm shadow-2xl max-w-[240px] z-20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wider">AI Estimation</span>
            <Sparkles size={14} className="text-luxury-gold" />
          </div>
          <div className="text-3xl font-serif text-white mb-1">$4,250,000</div>
          <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
            <ArrowRight size={12} className="-rotate-45" />
            <span>+12% vs Market</span>
          </div>
        </div>
      );
    } else if (feature.id === '2') { // Matchmaking
      return (
        <div ref={overlayRef} className="absolute -bottom-6 -left-6 md:top-8 md:-right-8 bg-luxury-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-sm shadow-2xl z-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-white font-bold tracking-wider uppercase">Buyer Match Found</span>
          </div>
          <div className="flex -space-x-3 mb-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-luxury-black bg-gray-800 flex items-center justify-center text-xs text-white">
                <Users size={14} />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-luxury-black bg-luxury-gold flex items-center justify-center text-xs font-bold text-black">+14</div>
          </div>
          <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div className="bg-luxury-gold h-full w-[85%]"></div>
          </div>
        </div>
      );
    } else { // Staging
      return (
         <div ref={overlayRef} className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full z-20">
            <div className="flex items-center gap-3">
               <CheckCircle2 size={16} className="text-white" />
               <span className="text-sm font-medium text-white">Virtual Staging Complete</span>
            </div>
         </div>
      );
    }
  };

  return (
    <section ref={containerRef} className="py-24 md:py-40 overflow-hidden bg-white text-luxury-black relative">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}>
          
          {/* Content Side */}
          <div ref={contentRef} className="flex-1 max-w-xl relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-8 bg-luxury-gold"></span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-luxury-gold uppercase">
                {feature.label}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] mb-8 text-luxury-black font-medium">
              {feature.title}
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed mb-12 font-sans font-light">
              {feature.description}
            </p>
            
            <button className="group relative overflow-hidden py-3 px-0 text-xs font-bold tracking-[0.2em] uppercase text-luxury-black transition-colors">
              <span className="relative z-10 flex items-center gap-3">
                Discover More 
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-black/20 group-hover:bg-luxury-gold transition-colors duration-300"></span>
            </button>
          </div>

          {/* Image Side */}
          <div className="flex-1 w-full relative">
             {/* Decorative Background Number */}
             <span className="absolute -top-20 -left-10 text-[200px] font-serif text-gray-100 leading-none select-none pointer-events-none z-0">
                0{index + 1}
             </span>

            <div ref={imageContainerRef} className="relative aspect-[4/5] md:aspect-[4/3] overflow-hidden rounded-[2px] shadow-2xl z-10 bg-gray-100">
              <img 
                ref={imageRef}
                src={feature.imageUrl} 
                alt={feature.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for text readability if needed, though mainly for mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            {/* Floating AI Element */}
            {renderOverlay()}

          </div>

        </div>
      </div>
    </section>
  );
};