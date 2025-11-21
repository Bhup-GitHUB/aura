import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NavigationProps } from "../types";
import {
  Search,
  Bell,
  Menu,
  BarChart2,
  MapPin,
  Activity,
  TrendingUp,
  FileText,
  Plus,
  Layers,
  Lock,
  LogOut,
  CheckCircle,
  Clock,
  LineChart,
  Sparkles,
  ChevronDown,
  User,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { authService } from "../src/services/auth.service";

type DashboardView =
  | "overview"
  | "analyze"
  | "analyzing"
  | "result"
  | "coming-soon"
  | "market-trends"
  | "smart-invest";

const marketData = [
  { year: "2021", mumbai: 32000, bangalore: 18000, delhi: 22000 },
  { year: "2022", mumbai: 34500, bangalore: 21000, delhi: 23500 },
  { year: "2023", mumbai: 38000, bangalore: 23500, delhi: 25000 },
  { year: "2024", mumbai: 40500, bangalore: 25000, delhi: 26500 },
  { year: "2025", mumbai: 42500, bangalore: 27000, delhi: 28000 },
];

export const Dashboard: React.FC<NavigationProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [comingSoonTitle, setComingSoonTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const [formData, setFormData] = useState({
    place: "",
    price: "",
    sqft: "",
    type: "",
    furniture: "",
  });

  const currentData =
    marketData.find((d) => d.year === selectedYear) ||
    marketData[marketData.length - 1];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dash-element",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = authService.getUser();
      if (currentUser) {
        setUser(currentUser);
        try {
          const profile = await authService.getProfile();
          if (profile.success && profile.data) {
            setUser(profile.data);
          }
        } catch (err) {
          // Use stored user if profile fetch fails
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === "market-trends") {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".chart-line",
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 2, ease: "power3.out", stagger: 0.2 }
        );
        gsap.fromTo(
          ".chart-dot",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 1.5,
            stagger: 0.05,
            ease: "back.out(1.7)",
          }
        );
      }, contentRef);
      return () => ctx.revert();
    }
  }, [currentView]);

  const handleSidebarClick = (view: DashboardView, title: string = "") => {
    if (view === "coming-soon") {
      setComingSoonTitle(title);
    }
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const handleAnalyzeSubmit = () => {
    setCurrentView("analyzing");
    setTimeout(() => {
      setCurrentView("result");
    }, 3000);
  };

  const handleLogout = () => {
    authService.logout();
    onNavigate("home");
  };

  const savedDeals = [
    {
      title: "Oberoi Sky City, Borivali",
      price: "₹3.8 Cr",
      score: "9.2",
      date: "2 hrs ago",
    },
    {
      title: "Lodha World Tower, Lower Parel",
      price: "₹8.5 Cr",
      score: "7.8",
      date: "Yesterday",
    },
    {
      title: "Rustomjee Paramount, Khar",
      price: "₹5.2 Cr",
      score: "8.5",
      date: "2 days ago",
    },
  ];

  const getY = (val: number) => {
    const max = 45000;
    const height = 400;
    return height - (val / max) * height + 50;
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 dash-element">
              <div>
                <h1 className="text-3xl font-serif text-white mb-1">
                  Market Pulse
                </h1>
                <p className="text-gray-400 text-sm font-light">
                  Overview of your recent activity and market trends.
                </p>
              </div>
              <Button
                variant="primary"
                className="shadow-[0_0_30px_rgba(217,164,65,0.3)] hover:shadow-[0_0_50px_rgba(217,164,65,0.5)] transition-shadow group w-full md:w-auto"
                onClick={() => setCurrentView("analyze")}
              >
                <Plus
                  size={16}
                  className="mr-2 inline-block group-hover:rotate-90 transition-transform"
                />{" "}
                Analyze New Deal
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[#121212] border border-white/10 rounded-sm p-8 relative overflow-hidden dash-element group hover:border-luxury-gold/30 transition-colors duration-500">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                      <TrendingUp size={10} /> +5% vs Last Week
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-48 h-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
                      <div
                        className="absolute inset-0 w-full h-48 rounded-full border-[12px] border-[#1F1F1F] border-b-0 border-l-0 border-r-0"
                        style={{ borderRadius: "50% 50% 0 0" }}
                      ></div>
                      <div
                        className="absolute inset-0 w-full h-48 rounded-full border-[12px] border-transparent border-t-luxury-gold drop-shadow-[0_0_10px_rgba(217,164,65,0.5)]"
                        style={{
                          borderRadius: "50% 50% 0 0",
                          transform: "rotate(-45deg)",
                        }}
                      ></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <span className="text-4xl font-serif text-white">
                          8.5
                        </span>
                        <span className="text-xs text-gray-500 block uppercase tracking-wider">
                          / 10
                        </span>
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl text-white font-medium mb-2">
                        Deal Confidence Score
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        Your recent searches in{" "}
                        <span className="text-white">Bandra West</span> indicate
                        a strong buyer's market.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dash-element">
                  <button
                    onClick={() => setCurrentView("analyze")}
                    className="bg-[#121212] border border-white/5 p-6 rounded-sm text-left hover:bg-white/5 hover:border-luxury-gold/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-luxury-gold mb-4 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors shadow-lg">
                      <Search size={18} />
                    </div>
                    <h4 className="text-white font-medium mb-1">
                      Analyze Deal
                    </h4>
                    <p className="text-xs text-gray-500">
                      Instant valuation check
                    </p>
                  </button>
                  {[
                    {
                      label: "Compare Properties",
                      icon: Layers,
                      desc: "Side-by-side analysis",
                    },
                    {
                      label: "Buyer Summary",
                      icon: FileText,
                      desc: "Generate PDF report",
                    },
                    {
                      label: "Saved Deals",
                      icon: Activity,
                      desc: "View shortlisted units",
                    },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSidebarClick("coming-soon", action.label)
                      }
                      className="bg-[#121212] border border-white/5 p-6 rounded-sm text-left hover:bg-white/5 hover:border-luxury-gold/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-luxury-gold mb-4 group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors shadow-lg">
                        <action.icon size={18} />
                      </div>
                      <h4 className="text-white font-medium mb-1">
                        {action.label}
                      </h4>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#121212] border border-white/10 rounded-sm p-0 h-full flex flex-col dash-element overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="text-white font-serif text-lg">Saved Deals</h3>
                  <button className="text-xs text-luxury-gold hover:text-white transition-colors uppercase tracking-wider font-bold">
                    View All
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {savedDeals.map((deal, i) => (
                    <div
                      key={i}
                      className="p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium text-sm group-hover:text-luxury-gold transition-colors">
                          {deal.title}
                        </h4>
                        <span className="bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold px-2 py-0.5 rounded border border-luxury-gold/20">
                          {deal.score}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-xs font-mono">
                          {deal.price}
                        </p>
                        <p className="text-gray-600 text-[10px] flex items-center gap-1">
                          <Clock size={10} /> {deal.date}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="p-8 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-[#0f0f0f]">
                    <div className="w-10 h-10 mx-auto bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mb-3 border border-luxury-gold/20">
                      <Lock size={16} />
                    </div>
                    <p className="text-gray-400 text-xs mb-4">
                      Unlock unlimited history
                    </p>
                    <button className="w-full py-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "market-trends":
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8 dash-element">
              <h1 className="text-3xl font-serif text-white mb-2">
                City Price Trends
              </h1>
              <p className="text-gray-400 text-sm font-light">
                Comparative analysis of property prices (Avg. ₹/Sq. Ft) across
                major Indian hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-sm p-6 md:p-10 relative overflow-hidden dash-element flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="flex flex-wrap justify-between items-center mb-8 gap-4 z-10">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(217,164,65,0.5)]"></div>
                      <span className="text-xs text-gray-300">Mumbai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#2D6DF6] shadow-[0_0_10px_rgba(45,109,246,0.5)]"></div>
                      <span className="text-xs text-gray-300">Bangalore</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#1EE3B3] shadow-[0_0_10px_rgba(30,227,179,0.5)]"></div>
                      <span className="text-xs text-gray-300">Delhi NCR</span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-[350px] sm:h-[400px] z-10">
                  <svg
                    viewBox="0 0 1000 500"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <filter
                        id="glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite
                          in="SourceGraphic"
                          in2="blur"
                          operator="over"
                        />
                      </filter>
                    </defs>

                    <g className="chart-grid opacity-30">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={i}>
                          <line
                            x1="50"
                            y1={100 * i + 50}
                            x2="950"
                            y2={100 * i + 50}
                            stroke="#333"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                          />
                          <text
                            x="10"
                            y={100 * i + 55}
                            fill="#666"
                            fontSize="12"
                            fontFamily="monospace"
                          >
                            ₹{45 - i * 10}k
                          </text>
                        </g>
                      ))}
                    </g>

                    <polyline
                      points={marketData
                        .map((d, i) => `${225 * i + 50},${getY(d.mumbai)}`)
                        .join(" ")}
                      fill="none"
                      stroke="#D9A441"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="chart-line"
                    />

                    <polyline
                      points={marketData
                        .map((d, i) => `${225 * i + 50},${getY(d.bangalore)}`)
                        .join(" ")}
                      fill="none"
                      stroke="#2D6DF6"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="chart-line"
                      opacity="0.7"
                    />

                    <polyline
                      points={marketData
                        .map((d, i) => `${225 * i + 50},${getY(d.delhi)}`)
                        .join(" ")}
                      fill="none"
                      stroke="#1EE3B3"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="chart-line"
                      opacity="0.7"
                    />

                    {marketData.map((d, i) => {
                      const x = 225 * i + 50;
                      const isSelected = selectedYear === d.year;
                      return (
                        <g
                          key={i}
                          onClick={() => setSelectedYear(d.year)}
                          className="cursor-pointer group"
                        >
                          <rect
                            x={x - 40}
                            y="50"
                            width="80"
                            height="450"
                            fill="transparent"
                          />

                          <text
                            x={x}
                            y="480"
                            fill={isSelected ? "#D9A441" : "#666"}
                            fontSize="14"
                            fontWeight={isSelected ? "bold" : "normal"}
                            textAnchor="middle"
                            fontFamily="monospace"
                            className="transition-colors duration-300 group-hover:fill-white"
                          >
                            {d.year}
                          </text>

                          <line
                            x1={x}
                            y1="50"
                            x2={x}
                            y2="460"
                            stroke={isSelected ? "#D9A441" : "transparent"}
                            strokeWidth="1"
                            strokeDasharray="4,4"
                            opacity={isSelected ? 0.5 : 0}
                            className="transition-all duration-300"
                          />

                          <circle
                            cx={x}
                            cy={getY(d.mumbai)}
                            r={isSelected ? 8 : 4}
                            fill="#121212"
                            stroke="#D9A441"
                            strokeWidth="2"
                            className={`transition-all duration-300 ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          />
                          <circle
                            cx={x}
                            cy={getY(d.bangalore)}
                            r={isSelected ? 6 : 3}
                            fill="#121212"
                            stroke="#2D6DF6"
                            strokeWidth="2"
                            className={`transition-all duration-300 ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          />
                          <circle
                            cx={x}
                            cy={getY(d.delhi)}
                            r={isSelected ? 6 : 3}
                            fill="#121212"
                            stroke="#1EE3B3"
                            strokeWidth="2"
                            className={`transition-all duration-300 ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/10 rounded-sm p-8 flex flex-col dash-element">
                <h3 className="text-white font-serif text-xl mb-6">
                  Market Snapshot:{" "}
                  <span className="text-luxury-gold">{selectedYear}</span>
                </h3>

                <div className="space-y-6">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Mumbai
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-serif text-white">
                        ₹{currentData.mumbai.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        High Demand
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Bangalore
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-serif text-white">
                        ₹{currentData.bangalore.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        Steady
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Delhi NCR
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-serif text-white">
                        ₹{currentData.delhi.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Recovering
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 text-center">
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    *Prices shown are weighted averages per Sq. Ft. for luxury
                    residential inventory.
                  </p>
                  <Button
                    className="w-full justify-center text-xs"
                    variant="outline"
                  >
                    Download {selectedYear} Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "smart-invest":
        return (
          <div className="h-full">
            <div className="mb-8 dash-element">
              <h1 className="text-3xl font-serif text-white mb-2">
                Top Investment Picks
              </h1>
              <p className="text-gray-400 text-sm font-light">
                Curated high-yield opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  loc: "Ulwe, Navi Mumbai",
                  desc: "Close proximity to upcoming MTHL & New Airport.",
                  roi: "+18%",
                  price: "₹8,500/sqft",
                  tags: ["Infrastructure"],
                },
                {
                  loc: "Hebbal, Bangalore",
                  desc: "Emerging tech corridor with new commercial SEZs.",
                  roi: "+14%",
                  price: "₹11,200/sqft",
                  tags: ["Commercial Hub"],
                },
                {
                  loc: "Dwarka, Delhi",
                  desc: "Completed connectivity boosting luxury segment.",
                  roi: "+22%",
                  price: "₹14,500/sqft",
                  tags: ["Luxury"],
                },
                {
                  loc: "Kharadi, Pune",
                  desc: "IT Park expansion driving residential demand.",
                  roi: "+12%",
                  price: "₹9,100/sqft",
                  tags: ["Steady"],
                },
                {
                  loc: "Gachibowli, Hyd",
                  desc: "Premium gated communities seeing record absorption.",
                  roi: "+16%",
                  price: "₹10,800/sqft",
                  tags: ["Premium"],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#121212] border border-white/10 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 group dash-element relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:rotate-12">
                    <Sparkles size={40} className="text-luxury-gold" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold tracking-wider uppercase bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors relative z-10">
                    {item.loc}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 h-10 relative z-10 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-6 relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Current Price
                      </p>
                      <p className="text-white font-medium font-mono">
                        {item.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Proj. ROI
                      </p>
                      <p className="text-green-400 font-bold font-mono">
                        {item.roi}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-xs py-3 relative z-10 group-hover:bg-luxury-gold group-hover:text-luxury-black group-hover:border-luxury-gold"
                  >
                    View Report
                  </Button>
                </div>
              ))}
              <div className="bg-[#121212]/50 border border-white/5 rounded-sm p-8 flex flex-col items-center justify-center text-center relative dash-element overflow-hidden group min-h-[320px]">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6 text-luxury-gold border border-luxury-gold/20 group-hover:scale-110 transition-transform duration-500">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">
                  Unlock More
                </h3>
                <p className="text-gray-500 text-sm mb-8 font-light">
                  Upgrade to Pro Investor.
                </p>
                <button className="text-luxury-gold text-xs font-bold uppercase tracking-widest border-b border-luxury-gold pb-1 hover:text-white hover:border-white transition-all">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        );

      case "analyze":
      case "analyzing":
      case "result":
      case "coming-soon":
        return (
          <div className="max-w-4xl mx-auto">
            {currentView === "analyze" && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">
                    Analyze New Deal
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Enter property details for instant valuation.
                  </p>
                </div>
                <div className="glass-panel p-6 md:p-10 border border-white/10 rounded-sm shadow-2xl">
                  <div className="space-y-6">
                    <Input
                      label="Location"
                      value={formData.place}
                      onChange={(e) =>
                        setFormData({ ...formData, place: e.target.value })
                      }
                    />
                    <Input
                      label="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Sq. Ft."
                        value={formData.sqft}
                        onChange={(e) =>
                          setFormData({ ...formData, sqft: e.target.value })
                        }
                      />
                      <Select
                        label="Type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        options={[
                          { value: "apartment", label: "Apartment" },
                          { value: "villa", label: "Villa" },
                        ]}
                      />
                    </div>
                    <Select
                      label="Furnishing"
                      value={formData.furniture}
                      onChange={(e) =>
                        setFormData({ ...formData, furniture: e.target.value })
                      }
                      options={[
                        { value: "unfurnished", label: "Unfurnished" },
                        { value: "fully", label: "Fully Furnished" },
                      ]}
                    />
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setCurrentView("overview")}
                      className="flex-1 py-3 border border-white/10 text-white text-xs font-bold uppercase hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <Button
                      className="flex-1 flex justify-center"
                      onClick={handleAnalyzeSubmit}
                    >
                      Analyze
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentView === "analyzing" && (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-luxury-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl text-white mb-2 animate-pulse">
                  Processing...
                </h3>
                <p className="text-gray-500 text-xs">
                  Analyzing {formData.place || "market"} data...
                </p>
              </div>
            )}

            {currentView === "result" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-[#121212] border border-white/10 rounded-sm p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-serif text-white">
                      Good Deal
                    </h2>
                    <div className="text-green-400 text-xs font-bold uppercase border border-green-500/20 px-2 py-1 rounded bg-green-500/10">
                      Undervalued
                    </div>
                  </div>
                  <div className="mb-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Est. Fair Value
                    </p>
                    <p className="text-3xl md:text-4xl font-serif text-white">
                      ₹4.8 - 5.1 Cr
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-sm p-4 space-y-4 mb-8">
                    <div className="flex gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 shrink-0"
                      />
                      <div>
                        <h4 className="text-white text-sm font-bold">
                          Price Advantage
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          8% below market average.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentView("overview")}
                      className="flex-1 justify-center"
                    >
                      Save
                    </Button>
                    <button
                      onClick={() => setCurrentView("analyze")}
                      className="flex-1 py-3 border border-white/10 text-white text-xs font-bold uppercase hover:bg-white/5"
                    >
                      Analyze New
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#121212] border border-white/10 p-6 rounded-sm">
                    <h4 className="text-white text-sm font-bold mb-2">
                      Risk Factors
                    </h4>
                    <p className="text-gray-400 text-xs">
                      Building age &gt; 15 years.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentView === "coming-soon" && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
                <Lock size={32} className="text-luxury-gold mb-6" />
                <h2 className="text-3xl font-serif text-white mb-4">
                  {comingSoonTitle}
                </h2>
                <p className="text-gray-400 max-w-md mb-8">
                  Module coming in next update.
                </p>
                <Button onClick={() => setCurrentView("overview")}>Back</Button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#080808] text-white flex font-sans selection:bg-luxury-gold selection:text-black"
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`w-64 bg-[#0C0C0C] border-r border-white/5 flex flex-col fixed h-full z-30 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="w-6 h-6 border border-luxury-gold rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-luxury-gold" />
          </div>
          <span className="text-xl font-serif tracking-wider text-white ml-3">
            AURA
          </span>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 mb-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Main Menu
          </div>
          <button
            onClick={() => handleSidebarClick("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all ${
              currentView === "overview" ||
              currentView === "result" ||
              currentView === "analyze"
                ? "bg-luxury-gold text-luxury-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BarChart2 size={16} />
            <span>Fair Price Check</span>
          </button>
          <button
            onClick={() => handleSidebarClick("market-trends")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all ${
              currentView === "market-trends"
                ? "bg-luxury-gold text-luxury-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LineChart size={16} />
            <span>City Trends</span>
          </button>
          <button
            onClick={() => handleSidebarClick("smart-invest")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all ${
              currentView === "smart-invest"
                ? "bg-luxury-gold text-luxury-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles size={16} />
            <span>Smart Invest</span>
          </button>

          <button
            onClick={() => onNavigate("properties")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all text-gray-400 hover:text-white"
          >
            <Search size={16} />
            <span>Properties</span>
          </button>

          <div className="px-4 mt-8 mb-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Advanced
          </div>
          {[
            { icon: TrendingUp, label: "Future Trends" },
            { icon: MapPin, label: "Area Analysis" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => handleSidebarClick("coming-soon", item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all ${
                currentView === "coming-soon" && comingSoonTitle === item.label
                  ? "bg-luxury-gold text-luxury-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm w-full"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col relative">
        <header className="h-20 bg-[#0C0C0C]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-20 flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="text-white" />
            </button>
            <span className="text-xl font-serif tracking-wider text-white">
              AURA
            </span>
          </div>

          <div className="hidden md:block flex-1 max-w-xl relative mx-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#141414] border border-white/10 rounded-full py-2 pl-12 pr-4 text-sm text-white focus:border-luxury-gold/50 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></span>
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 border-l border-white/10 pl-6 p-2 rounded-sm"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || "User"}
                  </p>
                  <p className="text-[10px] text-luxury-gold uppercase tracking-wider">
                    {user?.subscriptionTier || "Free"}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-luxury-gold to-[#8a6b29] flex items-center justify-center text-luxury-black font-bold text-sm">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                  {user?.lastName?.[0] || ""}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-sm shadow-2xl py-2 z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate("profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center gap-2"
                    >
                      <User size={14} /> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div
          ref={contentRef}
          className="p-4 md:p-10 w-full max-w-[1600px] mx-auto overflow-x-hidden"
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
