
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Star } from 'lucide-react';
import { Button } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: "Explorer",
    price: "₹999",
    period: "/month",
    description: "For the aspiring investor looking for data-backed decisions.",
    features: ["Fair Price Check (5/mo)", "Mumbai & Pune Data", "Basic Rent Trends", "Email Support"],
    highlight: false
  },
  {
    name: "Investor Pro",
    price: "₹2,999",
    period: "/month",
    description: "Serious intelligence for serious portfolios.",
    features: ["Unlimited Fair Price Checks", "Pan-India Access", "5-Year Growth Projections", "Rent vs Buy Calculator", "New Launch Alerts"],
    highlight: true
  },
  {
    name: "Developer",
    price: "Custom",
    period: "",
    description: "Market intelligence for builders and brokerages.",
    features: ["API Access", "Competitor Benchmarking", "Demand Heatmaps", "White-label Reports", "Dedicated Account Manager"],
    highlight: false
  }
];

export const Pricing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Membership</span>
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black">Unlock MarketVision.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`pricing-card relative flex flex-col p-8 md:p-12 rounded-sm transition-all duration-500 group ${
                tier.highlight 
                  ? 'bg-luxury-black text-white shadow-2xl scale-105 z-10' 
                  : 'bg-gray-50 text-luxury-black border border-gray-200 hover:border-luxury-gold/30'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`font-serif text-2xl mb-2 ${tier.highlight ? 'text-white' : 'text-luxury-black'}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-medium ${tier.highlight ? 'text-luxury-gold' : 'text-luxury-black'}`}>{tier.price}</span>
                  <span className={`text-sm ${tier.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{tier.period}</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${tier.highlight ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={16} className={`mt-0.5 ${tier.highlight ? 'text-luxury-gold' : 'text-luxury-gold'}`} />
                    <span className={`text-sm ${tier.highlight ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.highlight ? 'primary' : 'outline'} 
                className={`w-full justify-center ${!tier.highlight && 'border-gray-300 text-luxury-black hover:bg-luxury-black hover:text-white hover:border-luxury-black'}`}
              >
                {tier.highlight ? 'Start Free Trial' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
