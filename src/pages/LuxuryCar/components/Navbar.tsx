import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  largeLogoSrc?: string;
  smallLogoSrc?: string;
  alwaysShowBackground?: boolean;
  hideOnScrollDown?: boolean; // Prop to enable scroll direction detection
}

const Navbar: React.FC<NavbarProps> = ({ largeLogoSrc, smallLogoSrc, alwaysShowBackground = false, hideOnScrollDown = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation(); // Hook to get current location for scroll to top

  // Effect for handling navbar background and visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for background changes
      setScrolled(currentScrollY > 50);

      // Only handle visibility if hideOnScrollDown is enabled
      if (hideOnScrollDown) {
        if (currentScrollY < 10) {
          // Always show navbar when at the very top
          setIsVisible(true);
        } else if (currentScrollY < lastScrollY) {
          // Show navbar when scrolling up
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Hide navbar when scrolling down past a threshold
          setIsVisible(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hideOnScrollDown, lastScrollY]);

  // Effect for handling body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
      // Adjust body padding to prevent content shift if scrollbar disappears
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = ''; // Remove padding
    }

    // Cleanup function to ensure scroll is restored on unmount
    return () => {
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen]);

  // Effect to scroll to top when location changes (i.e., when navigating via Link)
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false); // Close menu on navigation
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    console.log(`Language changed to: ${event.target.value}`);
  };

  return (
    <>
      <style>
        {`
          /* Global styles to remove default margins/padding and ensure proper box-sizing */
          html, body {
            margin: 0;
            box-sizing: border-box;
          }
          *, *::before, *::after {
            box-sizing: inherit;
          }

          /* *** FIX FOR GAP ON MAIN CONTENT PAGES *** */
          /* Add padding to the body to account for the fixed navbar height */
          body {
            padding-top: 96px; /* Matches the navbar's min-h-[96px] */
          }

          /* Class to prevent body scrolling when mobile menu is open */
          body.no-scroll {
            overflow: hidden;
          }

          /* Base styles for the mobile dropdown menu */
          .mobile-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 50;
            background: #21332B;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            overflow-y: auto;
            max-height: calc(100vh - 96px);
          }

          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 40;
            background: rgba(0, 0, 0, 0.5);
          }

          .mobile-menu-item {
            display: block;
            color: #F3F4F6;
            font-size: 1.125rem;
            font-weight: 500;
            padding: 0.75rem 0;
            text-align: center;
          }

          .mobile-nav-list li {
            border-bottom: 1px solid #4B5563;
            padding: 0.25rem 0;
          }

          .mobile-nav-list li:last-child {
            border-bottom: none;
          }
        `}
      </style>

      <header
        className={`fixed top-0 left-0 w-full px-4 sm:px-12 min-h-[96px] tracking-wide z-50 transition-all duration-300 ${
          hideOnScrollDown ? (isVisible ? 'translate-y-0' : '-translate-y-full') : ''
        }`}
        style={
          (scrolled || alwaysShowBackground || isMenuOpen)
            ? {
                backgroundColor: 'rgba(33, 51, 43, 0.9)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                borderBottomLeftRadius: '25px',
                borderBottomRightRadius: '25px',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                transition: 'background 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
              }
            : {
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 70%, transparent 100%)',
                boxShadow: 'none',
                borderBottomLeftRadius: '25px',
                borderBottomRightRadius: '25px',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                transition: 'background 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
              }
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-x-10 max-w-screen-xl mx-auto w-full h-full py-4">
          {/* --- DESKTOP LEFT NAVIGATION --- */}
          <div className="hidden lg:flex items-center">
            <ul className="flex gap-x-6">
              <li className="px-3">
                <Link
                  to='/luxurycars'
                  className="relative text-gray-100 block font-medium text-lg group transition-all duration-300 ease-out hover:text-gray-200"
                >
                  Home
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to='/luxurycars/showroom'
                  className="relative text-gray-100 block font-medium text-lg group transition-all duration-300 ease-out hover:text-gray-200"
                >
                  Showroom
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to='/luxurycars/cars'
                  className="relative text-gray-100 block font-medium text-lg group transition-all duration-300 ease-out hover:text-gray-200"
                >
                  Cars
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* --- LARGE SCREEN LOGO --- */}
          <Link to="/luxurycars" className="hidden lg:flex flex-shrink-0">
            {largeLogoSrc && <img src={largeLogoSrc} alt="logo" className="w-56 drop-shadow-lg" />}
          </Link>

          {/* --- SMALL SCREEN LOGO (always visible on small screens, far left) --- */}
          <Link to="/luxurycars" className="block lg:hidden">
            {smallLogoSrc && <img src={smallLogoSrc} alt="logo" className="w-20 sm:w-24 md:w-28" />}
          </Link>

          {/* --- DESKTOP RIGHT NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-x-6">
            <ul className="flex gap-x-6">
              <li className="px-3">
                <Link
                  to='/luxurycars/aboutus'
                  className="relative text-gray-100 block font-medium text-lg group transition-all duration-300 ease-out hover:text-gray-200"
                >
                  About Us
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              </li>
              <li className="px-3">
                <Link
                  to='/luxurycars/contactus'
                  className="relative text-gray-100 block font-medium text-lg group transition-all duration-300 ease-out hover:text-gray-200"
                >
                  Contact
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Link>
              </li>
            </ul>
            {/* Language Selector for Desktop */}
            <div className="relative">
              <select
                id="language-select-desktop"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="block appearance-none bg-transparent border border-gray-600 px-3 py-1.5 pr-6 rounded-md text-gray-100 text-base focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
              >
                <option value="en" className="bg-[#21332B]">English</option>
              </select>
              {/* Custom arrow for the select dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* --- MOBILE HAMBURGER/CLOSE BUTTON --- */}
          <button
            onClick={toggleMenu}
            className="lg:hidden cursor-pointer z-[60] ml-auto"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              // Close/X icon when menu is open
              <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" clipRule="evenodd"/>
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-8 h-8 fill-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            )}
          </button>

          {isMenuOpen && (
            <>
              {/* Background overlay */}
              <div
                className="mobile-menu-overlay lg:hidden"
                onClick={toggleMenu}
              ></div>
              
              {/* Dropdown menu */}
              <div
                className="mobile-dropdown-menu lg:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pt-4 px-6 pb-6 w-full">
                  {/* Logo in mobile menu */}
                  <div className="mb-6 text-center">
                    <Link to="/luxurycars" onClick={toggleMenu}>
                      {largeLogoSrc && <img src={largeLogoSrc} alt="logo" className="w-32 sm:w-40 drop-shadow-lg mx-auto" />}
                    </Link>
                  </div>

                  {/* Navigation items */}
                  <nav>
                    <ul className="mobile-nav-list space-y-1">
                      <li>
                        <Link
                          to='/luxurycars'
                          className="mobile-menu-item relative block group transition-all duration-300 ease-out hover:text-gray-200"
                          onClick={toggleMenu}
                        >
                          Home
                          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/luxurycars/showroom'
                          className="mobile-menu-item relative block group transition-all duration-300 ease-out hover:text-gray-200"
                          onClick={toggleMenu}
                        >
                          Showroom
                          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/luxurycars/cars'
                          className="mobile-menu-item relative block group transition-all duration-300 ease-out hover:text-gray-200"
                          onClick={toggleMenu}
                        >
                          Cars
                          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/luxurycars/aboutus'
                          className="mobile-menu-item relative block group transition-all duration-300 ease-out hover:text-gray-200"
                          onClick={toggleMenu}
                        >
                          About Us
                          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/luxurycars/contactus'
                          className="mobile-menu-item relative block group transition-all duration-300 ease-out hover:text-gray-200"
                          onClick={toggleMenu}
                        >
                          Contact
                          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                        </Link>
                      </li>
                      {/* Language Selector for Mobile */}
                      <li className="py-4">
                        <label htmlFor="language-select-mobile" className="block text-gray-300 text-sm font-medium mb-2 text-center">Language</label>
                        <div className="relative w-full max-w-xs mx-auto">
                          <select
                            id="language-select-mobile"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="block w-full appearance-none bg-gray-700 border border-gray-600 px-4 py-3 pr-8 rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 cursor-pointer"
                          >
                            <option value="en" className="bg-[#21332B]">English</option>
                          </select>
                          {/* Custom arrow for the select dropdown (mobile) */}
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/>
                            </svg>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;