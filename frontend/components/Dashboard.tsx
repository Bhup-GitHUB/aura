import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { NavigationProps } from '../types';
import { 
  Search, Bell, Menu, BarChart2, MapPin, Activity, 
  TrendingUp, FileText, Plus, ArrowUpRight, Layers, Lock, LogOut 
} from 'lucide-react';
import { Button } from './ui/Button';

export const Dashboard: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Analyze Deal');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-element", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleTabClick = (label: string) => {
    if (label === 'Fair Price Check') {
      setActiveTab(label);
    } else if (label === 'Analyze New Deal') {
    } else {
      alert(`${label} is coming soon in the Premium tier.`);
    }
  };

  const savedDeals = [
    { title: "Oberoi Sky City, Borivali", price: "₹3.8 Cr", score: "9.2", date: "2 hrs ago" },
    { title: "Lodha World Tower, Lower Parel", price: "₹8.5 Cr", score: "7.8", date: "Yesterday" },
    { title: "Rustomjee Paramount, Khar", price: "₹5.2 Cr", score: "8.5", date: "2 days ago" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#080808] text-white flex font-sans selection:bg-luxury-gold selection:text-black">
      
      <aside className="w-64 bg-[#0C0C0C] border-r border-white/5 hidden lg:flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
            <div className="w-6 h-6 border border-luxury-gold rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-luxury-gold" />
            </div>
            <span className="text-xl font-serif tracking-wider text-white ml-3">AURA</span>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1">
            <div className="px-4 mb-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Main Menu</div>
            {[
               { icon: BarChart2, label: 'Fair Price Check', active: true },
               { icon: TrendingUp, label: 'Future Trends' },
               { icon: MapPin, label: 'Area Analysis' },
               { icon: Activity, label: 'Demand Heatmap' },
               { icon: FileText, label: 'Transaction Logs' }
            ].map((item, i) => (
               <button 
                 key={i} 
                 onClick={() => handleTabClick(item.label)}
                 className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all duration-300 ${
                   item.active 
                     ? 'bg-luxury-gold text-luxury-black font-semibold shadow-[0_0_20px_rgba(217,164,65,0.2)]' 
                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <item.icon size={16} />
                 <span>{item.label}</span>
               </button>
            ))}
        </div>

        <div className="p-6 border-t border-white/5">
             <button 
               onClick={() => onNavigate('home')} 
               className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm w-full"
             >
                 <LogOut size={16} />
                 <span>Log Out</span>
             </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col relative">
        
        <header className="h-20 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 flex items-center justify-between px-6 md:px-10">
           <div className="flex items-center gap-4 lg:hidden">
               <Menu className="text-white" />
               <span className="text-xl font-serif tracking-wider text-white">AURA</span>
           </div>

           <div className="hidden md:block flex-1 max-w-xl relative mx-4">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <input 
                 type="text" 
                 placeholder="Search property, location or developer..." 
                 className="w-full bg-[#141414] border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-luxury-gold/50 transition-colors"
               />
           </div>

           <div className="flex items-center gap-6">
              <button className="relative text-gray-400 hover:text-white transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-luxury-gold rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                  <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-white">Arjun Verma</p>
                      <p className="text-[10px] text-luxury-gold uppercase tracking-wider">Premium Agent</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-luxury-gold to-[#8a6b29] flex items-center justify-center text-luxury-black font-bold text-sm">
                      AV
                  </div>
              </div>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 dash-element">
               <div>
                   <h1 className="text-3xl font-serif text-white mb-1">Dashboard</h1>
                   <p className="text-gray-400 text-sm font-light">Welcome back, here's your market pulse for Mumbai.</p>
               </div>
               <Button variant="primary" className="shadow-[0_0_30px_rgba(217,164,65,0.3)] hover:shadow-[0_0_50px_rgba(217,164,65,0.5)] transition-shadow">
                   <Plus size={16} className="mr-2 inline-block" /> Analyze New Deal
               </Button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               <div className="lg:col-span-2 space-y-8">
                   
                   <div className="bg-[#121212] border border-white/10 rounded-sm p-8 relative overflow-hidden dash-element group hover:border-luxury-gold/30 transition-colors duration-500">
                       <div className="absolute top-0 right-0 p-4">
                           <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">+5% vs Last Week</div>
                       </div>
                       
                       <div className="flex flex-col md:flex-row items-center gap-10">
                           <div className="relative w-48 h-24 flex-shrink-0">
                               <div className="absolute inset-0 w-full h-48 rounded-full border-[12px] border-[#1F1F1F] border-b-0 border-l-0 border-r-0" style={{ borderRadius: '50% 50% 0 0' }}></div>
                               <div className="absolute inset-0 w-full h-48 rounded-full border-[12px] border-transparent border-t-luxury-gold" style={{ borderRadius: '50% 50% 0 0', transform: 'rotate(-45deg)' }}></div>
                               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                                   <span className="text-4xl font-serif text-white">8.5</span>
                                   <span className="text-xs text-gray-500 block uppercase tracking-wider">/ 10</span>
                               </div>
                           </div>
                           
                           <div>
                               <h3 className="text-xl text-white font-medium mb-2">Deal Confidence Score</h3>
                               <p className="text-gray-400 text-sm leading-relaxed font-light">
                                   Your recent searches in <span className="text-white">Bandra West</span> indicate a strong buyer's market. Properties are trading <span className="text-green-400">4-6% below</span> asking price.
                               </p>
                           </div>
                       </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dash-element">
                       {[
                           { label: "Analyze Deal", icon: Search, desc: "Instant valuation check" },
                           { label: "Compare Properties", icon: Layers, desc: "Side-by-side analysis" },
                           { label: "Buyer Summary", icon: FileText, desc: "Generate PDF report" },
                           { label: "Saved Deals", icon: Activity, desc: "View shortlisted units" }
                       ].map((action, i) => (
                           <button key={i} className="bg-[#121212] border border-white/5 p-6 rounded-sm text-left hover:bg-white/5 hover:border-luxury-gold/30 transition-all group">
                               <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-luxury-gold mb-4 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors">
                                   <action.icon size={18} />
                               </div>
                               <h4 className="text-white font-medium mb-1">{action.label}</h4>
                               <p className="text-xs text-gray-500">{action.desc}</p>
                           </button>
                       ))}
                   </div>

               </div>

               <div className="bg-[#121212] border border-white/10 rounded-sm p-0 h-full flex flex-col dash-element overflow-hidden">
                   <div className="p-6 border-b border-white/5 flex justify-between items-center">
                       <h3 className="text-white font-serif text-lg">Saved Deals</h3>
                       <button className="text-xs text-luxury-gold hover:text-white transition-colors uppercase tracking-wider font-bold">View All</button>
                   </div>

                   <div className="flex-1 overflow-y-auto">
                       {savedDeals.map((deal, i) => (
                           <div key={i} className="p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                               <div className="flex justify-between items-start mb-2">
                                   <h4 className="text-white font-medium text-sm group-hover:text-luxury-gold transition-colors">{deal.title}</h4>
                                   <span className="bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold px-2 py-0.5 rounded">{deal.score}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                   <p className="text-gray-400 text-xs">{deal.price}</p>
                                   <p className="text-gray-600 text-[10px]">{deal.date}</p>
                               </div>
                           </div>
                       ))}

                       <div className="relative p-6 opacity-50 filter blur-[2px] pointer-events-none select-none">
                           <div className="flex justify-between items-start mb-2">
                               <h4 className="text-white font-medium text-sm">Premium Deal #4</h4>
                               <span className="bg-gray-800 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded">--</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <p className="text-gray-400 text-xs">₹-- Cr</p>
                               <p className="text-gray-600 text-[10px]">1 week ago</p>
                           </div>
                       </div>
                       
                       <div className="p-8 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-[#1a1a1a]/80">
                           <div className="w-10 h-10 mx-auto bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center mb-3">
                               <Lock size={16} />
                           </div>
                           <p className="text-gray-400 text-xs mb-4">Unlock unlimited history with Premium</p>
                           <button className="w-full py-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
                               Upgrade Plan
                           </button>
                       </div>
                   </div>
               </div>

           </div>
        </div>
      </main>

    </div>
  );
};