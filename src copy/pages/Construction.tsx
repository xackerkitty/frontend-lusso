import React, { useEffect, useState } from 'react';

const Construction: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('residence');
  
  // Sayfa içi navigasyon için scroll fonksiyonu
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Header yüksekliğini hesaba katmak için offset değeri kullanıyoruz
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // URL'deki hash değişikliğini izleme
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      scrollToSection(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-gray-300">
      {/* Sayfa İçi Navigasyon */}
      <div className="container mx-auto px-4 py-6 mt-24">
        <div className="flex justify-center space-x-6 mb-8">
          <button 
            onClick={() => scrollToSection('residence')} 
            className={`text-gray-300 hover:text-primary transition-colors duration-200 px-3 py-2 ${activeSection === 'residence' ? 'border-b-2 border-primary text-primary' : 'hover:border-b-2 hover:border-primary'}`}
          >
            Residence
          </button>
          <button 
            onClick={() => scrollToSection('property')} 
            className={`text-gray-300 hover:text-primary transition-colors duration-200 px-3 py-2 ${activeSection === 'property' ? 'border-b-2 border-primary text-primary' : 'hover:border-b-2 hover:border-primary'}`}
          >
            Property
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className={`text-gray-300 hover:text-primary transition-colors duration-200 px-3 py-2 ${activeSection === 'about' ? 'border-b-2 border-primary text-primary' : 'hover:border-b-2 hover:border-primary'}`}
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className={`text-gray-300 hover:text-primary transition-colors duration-200 px-3 py-2 ${activeSection === 'contact' ? 'border-b-2 border-primary text-primary' : 'hover:border-b-2 hover:border-primary'}`}
          >
            Contact Us
          </button>
        </div>

        {/* Hero Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">LUSSO Construction</h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Lüks konut ve ticari gayrimenkul projeleri. Yüksek kalite standartları ve modern tasarım yaklaşımımızla inşa edilen prestijli projeler.
            </p>
            <button className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Projelerimizi Keşfedin
            </button>
          </div>
        </div>

        {/* Residence Section */}
        <div id="residence" className="mb-24">
          <h2 className="text-3xl font-semibold text-white mb-6 border-l-4 border-primary pl-4">Residence Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Proje Kartları */}
            <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all transform hover:-translate-y-1 border border-primary/30">
              <div className="h-48 rounded-md overflow-hidden mb-4 bg-gradient-to-br from-[#0e4e25]/20 to-[#0e4e25]/50">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Lusso Residence" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lusso Heights</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">Lüks daireler ve dubleks seçenekleriyle modern yaşam alanı.</p>
              <div className="flex justify-between items-center">
                <span className="text-accent font-semibold">$1.2M - $4.5M</span>
                <button className="text-sm bg-primary hover:bg-secondary text-white px-3 py-1 rounded transition-colors">
                  Detaylar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Section */}
        <div id="property" className="mb-24">
          <h2 className="text-3xl font-semibold text-white mb-6 border-l-4 border-accent pl-4">Commercial Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ticari Gayrimenkul Kartları */}
            <div className="bg-primary/10 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-6 transition-all hover:-translate-y-1 border border-accent/30">
              <div className="h-48 rounded-md overflow-hidden mb-4 bg-gradient-to-br from-[#0e4e25]/20 to-[#0e4e25]/50">
                <img src="https://images.unsplash.com/photo-1606836576983-8b458e75221d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" alt="Lusso Business Center" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lusso Business Center</h3>
              <p className="text-gray-400 mb-4">Modern ofis kompleksi ve ticari alanlar. A+ sınıfı iş merkezi.</p>
              <div className="flex justify-between items-center">
                <span className="text-accent font-semibold">5,000 - 20,000 m²</span>
                <button className="text-sm bg-primary hover:bg-secondary text-white px-3 py-1 rounded transition-colors">
                  Detaylar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mb-24">
          <h2 className="text-3xl font-semibold text-white mb-6 border-l-4 border-accent pl-4">About Us</h2>
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-8 border border-accent/30">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold text-accent mb-4">Lusso Kalitesi</h3>
                <p className="text-gray-300 mb-4">
                  2010 yılından bu yana lüks gayrimenkul sektöründe faaliyet gösteren Lusso Construction, her projede en yüksek kalite standartlarını ve inovasyonu bir araya getiriyor.
                </p>
                <p className="text-gray-300 mb-4">
                  Sürdürülebilir mimari, yenilikçi tasarım ve üstün malzeme kalitesi ile gerçekleştirdiğimiz projelerde modern yaşamın tüm beklentilerini karşılıyoruz.
                </p>
                <div className="flex space-x-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">25+</div>
                    <div className="text-sm text-gray-400">Tamamlanan Proje</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">750K+</div>
                    <div className="text-sm text-gray-400">m² İnşaat Alanı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">15+</div>
                    <div className="text-sm text-gray-400">Ülkede Varlık</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-[#0e4e25]/20 to-[#0e4e25]/50 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Lusso Construction Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="mb-24">
          <h2 className="text-3xl font-semibold text-white mb-6 border-l-4 border-accent pl-4">Contact Us</h2>
          <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-8 border border-accent/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-6">
                  İnşaat ve gayrimenkul ihtiyaçlarınızla ilgili sorularınız için bize ulaşın. Danışmanlık hizmeti veya projelerimiz hakkında daha fazla bilgi almak için bizi arayabilirsiniz.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-accent mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Email</div>
                      <div className="text-gray-300">info@lussoconstruction.com</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-accent mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Telefon</div>
                      <div className="text-gray-300">+90 (212) 555-1234</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-accent mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Adres</div>
                      <div className="text-gray-300">Levent, 34330 Beşiktaş/İstanbul</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/15 rounded-lg p-6">
                <h3 className="text-xl font-medium text-accent mb-4">Bilgi Talebi</h3>
                <div className="space-y-4">
                  <button className="w-full bg-accent hover:bg-accent/80 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                    Danışmanlık Talebi
                  </button>
                  <p className="text-gray-400 text-sm text-center italic">
                    Temsilcimiz 24 saat içinde sizinle iletişime geçecektir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Construction;
