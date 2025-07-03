/**
 * EnhancedNavbar.tsx
 * Masau00fcstu00fc iu00e7in zengin gu00f6ru00fcnu00fcmlu00fc navbar komponentti
 * FreshNavbar'dan farksu0131z ancak bau011fu0131msu0131z u00e7alu0131u015fu0131r
 */

import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Su0131fu0131rdan CSS tanu0131mlamasu0131 - lusso-navbar.css'deki u00e7aku0131u015fmalaru0131 u00f6nlemek iu00e7in
const navbarStyles = {
  header: {
    width: '100%',
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    zIndex: 990,
    backgroundColor: '#0e4e25',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  scrolledHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    height: '56px',
  },
  navbar: {
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    height: '64px',
    padding: '0 24px',
    maxWidth: '1600px',
    margin: '0 auto',
    position: 'relative' as 'relative',
    transition: 'height 0.3s ease',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as 'bold',
    letterSpacing: '1px',
    color: '#ffffff',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    height: '100%',
    position: 'relative' as 'relative',
  },
  navLink: {
    position: 'relative' as 'relative',
    height: '100%',
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    padding: '0 16px',
    color: '#d1d5db',
    fontSize: '0.9rem',
    fontWeight: '600' as '600',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  activeLink: {
    color: '#ffb300 !important',
    fontWeight: '700' as '700',
    position: 'relative' as 'relative', 
    textShadow: '0 0 1px rgba(255, 255, 255, 0.3)',
  },
  activeLinkAfter: {
    content: "''",
    position: 'absolute' as 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '3px',
    backgroundColor: '#ffb300',
    borderRadius: '2px',
    boxShadow: '0 0 8px #ffb300',
  },
};

// Navbar iu00e7in gerekli temel veri tipleri
interface NavLinkItem {
  title: string;
  path: string;
}

interface EnhancedNavbarProps {
  scrolled?: boolean;
}

const EnhancedNavbar: React.FC<EnhancedNavbarProps> = ({ scrolled = false }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(scrolled);
  
  // Sayfa kaymasu0131nu0131 izle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Ana mensu00fc linkleri
  const mainLinks: NavLinkItem[] = [
    { title: 'ANA SAYFA', path: '/wfcnikelusso' },
    { title: 'TAKIM', path: '/wfcnikelusso/team' },
    { title: 'Fu0130KSTu00dcR', path: '/wfcnikelusso/fixtures' },
    { title: 'HABERLER', path: '/wfcnikelusso/news' },
    { title: 'u0130LETu0130u015eu0130M', path: '/wfcnikelusso/contact' },
  ];
  
  return (
    <header style={{
      ...navbarStyles.header,
      ...(isScrolled ? navbarStyles.scrolledHeader : {})
    }}>
      <nav style={navbarStyles.navbar}>
        {/* Logo */}
        <div>
          <NavLink 
            to="/wfcnikelusso" 
            style={navbarStyles.logo}
          >
            LUSSO NIKE WFC
          </NavLink>
        </div>
        
        {/* Menu00fc Linkleri */}
        <div style={navbarStyles.navLinks}>
          {mainLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              style={({ isActive }) => ({
                ...navbarStyles.navLink,
                ...(isActive ? navbarStyles.activeLink : {})
              })}
            >
              {link.title}
              {location.pathname === link.path && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  backgroundColor: '#ffb300',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px #ffb300',
                }}></span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default EnhancedNavbar;
