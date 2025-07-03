import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface HeaderProps {
  section?: 'nike' | 'construction' | 'smart' | 'invest' | 'blu' | 'luxury';
}

const Header: React.FC<HeaderProps> = ({ section }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // ANINDA KONTROL - Eğer Nike rota içindeyse, hiçbir şey render etme
  if (currentPath.includes('/nike')) {
    console.log('HEADER: Nike yolu tespit edildi, HEADER HİÇ RENDER EDİLMEYECEK');
    return null;
  }

  // Nike yolunda değilsek bile, eğer URL'de nike geçiyorsa kontrol et
  useEffect(() => {
    if (window.location.href.toLowerCase().includes('nike')) {
      console.log('HEADER: URL içinde Nike tespit edildi, header gizlenecek');
      const headerElement = document.getElementById('main-header');
      if (headerElement) {
        headerElement.style.display = 'none';
      }
    }
  }, []);

  // Yolu analiz ederek hangi bölümde olduğumuzu belirle
  const pathSection = section || (
    currentPath.startsWith('/wfcnikelusso') ? 'nike' :
    currentPath.startsWith('/construction') ? 'construction' :
    currentPath.startsWith('/smartdevelopment') ? 'smart' :
    currentPath.startsWith('/lussoinvest') ? 'invest' :
    currentPath.startsWith('/blucontrol') ? 'blu' :
    currentPath.startsWith('/luxurycar') ? 'luxury' :
    'nike' // varsayılan
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // useLocation hook'unu kullanarak mevcut yolu alıyoruz
  const { pathname } = useLocation();
  
  // Ana sayfada olup olmadığımızı kontrol ediyoruz, sadece / yolunda isek ana sayfadayız
  const isHome = pathname === '/';

  // Nike rotalarında header'ı gizliyoruz, zaten FreshNavbar var
  if (currentPath.startsWith('/wfcnikelusso')) {
    return null;
  }
  
  return (
    <header 
      className={`${isHome ? 'hidden' : 'block'} fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 transition-opacity z-50 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30" onClick={toggleMenu}></div>

        {/* Mobile menu panel */}
        <nav className={`absolute top-0 right-0 w-4/5 max-w-sm h-full bg-white overflow-y-auto transform transition-transform ease-in-out duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-xl`}>
          <div className="flex justify-between flex-col h-full px-4 py-5">
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-text/80 pb-4">
                <NavLink to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <img src="/logo.png" alt="Lusso Logo" className="h-8 mr-2" />
                  <span className="text-primary font-bold text-xl font-serif">Lusso</span>
                </NavLink>
                <button 
                  className="text-text hover:text-secondary" 
                  onClick={toggleMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <NavLink 
                  to="/" 
                  className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </NavLink>
                
                {/* Nike Bölümü Menü Öğeleri */}
                {pathSection === 'nike' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/wfcnikelusso/team" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sporcular
                    </NavLink>
                    <NavLink 
                      to="/wfcnikelusso/fixtures" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Etkinlikler
                    </NavLink>
                    <NavLink 
                      to="/wfcnikelusso/news" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Haberler
                    </NavLink>
                    <NavLink 
                      to="/wfcnikelusso/gallery" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Galeri
                    </NavLink>
                    <NavLink 
                      to="/wfcnikelusso/about" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hakkında
                    </NavLink>
                    <NavLink 
                      to="/wfcnikelusso/contact" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}
                
                {/* İnşaat Bölümü Menü Öğeleri */}
                {pathSection === 'construction' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/construction/projeler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Projeler
                    </NavLink>
                    <NavLink 
                      to="/construction/hizmetler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hizmetler
                    </NavLink>
                    <NavLink 
                      to="/construction/referanslar" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Referanslar
                    </NavLink>
                    <NavLink 
                      to="/construction/iletisim" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}

                {/* Akıllı Ev Bölümü Menü Öğeleri */}
                {pathSection === 'smart' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/smartdevelopment/teknolojiler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Teknolojiler
                    </NavLink>
                    <NavLink 
                      to="/smartdevelopment/cozumler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Çözümler
                    </NavLink>
                    <NavLink 
                      to="/smartdevelopment/iletisim" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}

                {/* Yatırım Bölümü Menü Öğeleri */}
                {pathSection === 'invest' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/lussoinvest/firsatlar" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Fırsatlar
                    </NavLink>
                    <NavLink 
                      to="/lussoinvest/portfoy" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Portföy
                    </NavLink>
                    <NavLink 
                      to="/lussoinvest/danismanlik" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Danışmanlık
                    </NavLink>
                    <NavLink 
                      to="/lussoinvest/iletisim" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}

                {/* Blu Control Bölümü Menü Öğeleri */}
                {pathSection === 'blu' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/blucontrol/sistemler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sistemler
                    </NavLink>
                    <NavLink 
                      to="/blucontrol/otomasyon" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Otomasyon
                    </NavLink>
                    <NavLink 
                      to="/blucontrol/projeler" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Projeler
                    </NavLink>
                    <NavLink 
                      to="/blucontrol/iletisim" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}

                {/* Lüks Araçlar Bölümü Menü Öğeleri */}
                {pathSection === 'luxury' && (
                  <div className="flex flex-col space-y-4">
                    <NavLink 
                      to="/luxurycar/modeller" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Modeller
                    </NavLink>
                    <NavLink 
                      to="/luxurycar/satis" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Satış
                    </NavLink>
                    <NavLink 
                      to="/luxurycar/kiralama" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kiralama
                    </NavLink>
                    <NavLink 
                      to="/luxurycar/iletisim" 
                      className={({isActive}) => isActive ? 'text-primary font-medium py-2' : 'text-text hover:text-secondary py-2'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İletişim
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
            
            {/* Social links for mobile */}
            <div className="pt-6 border-t border-text/80 mt-8">
              <div className="flex justify-between items-center">
                <a href="https://facebook.com" className="text-text hover:text-secondary" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" className="text-text hover:text-secondary" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" className="text-text hover:text-secondary" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" className="text-text hover:text-secondary" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
              <div className="mt-4 text-center">
                <a href="mailto:info@lussonike.com" className="text-sm text-primary font-medium hover:text-secondary">info@lussonike.com</a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with social links - hidden on mobile */}
        <div className="hidden lg:flex justify-end items-center space-x-4 mb-3 text-text">
          <a href="https://facebook.com" className="hover:text-secondary transition-colors" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="https://twitter.com" className="hover:text-secondary transition-colors" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="https://instagram.com" className="hover:text-secondary transition-colors" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="https://youtube.com" className="hover:text-secondary transition-colors" aria-label="YouTube">
            <Youtube size={18} />
          </a>
          <div className="border-l border-lusso-border-gold h-5 mx-2"></div>
          <a href="mailto:info@lussonike.com" className="text-sm hover:text-primary font-medium">info@lussonike.com</a>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src="/logo.png" alt="Lusso Logo" className="h-8 mr-2" />
              <span className="text-primary font-bold text-xl font-serif">Lusso</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation - Bölüme göre değişen menü */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Ana sayfaya dönüş linki - tüm bölümlerde ortak */}
            <NavLink to="/" className={({isActive}) => 
              isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
            }>
              Ana Sayfa
            </NavLink>
            
            {/* Nike Bölümü Menü Öğeleri */}
            {pathSection === 'nike' && (
              <>
                <NavLink to="/wfcnikelusso/team" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Sporcular
                </NavLink>
                <NavLink to="/wfcnikelusso/fixtures" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Etkinlikler
                </NavLink>
                <NavLink to="/wfcnikelusso/news" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Haberler
                </NavLink>
                <NavLink to="/wfcnikelusso/gallery" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Galeri
                </NavLink>
                <NavLink to="/wfcnikelusso/about" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Hakkında
                </NavLink>
                <NavLink to="/wfcnikelusso/contact" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}
            
            {/* İnşaat Bölümü Menü Öğeleri */}
            {pathSection === 'construction' && (
              <>
                <NavLink to="/construction/projeler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Projeler
                </NavLink>
                <NavLink to="/construction/hizmetler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Hizmetler
                </NavLink>
                <NavLink to="/construction/referanslar" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Referanslar
                </NavLink>
                <NavLink to="/construction/iletisim" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}

            {/* Akıllı Ev Bölümü Menü Öğeleri */}
            {pathSection === 'smart' && (
              <>
                <NavLink to="/smartdevelopment/teknolojiler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Teknolojiler
                </NavLink>
                <NavLink to="/smartdevelopment/cozumler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Çözümler
                </NavLink>
                <NavLink to="/smartdevelopment/iletisim" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}

            {/* Yatırım Bölümü Menü Öğeleri */}
            {pathSection === 'invest' && (
              <>
                <NavLink to="/lussoinvest/firsatlar" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Fırsatlar
                </NavLink>
                <NavLink to="/lussoinvest/portfoy" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Portföy
                </NavLink>
                <NavLink to="/lussoinvest/danismanlik" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Danışmanlık
                </NavLink>
                <NavLink to="/lussoinvest/iletisim" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}

            {/* Blu Control Bölümü Menü Öğeleri */}
            {pathSection === 'blu' && (
              <>
                <NavLink to="/blucontrol/sistemler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Sistemler
                </NavLink>
                <NavLink to="/blucontrol/otomasyon" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Otomasyon
                </NavLink>
                <NavLink to="/blucontrol/projeler" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Projeler
                </NavLink>
                <NavLink to="/blucontrol/iletisim" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}

            {/* Lüks Araçlar Bölümü Menü Öğeleri */}
            {pathSection === 'luxury' && (
              <>
                <NavLink to="/luxurycar/modeller" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Modeller
                </NavLink>
                <NavLink to="/luxurycar/satis" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Satış
                </NavLink>
                <NavLink to="/luxurycar/kiralama" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  Kiralama
                </NavLink>
                <NavLink to="/luxurycar/iletisim" className={({isActive}) => 
                  isActive ? 'nav-link-active border-b-2 border-secondary pb-1' : 'nav-link'
                }>
                  İletişim
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu} 
            className="lg:hidden text-text hover:text-primary focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
