
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { ArrowDown, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" }
      );

      tl.fromTo(titleRef.current,
        { y: 100, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
        "-=1.5"
      );

      tl.fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );

      tl.fromTo(".hero-btn", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.8"
      );

       tl.fromTo(".partner-logo",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 },
        "-=0.6"
      );

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const partners = ["Economic Times", "LiveMint", "MoneyControl", "CNBC TV18", "Forbes India"];

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-luxury-black pt-24 pb-12 md:pt-32">
      
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div ref={imageRef} className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45f003f2ddfa?q=80&w=2670&auto=format&fit=crop")' }}></div>
        <div className="absolute inset-0 bg-luxury-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/40 via-transparent to-luxury-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#080808_120%)] opacity-90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center max-w-7xl">
        
        <div className="mb-8 md:mb-12 overflow-hidden">
             <div className="inline-flex items-center gap-2 py-1.5 px-4 border border-white/10 rounded-full bg-luxury-black/40 backdrop-blur-md shadow-xl animate-fade-in hover:border-luxury-gold/50 transition-colors cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse"></div>
              <span className="text-luxury-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                Aura MarketVision™
              </span>
            </div>
        </div>

        <h1 ref={titleRef} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[1.05] md:leading-[0.95] mb-8 md:mb-12 tracking-tight">
          The truth behind <br />
          <span className="italic font-light text-white/70 bg-clip-text bg-gradient-to-b from-white to-white/40">every price tag.</span>
        </h1>

        <p ref={subtitleRef} className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl leading-relaxed mb-10 md:mb-14 font-light tracking-wide mix-blend-screen px-4">
          Decode property values in Mumbai, Delhi, and Bangalore using hyper-local data. We reveal the "Fair Price" vs "Asking Price" instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center w-full justify-center px-4">
          <div className="hero-btn w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-[200px] shadow-[0_0_30px_rgba(217,164,65,0.2)]">Analyze an Area</Button>
          </div>
          <button className="hero-btn group flex items-center justify-center gap-4 text-white text-xs md:text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300 w-full sm:w-auto py-4">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-luxury-gold group-hover:bg-luxury-gold/10 transition-all">
                <Play size={14} fill="currentColor" className="ml-0.5" />
            </div>
            <span className="border-b border-transparent group-hover:border-luxury-gold pb-0.5 transition-all">Watch Demo</span>
          </button>
        </div>

        <div ref={logoRef} className="mt-20 md:mt-32 w-full max-w-4xl px-4">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-8">Trusted Intelligence For</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, index) => (
              <span key={index} className="partner-logo text-base md:text-xl font-serif italic text-white hover:text-luxury-gold hover:scale-105 transform transition-all duration-300 cursor-default">{partner}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 opacity-30 mix-blend-difference animate-pulse">
        <span className="text-[9px] tracking-[0.3em] text-white uppercase">Scroll</span>
        <ArrowDown size={14} className="text-white" />
      </div>
    </section>
  );
};
