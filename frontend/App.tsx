import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureBlock } from './components/FeatureBlock';
import { StatsSection } from './components/StatsSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { PropertyFeature, Page } from './types';

gsap.registerPlugin(ScrollTrigger);

const features: PropertyFeature[] = [
  {
    id: '1',
    label: 'AI Valuation Engine',
    title: 'Precision pricing, powered by neural networks.',
    description: 'Unlike standard AVMs, Aura analyzes interior finishes, view corridors, and historical renovation data to predict luxury property values with 99.4% accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
    alignment: 'right'
  },
  {
    id: '2',
    label: 'Automated Matchmaking',
    title: 'Connect the perfect buyer before listing.',
    description: 'Our proprietary algorithms scan your CRM and global wealth databases to identify high-net-worth individuals actively searching for properties like yours.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop',
    alignment: 'left'
  },
  {
    id: '3',
    label: 'Predictive Staging',
    title: 'Visualise potential without the overhead.',
    description: 'Generate photorealistic, physically accurate virtual staging for empty spaces in seconds. Showcase varied interior styles tailored to specific buyer personas.',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop',
    alignment: 'right'
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Global fade in
    gsap.to("body", { opacity: 1, duration: 0.8, ease: "power2.in" });
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="antialiased bg-luxury-black text-luxury-text selection:bg-luxury-gold selection:text-luxury-black font-sans min-h-screen flex flex-col">
      <div className="noise-overlay"></div>
      
      {/* Conditionally render Navbar based on page for cleaner look on Auth, 
          but requirements usually imply standard nav availability. 
          We'll pass the navigation handler. */}
      {currentPage === 'home' && <Navbar onNavigate={setCurrentPage} />}

      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero />
            <StatsSection />
            
            {/* White Background Section for Features */}
            <div className="bg-white relative z-20 rounded-t-[30px] md:rounded-t-[60px] -mt-12 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] pt-12 pb-12">
              <div className="w-12 h-1 bg-gray-200 mx-auto rounded-full mb-20 opacity-50"></div>
              
              {features.map((feature, index) => (
                <FeatureBlock key={feature.id} feature={feature} index={index} />
              ))}
            </div>

            <CtaBanner />
          </>
        )}

        {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
        
        {currentPage === 'signup' && <SignupPage onNavigate={setCurrentPage} />}
      </main>

      {/* Footer only on Home page to keep auth pages focused */}
      {currentPage === 'home' && <Footer />}
      
      {/* Simple copyright footer for auth pages */}
      {currentPage !== 'home' && (
        <div className="absolute bottom-4 w-full text-center z-10 pointer-events-none">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">© 2024 Aura Estate AI</p>
        </div>
      )}
    </div>
  );
};

export default App;