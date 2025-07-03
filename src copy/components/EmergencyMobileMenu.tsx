/**
 * EmergencyMobileMenu.tsx
 * Sorunlu navbar durumunda kullanılacak bağımsız ve basit mobil menü bileşeni.
 * Bu bileşen, hiçbir CSS veya mevcut bileşenle çakışmadan çalışacak şekilde tasarlanmıştır.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmergencyMobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Menüyü açıp kapat
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    
    // Scroll kilitleme
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const handleLinkClick = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };
  
  // Component unmount olduğunda scroll kilidi kaldır
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  const baseMenuStyle: React.CSSProperties = {
    position: 'fixed',
    right: isOpen ? '0' : '-100%',
    top: '0',
    width: '80%',
    height: '100vh',
    backgroundColor: '#0e4e25', // Lusso yeşil
    color: 'white',
    zIndex: 99999, // Maximum z-index
    transition: 'right 0.3s ease',
    boxShadow: isOpen ? '-5px 0 15px rgba(0,0,0,0.5)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    overflowY: 'auto'
  };
  
  const toggleButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: isOpen ? '#000' : '#0e4e25',
    color: 'white',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    zIndex: 100000, // En yüksek z-index
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s, background-color 0.3s'
  };
  
  const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    display: 'block'
  };
  
  const hamburgerStyle: React.CSSProperties = {
    width: '30px',
    height: '20px',
    position: 'relative',
    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
    transition: 'transform 0.3s'
  };
  
  const lineStyles = {
    top: {
      position: 'absolute' as 'absolute',
      width: '100%',
      height: '3px',
      backgroundColor: 'white',
      top: isOpen ? '50%' : '0',
      transform: isOpen ? 'translateY(-50%)' : 'none',
      transition: 'top 0.3s, transform 0.3s'
    },
    middle: {
      position: 'absolute' as 'absolute',
      width: '100%',
      height: '3px',
      backgroundColor: 'white',
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: isOpen ? 0 : 1,
      transition: 'opacity 0.3s'
    },
    bottom: {
      position: 'absolute' as 'absolute',
      width: '100%',
      height: '3px',
      backgroundColor: 'white',
      bottom: isOpen ? '50%' : '0',
      transform: isOpen ? 'translateY(50%) rotate(90deg)' : 'none',
      transition: 'bottom 0.3s, transform 0.3s'
    }
  };
  
  return (
    <>
      {/* Hamburger Düğmesi */}
      <button 
        onClick={toggleMenu} 
        style={toggleButtonStyle}
        aria-label="Mobil Menü"
      >
        <div style={hamburgerStyle}>
          <span style={lineStyles.top}></span>
          <span style={lineStyles.middle}></span>
          <span style={lineStyles.bottom}></span>
        </div>
      </button>
      
      {/* Menü */}
      <div style={baseMenuStyle}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>LUSSO NIKE WFC</h2>
        
        <Link to="/wfcnikelusso" style={linkStyle} onClick={handleLinkClick}>ANA SAYFA</Link>
        <Link to="/wfcnikelusso/team" style={linkStyle} onClick={handleLinkClick}>TAKIM</Link>
        <Link to="/wfcnikelusso/fixtures" style={linkStyle} onClick={handleLinkClick}>FİKSTÜR</Link>
        <Link to="/wfcnikelusso/news" style={linkStyle} onClick={handleLinkClick}>HABERLER</Link>
        <Link to="/wfcnikelusso/contact" style={linkStyle} onClick={handleLinkClick}>İLETİŞİM</Link>
        
        <div style={{ marginTop: 'auto', padding: '20px 0', fontSize: '14px', opacity: 0.7 }}>
          Lusso Nike 2025 Tüm Hakları Saklıdır
        </div>
      </div>
    </>
  );
};

export default EmergencyMobileMenu;
