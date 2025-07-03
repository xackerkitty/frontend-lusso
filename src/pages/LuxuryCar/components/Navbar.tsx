import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link

interface NavbarProps {
  largeLogoSrc?: string;
  smallLogoSrc?: string;
}

const Navbar: React.FC<NavbarProps> = ({ largeLogoSrc, smallLogoSrc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en' for English

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    // In a real application, you'd likely dispatch an action here
    // to change the application's language globally.
    console.log(`Language changed to: ${event.target.value}`);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full shadow-lg px-4 sm:px-12 min-h-[96px] tracking-wide z-50"
      style={{
        backgroundColor: '#21332B',
        boxShadow: 'inset -10px -10px 60px rgba(0, 0, 0, 0.5), inset -10px -10px 80px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.8)',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-10 max-w-screen-xl mx-auto w-full h-full py-4">
        {/* --- DESKTOP LEFT NAVIGATION --- */}
        <div className="max-lg:hidden flex items-center">
          <ul className="flex gap-x-6" style={{ marginTop: '0.5rem' }}>
            <li className="px-3">
              <Link
                to='/luxurycars'
                className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
              >
                Home
                <span
                  className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </li>
            <li className="px-3">
              <Link
                to='/luxurycars/showroom'
                className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
              >
                Showroom
                <span
                  className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </li>
            <li className="px-3">
              <Link
                to='/luxurycars/cars'
                className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
              >
                Cars
                <span
                  className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* --- LARGE SCREEN LOGO --- */}
        <Link to="#" className="max-lg:hidden flex-shrink-0" style={{ marginTop: '0.5rem' }}>
          {largeLogoSrc && <img src={largeLogoSrc} alt="logo" className="w-56 drop-shadow-lg" />}
        </Link>

        {/* --- SMALL SCREEN LOGO --- */}
        <Link to="#" className="hidden max-lg:block">
          {smallLogoSrc && <img src={smallLogoSrc} alt="logo" className="w-12" />}
        </Link>

        {/* --- DESKTOP RIGHT NAVIGATION --- */}
        <div className="max-lg:hidden flex items-center gap-x-6">
          <ul className="flex gap-x-6" style={{ marginTop: '0.5rem' }}>
            <li className="px-3">
              <Link
                to='/luxurycars/aboutus'
                className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
              >
                About Us
                <span
                  className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </li>
            <li className="px-3">
              <Link
                to='/luxurycars/contactus'
                className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
              >
                Contact
                <span
                  className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                 transform scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </li>
          </ul>
          {/* Language Selector for Desktop */}
          <div className="relative" style={{ marginTop: '0.5rem' }}>
            <select
              id="language-select-desktop"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              // REVISED TAILWIND CLASSES FOR SUBTLER LOOK
              className="block appearance-none bg-transparent border border-gray-600 px-3 py-1.5 pr-6 rounded-md text-gray-100 text-base focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
            >
              <option value="en" className="bg-[#21332B]">English</option>
              {/* Add other language options here when needed, ensure they have a dark background for contrast */}
            </select>
            {/* Custom arrow for the select dropdown */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        {!isMenuOpen && (
          <button
            onClick={toggleMenu}
            className="lg:hidden ml-auto cursor-pointer"
            aria-label="Open menu"
          >
            <svg className="w-8 h-8 fill-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        )}

        {isMenuOpen && (
          <div
            className={`
              fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden
              flex justify-end
            `}
          >
            <ul className="bg-[#21332B] w-1/2 min-w-[300px] p-8 max-h-screen overflow-y-auto shadow-md relative">
              <button
                onClick={toggleMenu}
                className="absolute top-4 right-4 z-[100] rounded-full bg-[#21332B] w-10 h-10 flex items-center justify-center border border-gray-200 cursor-pointer"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white" viewBox="0 0 320.591 320.591">
                  <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" data-original="#000000"></path>
                  <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" data-original="#000000"></path>
                </svg>
              </button>

              <li className="mb-8 hidden max-lg:block">
                <Link to="#">
                  {largeLogoSrc && <img src={largeLogoSrc} alt="logo" className="w-44 drop-shadow-lg" />}
                </Link>
              </li>
              {/* Applied the same hover effects to mobile menu items */}
              <li className="border-b border-gray-300 py-4 px-3">
                <Link
                  to='/luxurycars'
                  className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
                  onClick={toggleMenu}
                >
                  Home
                  <span
                    className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                   transform scale-x-0 group-hover:scale-x-100
                                   transition-transform duration-300 ease-out"
                  ></span>
                </Link>
              </li>
              <li className="border-b border-gray-300 py-4 px-3">
                <Link
                  to='/luxurycars/showroom'
                  className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
                  onClick={toggleMenu}
                >
                  Showroom
                  <span
                    className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                   transform scale-x-0 group-hover:scale-x-100
                                   transition-transform duration-300 ease-out"
                  ></span>
                </Link>
              </li>
              <li className="border-b border-gray-300 py-4 px-3">
                <Link
                  to='/luxurycars/cars'
                  className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
                  onClick={toggleMenu}
                >
                  Cars
                  <span
                    className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                   transform scale-x-0 group-hover:scale-x-100
                                   transition-transform duration-300 ease-out"
                  ></span>
                </Link>
              </li>
              <li className="border-b border-gray-300 py-4 px-3">
                <Link
                  to='/luxurycars/aboutus'
                  className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
                  onClick={toggleMenu}
                >
                  About Us
                  <span
                    className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                   transform scale-x-0 group-hover:scale-x-100
                                   transition-transform duration-300 ease-out"
                  ></span>
                </Link>
              </li>
              <li className="border-b border-gray-300 py-4 px-3">
                <Link
                  to='/luxurycars/contactus'
                  className="relative text-gray-100 block font-medium text-lg group
                               transition-all duration-300 ease-out
                               hover:text-gray-200 group-hover:text-xl"
                  onClick={toggleMenu}
                >
                  Contact
                  <span
                    className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-gray-200
                                   transform scale-x-0 group-hover:scale-x-100
                                   transition-transform duration-300 ease-out"
                  ></span>
                </Link>
              </li>
              {/* Language Selector for Mobile */}
              <li className="py-4 px-3 relative">
                <label htmlFor="language-select-mobile" className="sr-only">Select Language</label>
                <select
                  id="language-select-mobile"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  // REVISED TAILWIND CLASSES FOR SUBTLER LOOK
                  className="block w-full appearance-none bg-transparent border border-gray-600 px-3 py-1.5 pr-6 rounded-md text-gray-100 text-base focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
                >
                  <option value="en" className="bg-[#21332B]">English</option>
                  {/* Add other language options here when needed */}
                </select>
                {/* Custom arrow for the select dropdown (mobile) */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-1.5 text-gray-400">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;