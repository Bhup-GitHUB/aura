import React from "react";
import { MessageSquare, Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-black pt-24 pb-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 border border-luxury-gold rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-luxury-gold" />
            </div>
            <span className="text-xl font-serif tracking-wider text-white ml-2">
              AURA
            </span>
          </div>

          <p className="text-white/40 font-light text-lg max-w-lg mb-12">
            Redefining real estate excellence through artificial intelligence
            and human-centric design.
          </p>

          <div className="space-y-2 mb-12">
            <p className="text-xs text-luxury-text font-bold tracking-widest uppercase">
              Call us
            </p>
            <p className="text-white font-serif text-xl">(310) 955-1077</p>
          </div>

          <div className="flex gap-4 mb-16">
            {[Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:border-luxury-gold hover:text-luxury-black transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/20">
            © 2025 Aura MarketVision. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="https://bhupeshkumar.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-luxury-gold hover:text-white transition-colors tracking-widest uppercase font-bold border-b border-luxury-gold/30 hover:border-white pb-1"
            >
              bhupeshkumar.tech
            </a>
            <a
              href="https://aura.bhupeshkumar.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-luxury-gold hover:text-white transition-colors tracking-widest uppercase font-bold border-b border-luxury-gold/30 hover:border-white pb-1"
            >
              aura.bhupeshkumar.tech
            </a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-14 h-14 bg-luxury-charcoal text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-luxury-gold transition-colors duration-300 border border-white/10">
          <MessageSquare />
        </button>
      </div>
    </footer>
  );
};
