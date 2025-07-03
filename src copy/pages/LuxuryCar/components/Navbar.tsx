import React, { useState, useEffect } from 'react';

const navLinks = [
  { label: 'HOME', section: 'home' },
  { label: 'SHOWROOM', section: 'showroom' },
  { label: 'CARS', section: 'cars' },
  { label: 'ABOUT US', section: 'about' },
  { label: 'CONTACT', section: 'contact' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scrollspy: aktif section'ı belirle - GEÇİCİ OLARAK DEVRE DIŞI BIRAKILDI
  /*
  useEffect(() => {
    const handleScroll = () => {
      const offsets = navLinks.map(link => {
        const el = document.getElementById(link.section);
        if (!el) return { section: link.section, offset: Infinity };
        return { section: link.section, offset: Math.abs(el.getBoundingClientRect().top - 120) }; 
      });
      const closest = offsets.reduce((a, b) => (a.offset < b.offset ? a : b));
      setActiveSection(closest.section);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  */

  // Smooth scroll fonksiyonu - GEÇİCİ OLARAK DEVRE DIŞI BIRAKILDI
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    // setTimeout(() => { // setTimeout da yorum satırına alındı, çünkü içindeki kod devre dışı
    //   const el = document.getElementById(id);
    //   if (el) {
    //     const y = el.getBoundingClientRect().top + window.scrollY - 100; 
    //     // window.scrollTo({ top: y, behavior: 'smooth' }); // ASIL KAYDIRMA İŞLEMİ DEVRE DIŞI
    //     console.log(`Scroll to section ${id} would happen here.`);
    //   }
    // }, 100);
    console.log(`Navbar link clicked for section: ${id}, but auto-scroll is temporarily disabled for testing CSS snap.`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div
        className="mx-auto mt-0"
        style={{
          maxWidth: '100vw',
          borderBottomLeftRadius: '48px',
          borderBottomRightRadius: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          background: 'radial-gradient(ellipse at top, #1a2e23 0%, #122218 100%)',
        }}
      >
        <div className="flex items-center justify-between px-6 lg:px-24 h-24 relative">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden text-white text-3xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>

          {/* Left menu */}
          <div className="hidden lg:flex flex-1 justify-end space-x-12">
            {navLinks.slice(0, 3).map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(item.section)}
                className={`text-white text-lg font-bold tracking-wide hover:text-accent transition-colors ${activeSection === item.section ? 'underline' : ''}`}
                style={{ letterSpacing: '1px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Logo center */}
          <div className="flex-0 flex flex-col items-center justify-center mx-4">
            {/* Logo SVG örnek */}
            <div className="mb-1">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#CFCFCF" strokeWidth="2" fill="none" />
                <text x="50%" y="55%" textAnchor="middle" fill="#CFCFCF" fontSize="18" fontFamily="serif" fontWeight="bold" dy=".3em">$</text>
              </svg>
            </div>
            <span className="text-4xl font-serif font-light tracking-widest text-[#CFCFCF] select-none" style={{letterSpacing:'0.2em'}}>LUSSO</span>
          </div>

          {/* Right menu */}
          <div className="hidden lg:flex flex-1 justify-start space-x-12 items-center">
            {navLinks.slice(3, 5).map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(item.section)}
                className={`text-white text-lg font-bold tracking-wide hover:text-accent transition-colors ${activeSection === item.section ? 'underline' : ''}`}
                style={{ letterSpacing: '1px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
            {/* Language selector */}
            <div className="flex items-center ml-4">
              <span className="text-white text-lg font-bold mr-1">EN</span>
              <span className="text-xl">🇺🇸</span>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden flex flex-col items-center py-8 space-y-6 bg-[#1a2e23] rounded-b-3xl shadow-xl">
            {navLinks.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(item.section)}
                className={`text-white text-xl font-bold tracking-wide hover:text-accent transition-colors ${activeSection === item.section ? 'underline' : ''}`}
                style={{ letterSpacing: '1px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center mt-4">
              <span className="text-white text-lg font-bold mr-1">EN</span>
              <span className="text-xl">🇺🇸</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 