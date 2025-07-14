import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../scr/css/style.css";
// Types for company and logo
interface CompanyLogo {
  id: number;
  url: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: any;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface ContactInfo {
  id: number;
  contact_detail: string;
  contact_type: string;
}

interface Company {
  id: number;
  documentId: string;
  slug: string;
  companyName: string;
  mainTitle?: string;
  mainDesc?: string | null;
  contactTitle?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  buttonTxt?: string | null;
  companyLogo: CompanyLogo | null;
  contactInfo: ContactInfo | null;
}

// Helper to resolve logo URL (handles absolute/relative)
function getLogoUrl(logo: CompanyLogo | null, baseUrl: string): string | null {
  if (!logo || !logo.url) return null;
  if (logo.url.startsWith('http://') || logo.url.startsWith('https://')) return logo.url;
  return `${baseUrl}${logo.url}`;
}

function LussoMainPage() {
  const [initialPopIn, setInitialPopIn] = useState(false);
  const [mainLogoTransitioning, setMainLogoTransitioning] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Companies array for logo cards (add more as needed)
  const companies: Company[] = [
    {
      id: 0,
      documentId: 'dubai-rent-car',
      slug: 'dubai-rent-car',
      companyName: 'Dubai Rent Car',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 0, url: '/images/companyLogos/dubairentcar.png', name: 'Dubai Rent Car Logo' },
      contactInfo: { id: 0, contact_detail: '', contact_type: '' }
    },
    {
      id: 1,
      documentId: 'lusso-georgia',
      slug: 'lusso-georgia',
      companyName: 'Lusso Georgia',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 1, url: '/images/companyLogos/lussogeorgia.png', name: 'Lusso Georgia Logo' },
      contactInfo: { id: 1, contact_detail: '', contact_type: '' }
    },
    {
      id: 2,
      documentId: 'lusso-invest',
      slug: 'lusso-invest',
      companyName: 'Lusso Invest',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 2, url: '/images/companyLogos/lussoinvest.png', name: 'Lusso Invest Logo' },
      contactInfo: { id: 2, contact_detail: '', contact_type: '' }
    },
    {
      id: 3,
      documentId: 'lusso-dubai',
      slug: 'lusso-dubai',
      companyName: 'Lusso Dubai',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 3, url: '/images/companyLogos/lussodubai.png', name: 'Lusso Dubai Logo' },
      contactInfo: { id: 3, contact_detail: '', contact_type: '' }
    },
    {
      id: 4,
      documentId: 'blu-control',
      slug: 'blu-control',
      companyName: 'Blu Control',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 4, url: '/images/companyLogos/blucontrol.png', name: 'Blu Control Logo' },
      contactInfo: { id: 4, contact_detail: '', contact_type: '' }
    },
    {
      id: 5,
      documentId: 'nike-lusso',
      slug: 'nike-lusso',
      companyName: 'Nike Lusso',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 5, url: '/images/companyLogos/nikelusso.png', name: 'Nike Lusso Logo' },
      contactInfo: { id: 5, contact_detail: '', contact_type: '' }
    },
    {
      id: 6,
      documentId: 'blu-turizm',
      slug: 'blu-turizm',
      companyName: 'Blu Turizm',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 6, url: '/images/companyLogos/bluturizm.png', name: 'Blu Turizm Logo' },
      contactInfo: { id: 6, contact_detail: '', contact_type: '' }
    },
    {
      id: 7,
      documentId: 'smart-development',
      slug: 'smart-development',
      companyName: 'Smart Development',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 7, url: '/images/companyLogos/smartdevelopment.png', name: 'Smart Development Logo' },
      contactInfo: { id: 7, contact_detail: '', contact_type: '' }
    },
    {
      id: 8,
      documentId: 'lusso-construct',
      slug: 'lusso-construct',
      companyName: 'Lusso Construct',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 8, url: '/images/companyLogos/lussoconstruct.png', name: 'Lusso Construct Logo' },
      contactInfo: { id: 8, contact_detail: '', contact_type: '' }
    },
    {
      id: 9,
      documentId: 'lusso-german',
      slug: 'lusso-german',
      companyName: 'Lusso German',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 9, url: '/images/companyLogos/lussogerman.png', name: 'Lusso German Logo' },
      contactInfo: { id: 9, contact_detail: '', contact_type: '' }
    },
    {
      id: 10,
      documentId: 'dubai-luxury-rent',
      slug: 'dubai-luxury-rent',
      companyName: 'Dubai Luxury Rent',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 10, url: '/images/companyLogos/dubailuxuryrent.png', name: 'Dubai Luxury Rent Logo' },
      contactInfo: { id: 10, contact_detail: '', contact_type: '' }
    },
    {
      id: 11,
      documentId: 'prime-blu-dubai',
      slug: 'prime-blu-dubai',
      companyName: 'Prime Blu Dubai',
      mainTitle: '',
      mainDesc: '',
      contactTitle: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      buttonTxt: null,
      companyLogo: { id: 11, url: '/images/companyLogos/primebludubailogo.png', name: 'Prime Blu Dubai Logo' },
      contactInfo: { id: 11, contact_detail: '', contact_type: '' }
    }
    // Add more companies here as needed
  ];

  const handleCardClick = (companySlug: string) => {
    if (companySlug && typeof companySlug === 'string' && companySlug.trim() !== '') {
      navigate(`/companies/${companySlug}`);
    }
  };

  useEffect(() => {
    setInitialPopIn(true);
    const transitionTimer = setTimeout(() => setMainLogoTransitioning(true), 2500);
    const contentTimer = setTimeout(() => setContentReady(true), 3800);
    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Dynamic classes for the main logo's outer container (manages position and overall scale)
  const mainLogoContainerClasses = `
    absolute
    left-1/2 -translate-x-1/2
    transform-gpu
    transition-all duration-1000 ease-in-out
    ${initialPopIn ? 'opacity-100' : 'opacity-0'} /* Initial pop-in effect */
    ${
      mainLogoTransitioning
        ? 'top-8 md:top-10' // Adjusted final top position for the main logo
        : 'top-1/2 -translate-y-1/2' // Initial large centered position relative to viewport
    }
    z-20
  `;

  // Dynamic classes for the main logo's inner div (actual visible logo size and styling)
  const mainLogoInnerClasses = `
    bg-transparent flex items-center justify-center
    text-4xl md:text-5xl lg:text-6xl font-bold
    transition-all duration-1000 ease-in-out
    ${mainLogoTransitioning
        ? 'animate-none rounded-xl w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64' // Smaller final size and square shape
        : 'animate-pulse rounded-full w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px]' // Larger initial size and circular shape
    }
  `;

  return (
    <div
      className="min-h-screen bg-white text-gray-800 font-inter flex flex-col items-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/car/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hamburger Menu Icon */}

      {/* Full-screen Overlay Menu */}
      <div
        className={`testbg
          fixed inset-0 bg-gray-900 bg-opacity-95 z-40
          flex flex-col items-center justify-center
          transition-opacity duration-300 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <button
          className="absolute top-4 right-4 text-white text-4xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          &times;
        </button>
        <nav className="text-white text-3xl font-semibold space-y-6">
          <a href="#" className="block hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#" className="block hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#" className="block hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#" className="block hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </nav>
      </div>

      {/* Main Logo Container: Always absolute to the viewport for smooth animation path */}
      <div className={mainLogoContainerClasses} >
        {/* Main Logo Inner Div */}
        <div className={mainLogoInnerClasses}   style={{width: '17rem', height: '17rem'}}>
          {/* Using an img tag for the main logo */}
          <img
            src="/images/companyLogos/bluholding.png" // Updated to use bluholding.png from companyLogos
            alt="Main Logo"
            
            className="w-full h-full object-contain p-0"
           
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
            }}
          />
        </div>
      </div>

      {/* Spacer Div: This div reserves space for the main logo at the top
          after it has animated up. This pushes the content below it down. */}
      <div className={`w-full transition-all duration-1000 ease-in-out ${mainLogoTransitioning ? 'h-24 md:h-32 lg:h-40' : 'h-0'}`}></div>

      {/* Services Section: Holds the supplementary logos and other content. */}
      <div style={{marginTop: '45px'}} className={`w-full flex flex-col items-center flex-grow transition-opacity duration-1000 ease-in-out ${contentReady ? 'opacity-100' : 'opacity-0 pointer-events-none'} pt-12 md:pt-16 lg:pt-20`}>
        {/* Display logo cards only, no info, 6 max per row */}
        <div className="flex flex-wrap justify-center gap-6 z-10 mb-6">
          {companies.slice(0, 6).map((company) => (
            <div
              key={company.id}
              className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl flex items-center justify-center p-0 shadow-lg transform-gpu transition-all duration-200 ease-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer bg-transparent"
            >
              <img
                src={company.companyLogo?.url}
                alt={company.companyName}
                className="w-[90%] h-[90%] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 z-10">
          {companies.slice(6, 12).map((company) => (
            <div
              key={company.id}
              className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl flex items-center justify-center p-0 shadow-lg transform-gpu transition-all duration-200 ease-out hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer bg-transparent"
            >
              <img
                src={company.companyLogo?.url}
                alt={company.companyName}
                className="w-[90%] h-[90%] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LussoMainPage;