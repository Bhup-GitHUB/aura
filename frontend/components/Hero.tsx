import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { ArrowDown } from 'lucide-react';

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

      // Image reveal - Slower, more cinematic
      tl.fromTo(imageRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" }
      );

      // Text reveal - Staggered elegant rise
      tl.fromTo(titleRef.current,
        { y: 60, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
        "-=1.5"
      );

      tl.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );

       tl.fromTo(".partner-logo",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 },
        "-=0.8"
      );

      // Parallax effect on scroll
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 20,
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

  const partners = ["Forbes", "WSJ", "Architectural Digest", "Inman", "Bloomberg"];

  return (
    <section ref={containerRef} className="relative h-[110vh] flex flex-col justify-center items-center overflow-hidden bg-luxury-black pt-20">
      
      {/* Background Image with sophisticated gradient */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div ref={imageRef} className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2670&auto=format&fit=crop")' }}></div>
        <div className="absolute inset-0 bg-luxury-black/40"></div>
        {/* Gradient fade to bottom black */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/30 via-transparent to-luxury-black"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#080808_100%)] opacity-80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center max-w-6xl">
        
        <div className="mb-10 overflow-hidden">
             <span className="inline-block py-1 px-3 border border-white/20 rounded-full bg-luxury-black/30 backdrop-blur-sm text-luxury-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase animate-fade-in">
              Next Generation Intelligence
            </span>
        </div>

        <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.95] mb-10 tracking-tight">
          The art of the deal, <br />
          <span className="italic font-light text-white/80">perfected by AI.</span>
        </h1>

        <p ref={subtitleRef} className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-light tracking-wide mix-blend-screen">
          Aura fuses market-leading proprietary data with generative AI to give elite agents an unfair advantage in the luxury market.
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <Button variant="primary" className="min-w-[180px]">Request Access</Button>
          <button className="group flex items-center gap-3 text-white text-sm tracking-widest uppercase hover:text-luxury-gold transition-colors duration-300">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-luxury-gold transition-colors">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1 group-hover:border-l-luxury-gold transition-colors"></div>
            </div>
            Watch the Film
          </button>
        </div>

        <div ref={logoRef} className="mt-24 md:mt-32 w-full max-w-4xl">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-8">Trusted by top brokerages</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40">
            {partners.map((partner, index) => (
              <span key={index} className="partner-logo text-lg md:text-xl font-serif italic text-white hover:text-luxury-gold hover:opacity-100 transition-all duration-500 cursor-default">{partner}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 mix-blend-difference">
        <span className="text-[10px] tracking-[0.3em] text-white uppercase">Scroll</span>
        <ArrowDown size={16} className="text-white animate-bounce" />
      </div>
    </section>
  );
};