import React from 'react';
import './lusso-navbar.css';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Basit mobil menü butonudur - Hamburger ikonunu gösterir
 */
const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      type="button"
      className="mobile-menu-button"
      onClick={onClick}
      aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
    >
      <div className={`mobile-menu-icon ${isOpen ? 'open' : ''}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
};

export default MobileMenuButton;
