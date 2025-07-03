import React, { useEffect, useState } from 'react';

const BluControl: React.FC = () => {
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

  // Sayfa içi navigasyon için scroll fonksiyonu
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

  // URL'deki hash değerini kontrol etme
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      // Sayfanın yüklenmesi için bekle
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/5 to-primary/20 text-text">
      {/* Ana İçerik */}
      <div className="pt-20">
        {/* Sayfa İçi Navigasyon */}
        <div className="container mx-auto px-4 pb-6">
          <div className="flex justify-center flex-wrap space-x-4">
            <button onClick={() => scrollToSection('services')} className="text-text hover:text-primary transition-colors px-3 py-2 hover:border-b-2 hover:border-primary">
              Services
            </button>
            <button onClick={() => scrollToSection('about')} className="text-text hover:text-primary transition-colors px-3 py-2 hover:border-b-2 hover:border-primary">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-text hover:text-primary transition-colors px-3 py-2 hover:border-b-2 hover:border-primary">
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
            <div className="absolute right-0 top-0 h-full w-64 bg-primary/20 border-l border-primary/30 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-text hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-text hover:text-primary transition-colors py-2 border-b border-primary/20"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-text hover:text-primary transition-colors py-2 border-b border-primary/20"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-text hover:text-primary transition-colors py-2 border-b border-primary/20"
                >
                  Contact
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 mt-4">
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-primary/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-64 relative overflow-hidden"> 
              <img 
                src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?auto=format&fit=crop&q=80&w=1200" 
                alt="Blu Control Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-primary/10 to-transparent"></div>
            </div>
            
            <div className="p-8">
              <h1 className="text-4xl font-bold text-accent mb-4">Blu Control</h1>
              <p className="text-xl text-text mb-12">
                Advanced quality control and project management services ensuring excellence in every project.
              </p>

              {/* Services Section */}
              <div className="mb-12" id="services">
                <h2 className="text-3xl font-semibold text-heading mb-6 border-l-4 border-accent pl-4">Our Services</h2>
                <div className="bg-primary/20 p-6 rounded-xl">
                    <ul className="space-y-3 text-text">
                      <li className="flex items-start"><span className="text-accent mr-2">✓</span>Quality Assurance & Testing: Implementing rigorous testing protocols at every stage.</li>
                      <li className="flex items-start"><span className="text-accent mr-2">✓</span>Project Risk Assessment: Identifying potential pitfalls before they impact timelines or budgets.</li>
                      <li className="flex items-start"><span className="text-accent mr-2">✓</span>Compliance Monitoring: Ensuring all projects meet local and international regulations.</li>
                      <li className="flex items-start"><span className="text-accent mr-2">✓</span>Performance Optimization: Analyzing processes to enhance efficiency and output quality.</li>
                    </ul>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-16" id="about">
                <h2 className="text-3xl font-semibold text-heading mb-6 border-l-4 border-accent pl-4">Why Choose Us</h2>
                <div className="bg-primary/15 p-6 rounded-xl space-y-4">
                    <p className="text-text mb-4">At Blu Control, we combine technical expertise with rigorous methodologies to ensure your projects meet the highest standards of quality and performance. Our position within the Lusso Group gives us unique insights into luxury development needs.</p>
                    <p className="text-text">Our dedicated team of specialists work seamlessly with your organization, acting as an integrated control unit to identify potential issues before they arise and implement effective, proactive solutions. We are your partners in excellence.</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-10" id="contact">
                <h2 className="text-3xl font-semibold text-heading mb-6 border-l-4 border-accent pl-4">Contact Us</h2>
                 <div className="bg-primary/15 p-6 rounded-xl">
                   <p className="text-text mb-6">Ready to elevate your project's quality and ensure its success? Contact Blu Control today for a detailed consultation.</p>
                   <button className="bg-accent hover:bg-secondary text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                     Request a Consultation
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluControl;
