import React, { useState, useEffect } from 'react';

const SmartDevelopment: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobil menu00fc au00e7u0131ldu0131u011fu0131nda body scroll'u engelleme
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Component unmount olduu011funda overflow'u su0131fu0131rla
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Link iu00e7in fonksiyon ekliyorum
  const scrollToSection = (id: string) => {
    // u00d6nce mobil menu00fcyu00fc kapat
    setIsMobileMenuOpen(false);
    
    // Menu00fcnu00fcn kapanmasu0131 iu00e7in ku0131sa bir gecikme ekle (mobil iu00e7in u00f6nemli)
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Header yu00fcksekliu011fini hesaba katmak iu00e7in dou011frudan scrollIntoView kullanmu0131yoruz
        // Mobil cihazlar iu00e7in farklu0131 offset deu011feri kullanu0131yoruz
        const isMobile = window.innerWidth < 768;
        const headerOffset = isMobile ? 80 : 150; // Mobil iu00e7in daha az offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        // Scroll iu015flemini daha yumuu015fak hale getirmek iu00e7in smooth behavior kullanu0131yoruz
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100); // Ku0131sa bir gecikme ekliyoruz
  };

  // URL'deki hash deu011ferini kontrol eden fonksiyon
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      // Sayfanu0131n tam olarak yu00fcklenmesi iu00e7in biraz bekliyoruz
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const isMobile = window.innerWidth < 768;
          const headerOffset = isMobile ? 80 : 150; // Mobil iu00e7in daha az offset
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
      {/* Ana u0130u00e7erik */}
      <div className="pt-20">
        {/* Sayfa u0130u00e7i Navigasyon */}
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
        
        {/* Mobil Menu00fc */}
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
                <button className="bg-primary hover:bg-primary/80 text-heading px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 mt-4">
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        )}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-primary/10 rounded-2xl overflow-hidden shadow-xl border border-primary/20">
            <div className="h-72 sm:h-96 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                alt="Smart Development Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-slate-900/50 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 sm:px-8">
                  <div className="max-w-lg">
                    <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-4 drop-shadow-lg">
                      <span className="text-primary">Smart</span> Development
                    </h1>
                    <p className="text-xl text-text mb-8 drop-shadow">
                      Innovative urban development projects shaping the future of modern living spaces.
                    </p>
                    <button className="bg-primary hover:bg-primary/80 text-heading px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      Explore Projects
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="mt-16" id="services">
            <h2 className="text-3xl font-bold text-heading mb-6 border-l-4 border-primary pl-4">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="h-36 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Urban Planning" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Urban Planning</h3>
                <p className="text-text">Strategic urban development solutions that integrate modern infrastructure with ecological sustainability.</p>
              </div>
              
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="h-36 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1597424216809-3ba9864aef26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Smart Infrastructure" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Smart Infrastructure</h3>
                <p className="text-text">Integrating cutting-edge technology with physical infrastructure to create efficient, connected urban environments.</p>
              </div>
              
              <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all border border-primary/20">
                <div className="h-36 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Sustainable Design" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <h3 className="text-xl font-semibold text-heading mb-2">Sustainable Design</h3>
                <p className="text-text">Environmentally conscious approaches to development that minimize ecological footprint while maximizing livability.</p>
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="mt-16 bg-primary/10 rounded-2xl p-8 border border-primary/20" id="about">
            <h2 className="text-3xl font-bold text-heading mb-6">About Smart Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-text mb-4">
                  At Smart Development, we pioneer innovative approaches to urban planning and development that merge technological advancement with human-centered design principles.
                </p>
                <p className="text-text">
                  Our mission is to create intelligent, sustainable living spaces that enhance quality of life while minimizing environmental impact through thoughtful integration of smart technologies and green infrastructure.
                </p>
              </div>
              <div className="bg-primary/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-accent mb-4">Our Approach</h3>
                <ul className="space-y-2 text-text">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">u2713</span> 
                    Data-driven urban planning and development
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">u2713</span> 
                    Integration of renewable energy systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">u2713</span> 
                    Smart mobility and transportation solutions
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">u2713</span> 
                    Community-focused development strategies
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-16" id="contact">
            <h2 className="text-3xl font-bold text-heading mb-6 border-l-4 border-accent pl-4">Connect With Us</h2>
            <div className="bg-primary/10 rounded-2xl p-8 border border-secondary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-accent mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-text">Smart Development Headquarters</p>
                        <p className="text-text">Istanbul, Turkey</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-text">+90 212 555 9876</p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-text">info@smartdevelopment.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-accent mb-4">Project Inquiry</h3>
                  <p className="text-text mb-6">
                    Interested in learning more about our smart development projects or exploring partnership opportunities?
                  </p>
                  <button className="bg-accent hover:bg-accent/80 text-black px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                    Start a Conversation
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

export default SmartDevelopment;
