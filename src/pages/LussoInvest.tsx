import React, { useState, useEffect } from 'react';

const LussoInvest: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobil menü açıldığında body scroll'u engelleme
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Component unmount olduğunda overflow'u sıfırla
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Link için fonksiyon ekliyorum
  const scrollToSection = (id: string) => {
    // Önce mobil menüyü kapat
    setIsMobileMenuOpen(false);
    
    // Menünün kapanması için kısa bir gecikme ekle (mobil için önemli)
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Header yüksekliğini hesaba katmak için offset değeri kullanıyoruz
        const isMobile = window.innerWidth < 768;
        const headerOffset = isMobile ? 80 : 150; // Mobil için daha az offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100); // Kısa bir gecikme ekliyoruz
  };

  // URL hash değişimini izleyen useEffect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      // Sayfa tam yüklenince scroll yapalım
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const isMobile = window.innerWidth < 768;
          const headerOffset = isMobile ? 80 : 150; // Mobil için daha az offset
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-text">
      {/* Ana İçerik */}
      <div className="pt-20">
        {/* Sayfa İçi Navigasyon */}
        <div className="container mx-auto px-4 pb-6">
          <div className="flex justify-center flex-wrap space-x-4">
            <button onClick={() => scrollToSection('services')} className="text-text hover:text-accent transition-colors px-3 py-2 hover:border-b-2 hover:border-accent">
              Services
            </button>
            <button onClick={() => scrollToSection('about')} className="text-text hover:text-accent transition-colors px-3 py-2 hover:border-b-2 hover:border-accent">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-text hover:text-accent transition-colors px-3 py-2 hover:border-b-2 hover:border-accent">
              Contact
            </button>
            <button className="bg-primary hover:bg-primary/80 text-heading px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ml-4">
              Get a Quote
            </button>
          </div>
        </div>
        
        {/* Mobil Menü */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-64 bg-primary/20 border-l border-accent/30 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-text hover:text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-text hover:text-accent transition-colors py-2 border-b border-amber-800/20"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-text hover:text-accent transition-colors py-2 border-b border-amber-800/20"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-text hover:text-accent transition-colors py-2 border-b border-amber-800/20"
                >
                  Contact
                </button>
                <button className="bg-primary hover:bg-primary/80 text-heading px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 mt-4">
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        )}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-primary/10 rounded-2xl overflow-hidden shadow-xl border border-amber-800/20">
            <div className="h-72 sm:h-96 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=1200" 
                alt="Lusso Invest Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 sm:px-8">
                  <div className="max-w-lg">
                    <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-4 drop-shadow-lg">
                      <span className="text-accent">Lusso</span> Invest
                    </h1>
                    <p className="text-xl text-gray-100 mb-8 drop-shadow">
                      Strategic investment solutions for high-value opportunities in the Georgian market.
                    </p>
                    <button className="bg-primary hover:bg-primary/80 text-heading px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      Explore Opportunities
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="mt-16" id="services">
            <h2 className="text-3xl font-bold text-heading mb-6 border-l-4 border-primary pl-4">Investment Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="text-accent mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Secure Investments</h3>
                <p className="text-text">Carefully vetted investment opportunities with comprehensive risk assessment and management strategies.</p>
              </div>
              
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="text-accent mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Portfolio Diversification</h3>
                <p className="text-text">Strategic asset allocation across various sectors to optimize returns while managing market volatility.</p>
              </div>
              
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="text-accent mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Wealth Management</h3>
                <p className="text-text">Comprehensive wealth management services tailored to high-net-worth individuals and institutional investors.</p>
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="mt-16 bg-primary/10 rounded-2xl p-8 border border-primary/20" id="about">
            <h2 className="text-3xl font-bold text-heading mb-6">About Lusso Invest</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-text mb-4">
                  Lusso Invest specializes in identifying and securing high-yield investment opportunities in the Georgian market, offering our clients exclusive access to premium real estate, development projects, and strategic business ventures.
                </p>
                <p className="text-text">
                  With our deep local market knowledge and extensive international network, we provide bespoke investment solutions that align with our clients' financial goals and risk profiles.
                </p>
              </div>
              <div className="bg-primary/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-accent mb-4">Investment Philosophy</h3>
                <ul className="space-y-2 text-text">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> 
                    Due diligence and thorough market analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> 
                    Focus on long-term sustainable growth
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> 
                    Transparent investment structures
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> 
                    Active risk management and monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-16" id="contact">
            <h2 className="text-3xl font-bold text-heading mb-6 border-l-4 border-primary pl-4">Contact Our Investment Team</h2>
            <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-accent mb-4">Investment Inquiry</h3>
                  <p className="text-text mb-6">
                    Our investment specialists are ready to discuss your financial goals and provide personalized investment strategies.
                  </p>
                  <button className="bg-primary hover:bg-primary/80 text-heading px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                    Schedule a Consultation
                  </button>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-accent mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-text">+995 32 222 1234</p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-text">investments@lussoinvest.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LussoInvest;
