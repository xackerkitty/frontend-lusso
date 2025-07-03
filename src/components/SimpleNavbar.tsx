/**
 * EnhancedNavbar.tsx
 * Alt sayfaların doğru yüklenmesi için gelişmiş navbar.
 * Hem mobil hem de masaüstü için uygun görünüm sağlar.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Lusso tema renkleri
const lussoColors = {
  primary: '#0e4e25',
  primaryDark: '#0a3a1a',
  primaryLight: '#1e6e3a',
  secondary: '#4CAF50',
  accent: '#ffb300',
  textLight: '#ffffff',
  textDark: '#333333',
}

const SimpleNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const location = useLocation();
  
  // Sayfa kaydırma ve pencere boyutu değişikliklerini izle
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div
      style={{
        width: '100%',
        background: scrolled ? 'rgba(0, 0, 0, 0.95)' : lussoColors.primary,
        height: scrolled ? '56px' : '64px',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        zIndex: 990, // Mobil menünün altında kalması için daha düşük
        boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {/* Logo */}
        <div>
          <NavLink 
            to="/nike" 
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              textDecoration: 'none',
            }}
          >
            LUSSO NIKE WFC
          </NavLink>
        </div>

        {/* Desktop menü - Sadece büyük ekranlarda görünür */}
        <div
          style={{
            display: 'none', // Mobil ekranlarda gizle
            '@media (min-width: 768px)': {
              display: 'flex',
            } as any,
          }}
        >
          <NavLink 
            to="/wfcnikelusso"
            style={{
              color: 'white',
              margin: '0 15px',
              textDecoration: 'none',
            }}
          >
            ANA SAYFA
          </NavLink>
          <NavLink 
            to="/wfcnikelusso/team"
            style={{
              color: 'white',
              margin: '0 15px',
              textDecoration: 'none',
            }}
          >
            TAKIM
          </NavLink>
          <NavLink 
            to="/wfcnikelusso/fixtures"
            style={{
              color: 'white',
              margin: '0 15px',
              textDecoration: 'none',
            }}
          >
            FİKSTÜR
          </NavLink>
          <NavLink 
            to="/wfcnikelusso/news"
            style={{
              color: 'white',
              margin: '0 15px',
              textDecoration: 'none',
            }}
          >
            HABERLER
          </NavLink>
          <NavLink 
            to="/wfcnikelusso/contact"
            style={{
              color: 'white',
              margin: '0 15px',
              textDecoration: 'none',
            }}
          >
            İLETİŞİM
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SimpleNavbar;
