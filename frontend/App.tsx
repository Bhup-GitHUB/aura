import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeatureBlock } from "./components/FeatureBlock";
import { StatsSection } from "./components/StatsSection";
import { DashboardPreview } from "./components/DashboardPreview";
import { Pricing } from "./components/Pricing";
import { Testimonials } from "./components/Testimonials";
import { CtaBanner } from "./components/CtaBanner";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { PropertySearch } from "./components/PropertySearch";
import { PropertyFeature, Page } from "./types";
import { authService } from "./src/services/auth.service";

gsap.registerPlugin(ScrollTrigger);

const features: PropertyFeature[] = [
  {
    id: "1",
    label: "Fair Price Engine",
    title: "Overpriced or Under-valued? Know instantly.",
    description:
      'Stop relying on asking prices. Aura analyzes thousands of registered transactions in areas like Bandra, Worli, and Juhu to give you the true "Fair Market Value" of any apartment.',
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
    alignment: "right",
  },
  {
    id: "2",
    label: "Future Projection",
    title: "See the future of your investment.",
    description:
      "Our AI models factor in upcoming infrastructure (Metro lines, Coastal Road), commercial shifts, and historical appreciation to forecast property value 5 years down the line.",
    imageUrl:
      "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=2670&auto=format&fit=crop",
    alignment: "left",
  },
  {
    id: "3",
    label: "Lifestyle & Connectivity",
    title: "The metrics that actually matter.",
    description:
      "Beyond just Sq. Ft. Analysis. We grade properties on AQI levels, traffic congestion patterns, proximity to top IB schools, and social infrastructure density.",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop",
    alignment: "right",
  },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    gsap.to("body", { opacity: 1, duration: 0.8, ease: "power2.in" });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const protectedPages: Page[] = ["dashboard", "profile", "properties"];
    if (
      protectedPages.includes(currentPage) &&
      !authService.isAuthenticated()
    ) {
      setCurrentPage("login");
    }
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = (window.scrollY / scrollable) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="antialiased bg-luxury-black text-luxury-text selection:bg-luxury-gold selection:text-luxury-black font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="noise-overlay"></div>
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-[#050506] via-[#0b0c11] to-[#040405]" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(217,164,65,0.18) 0, transparent 32%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 0, transparent 28%), radial-gradient(circle at 70% 75%, rgba(217,164,65,0.12) 0, transparent 30%), linear-gradient(115deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      <div
        className="fixed inset-0 -z-[5] pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1), transparent 70%)",
        }}
      />
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[60] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-luxury-gold via-white to-luxury-gold transition-[width] duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {currentPage === "home" && <Navbar onNavigate={setCurrentPage} />}

      <main className="flex-grow">
        {currentPage === "home" && (
          <>
            <Hero />
            <StatsSection />

            <DashboardPreview />

            <div className="bg-white relative z-20 rounded-t-[30px] md:rounded-t-[60px] -mt-12 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] pt-20 pb-12">
              <div className="w-12 h-1 bg-gray-200 mx-auto rounded-full mb-20 opacity-50"></div>

              <div className="text-center mb-16 px-6">
                <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                  Capabilities
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-luxury-black">
                  Intelligence for the Indian Investor.
                </h2>
              </div>

              {features.map((feature, index) => (
                <FeatureBlock
                  key={feature.id}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>

            <Pricing />
            <Testimonials />
            <CtaBanner />
          </>
        )}

        {currentPage === "login" && <LoginPage onNavigate={setCurrentPage} />}

        {currentPage === "signup" && <SignupPage onNavigate={setCurrentPage} />}

        {currentPage === "dashboard" && (
          <Dashboard onNavigate={setCurrentPage} />
        )}

        {currentPage === "profile" && <Profile onNavigate={setCurrentPage} />}

        {currentPage === "properties" && (
          <PropertySearch onNavigate={setCurrentPage} />
        )}
      </main>

      {currentPage === "home" && <Footer />}

      {currentPage !== "home" && currentPage !== "dashboard" && (
        <div className="absolute bottom-4 w-full text-center z-10 pointer-events-none">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">
            © 2025 Aura MarketVision
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
