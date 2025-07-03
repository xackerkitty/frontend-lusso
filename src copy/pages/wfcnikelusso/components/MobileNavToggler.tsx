import React, { useEffect } from 'react';

interface MobileNavTogglerProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

/**
 * DOM ile doğrudan etkileşim yapabilen bağımsız mobil menü düğmesi
 * Bu versiyon, React state'inden bağımsız olarak menüyü açabiliyor
 */
const MobileNavToggler: React.FC<MobileNavTogglerProps> = ({ 
  isOpen, 
  toggleMenu 
}) => {
  // Doğrudan DOM erişimi ile toggle fonksiyonu
  const directToggle = () => {
    // 1. Body elemana sınıf ekle/çıkar
    document.body.classList.toggle('lusso-mobile-menu-open');
    
    // 2. Önceki durumu belirle
    const wasOpen = document.body.classList.contains('lusso-mobile-menu-open');
    
    // 3. Nav Links elemanını bul ve sınıfı doğrudan değiştir
    const navLinks = document.querySelector('.lusso-nav-links');
    if (navLinks) {
      if (wasOpen) {
        navLinks.classList.add('menu-force-open', 'open');
      } else {
        navLinks.classList.remove('menu-force-open', 'open');
      }
    }
    
    // 4. React'a da bildir
    toggleMenu();
  };
  
  // isOpen ile DOM durumunu senkronize tut
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lusso-mobile-menu-open');
    } else {
      document.body.classList.remove('lusso-mobile-menu-open');
    }
  }, [isOpen]);
  
  return (
    <div
      id="lusso-mobile-toggler"
      className="fixed top-6 right-6 z-[10000] w-16 h-16 rounded-full bg-lusso-primary shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-300"
      onClick={directToggle} /* Doğrudan DOM toggle fonksiyonunu kullan */
      role="button" // Erişilebilirlik için rol
      tabIndex={0} // Klavye ile erişim
      aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'} // Erişilebilirlik etiketi
      style={{
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        touchAction: 'manipulation', // Dokunmatik cihazlarda gecikmeyi kaldırır
        WebkitTapHighlightColor: 'transparent', // iOS'ta dokunma vurgusunu kaldırır
        pointerEvents: 'auto', // Tıklama olaylarını zorla etkinleştirir
        opacity: 1, // Görünürlüğü zorla
        visibility: 'visible', // Görünürlüğü zorla
      }}
    >
      <div className="relative w-8 h-6">
        <span 
          className="absolute h-1 w-8 bg-white rounded-md transition-all duration-300"
          style={{
            top: isOpen ? '50%' : '0',
            transform: isOpen ? 'translateY(-50%) rotate(45deg)' : 'none'
          }}
        />
        <span 
          className="absolute h-1 w-8 bg-white rounded-md top-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'translateX(20px)' : 'none'
          }}
        />
        <span 
          className="absolute h-1 w-8 bg-white rounded-md transition-all duration-300"
          style={{
            bottom: isOpen ? '50%' : '0',
            transform: isOpen ? 'translateY(50%) rotate(-45deg)' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default MobileNavToggler;
