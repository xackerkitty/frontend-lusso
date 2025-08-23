import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import './css/wfcnavbar.css';
import WFCLogo from './media/wfc nike lusso-01 (1).png';

const WFCNavbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="navbar-wrapper">
            {/* Top white bar */}
            <div className="top-bar">
                <div className="top-bar-content">
                    <div className="social-links">
                        <a href="https://www.facebook.com/groups/584300362977796/" className="social-link" title="Facebook" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://www.instagram.com/wfcnikelussoofficial" className="social-link" title="Instagram" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.tiktok.com/@wfcnikelusso" className="social-link" title="TikTok" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                    </div>
                    <div className="contact-info">
                        {/* <span style={{display: 'flex', alignItems: 'center'}}>
                            <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '8px', color: '#0b5330'}} />
                            info@wfcnike.com
                        </span> */}
                        <span style={{display: 'flex', alignItems: 'center'}}>
                            <FontAwesomeIcon icon={faPhone} style={{marginRight: '8px', color: '#0b5330'}} />
                            +995 555188888
                        </span>
                    </div>
                </div>
            </div>

            {/* Main green navbar */}
            <div className="main-navbar">
                <div className="navbar-content">
                    <div className="logo-section">
                        <img src={WFCLogo} alt="WFC Nike Lusso" className="logo" />
                    </div>

                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <svg viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </button>

                    <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                        <a href="#home">HOME</a>
                        <a href="#news">NEWS</a>
                        <a href="#matches">MATCHES</a>
                        <a href="#team">TEAM</a>
                        <a href="#about">ABOUT</a>
                        <a href="#contact">CONTACT</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WFCNavbar;
