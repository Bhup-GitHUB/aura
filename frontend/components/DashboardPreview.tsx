
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Bell, Menu, BarChart2, MapPin, Activity, TrendingUp, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const DashboardPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(dashboardRef.current, { 
        rotateX: 25, 
        scale: 0.9,
        opacity: 0,
        y: 100
      });

      gsap.to(dashboardRef.current, {
        rotateX: 0,
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "top 20%",
          scrub: 1,
        }
      });

      gsap.from(".dash-widget", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-luxury-black overflow-hidden relative perspective-[2000px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] bg-luxury-gold/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 text-center mb-16">
         <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">The MarketVision Dashboard</span>
         <h2 className="text-3xl md:text-5xl font-serif text-white">Deep intelligence on <br/>Indian Real Estate.</h2>
      </div>

      <div className="container mx-auto px-2 md:px-6 max-w-6xl">
        <div 
          ref={dashboardRef}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] origin-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute top-0 left-0 right-0 h-14 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-4">
              <Menu size={18} className="text-gray-400" />
              <span className="text-white font-serif tracking-wider text-sm">AURA <span className="text-luxury-gold text-[10px] align-top">VISION</span></span>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" disabled placeholder="Search location (e.g. Bandra West, Worli)..." className="w-full bg-[#0a0a0a] border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs text-gray-300 focus:outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell size={16} className="text-gray-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-luxury-gold/20 border border-luxury-gold/50 flex items-center justify-center text-luxury-gold text-xs font-bold">
                AM
              </div>
            </div>
          </div>

          <div className="absolute top-14 bottom-0 left-0 w-16 md:w-60 bg-[#141414] border-r border-white/5 py-6 hidden md:flex flex-col gap-1 z-10">
             {[
               { icon: MapPin, label: 'Area Analysis', active: true },
               { icon: BarChart2, label: 'Fair Price Check' },
               { icon: TrendingUp, label: 'Future Trends' },
               { icon: FileText, label: 'Transaction Logs' },
               { icon: Activity, label: 'Demand Heatmap' }
             ].map((item, i) => (
               <div key={i} className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${item.active ? 'bg-luxury-gold/10 border-r-2 border-luxury-gold' : 'hover:bg-white/5 border-r-2 border-transparent'}`}>
                 <item.icon size={16} className={item.active ? 'text-luxury-gold' : 'text-gray-500'} />
                 <span className={`text-xs font-medium ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
               </div>
             ))}
          </div>

          <div className="absolute top-14 bottom-0 left-0 md:left-60 right-0 bg-[#0f0f0f] p-6 md:p-8 overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
               
               <div className="dash-widget md:col-span-2 bg-[#141414] border border-white/5 rounded-lg p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-white text-sm font-medium">Price Trends: Bandra West</h3>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Avg. ₹/Sq. Ft.</p>
                    </div>
                    <span className="text-green-400 text-xs flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">+8.2% YoY</span>
                  </div>
                  
                  <div className="relative h-32 w-full mt-8">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path d="M0,100 C50,90 100,110 150,80 C200,50 250,90 300,60 C350,30 400,40 450,20 L450,120 L0,120 Z" fill="url(#gradient)" opacity="0.2" />
                      <path d="M0,100 C50,90 100,110 150,80 C200,50 250,90 300,60 C350,30 400,40 450,20" fill="none" stroke="#D9A441" strokeWidth="2" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D9A441" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute top-[20%] left-[60%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"></div>
                    <div className="absolute top-[5%] left-[60%] bg-white text-black text-[10px] font-bold px-2 py-1 rounded transform -translate-x-1/2">₹65,000/sqft</div>
                  </div>
               </div>

               <div className="dash-widget bg-[#141414] border border-white/5 rounded-lg p-6 flex flex-col relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-luxury-gold animate-pulse rounded-full"></div>
                    <h3 className="text-white text-sm font-medium">Fair Price Rating</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center my-2">
                     <div className="relative w-32 h-16 overflow-hidden mb-2">
                        <div className="absolute top-0 left-0 w-full h-32 border-[12px] border-gray-800 rounded-full box-border border-b-0 border-l-0 border-r-0" style={{ borderRadius: '50% 50% 0 0', borderBottom: 'none' }}></div>
                        <div className="absolute top-0 left-0 w-full h-32 border-[12px] border-transparent border-t-luxury-gold rounded-full box-border" style={{ transform: 'rotate(-45deg)', borderRadius: '50% 50% 0 0' }}></div>
                     </div>
                     <p className="text-2xl font-serif text-white">Fair Value</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Score: 8.5/10</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-md p-3 border-l-2 border-green-500 mt-auto">
                    <p className="text-gray-300 text-[10px] leading-relaxed">
                      <span className="text-green-400 font-bold">Analysis:</span> Property is priced 4% below micro-market average for Pali Hill. Good buy.
                    </p>
                  </div>
               </div>

               <div className="dash-widget md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                 {[
                   { label: "Rental Yield", value: "3.2%", sub: "vs 2.8% Avg" },
                   { label: "Projected 5Y Growth", value: "+42%", sub: "High Growth Zone" },
                   { label: "Inventory Overhang", value: "12 Mo", sub: "Moderate Supply" },
                   { label: "Livability Score", value: "9.2", sub: "Excellent Infra" }
                 ].map((stat, i) => (
                   <div key={i} className="bg-[#141414] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors">
                     <p className="text-gray-500 text-[10px] uppercase tracking-wider">{stat.label}</p>
                     <p className="text-2xl font-serif text-white mt-1">{stat.value}</p>
                     <p className="text-xs text-gray-600 mt-1">{stat.sub}</p>
                   </div>
                 ))}
               </div>

             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
