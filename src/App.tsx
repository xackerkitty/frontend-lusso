import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Import the new CompanyDetailPage
import CompanyDetailPage from './pages/CompanyDetailPage'; 

// Temel sayfalar - Commented out due to unresolved module errors
// These imports are commented out as per your original code,
// assuming they are not fully implemented or causing issues.
import BluControl from './pages/BluControl';
import Construction from './pages/Construction';
import SmartDevelopment from './pages/SmartDevelopment';
import LussoInvest from './pages/LussoInvest';
import LussoAutoGallery from './pages/lusso-autogallery';
import LuxuryCar from './pages/LuxuryCar/LuxuryCar';
import Showroom from './pages/LuxuryCar/pages/Shoowroom';
import CarDetail from './pages/LuxuryCar/pages/CarDetail';
import Aboutus from './pages/LuxuryCar/pages/aboutUs';
import Contactus from './pages/LuxuryCar/pages/contactUs';
import Cars from './pages/LuxuryCar/pages/cars';
import WfcNikeLussoLayout from './pages/wfcnikelusso/WfcNikeLussoLayout';
import WfcNikeLusso from './pages/wfcnikelusso/WfcNikeLusso';
import TeamPage from './pages/wfcnikelusso/TeamPage';
import AthleteDetailPage from './pages/wfcnikelusso/AthleteDetailPage';
import NewsPage_new from './pages/wfcnikelusso/NewsPage_new';
// import NewsDetailPage_new from './pages/wfcnikelusso/NewsDetailPage_new'; 
import GalleryPage from './pages/wfcnikelusso/GalleryPage';
import FixturesPage from './pages/wfcnikelusso/FixturesPage';

// Bileşenler - Commented out due to unresolved module errors
// import Header from './components/layout/Header';
// import Footer from './components/layout/Footer';

// Router Helper Component - Simplified as per your original code
const UserRoute = ({ element, path }: { element: React.ReactNode; path: string }) => {
  return (
    // For now, we return the element directly. In a real app, you'd have a working layout.
    <>{element}</>
  );
};

// TypeScript interface for CompanyLogo
interface CompanyLogo {
  id: number;
  url: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: { url: string; };
    small?: { url: string; };
    medium?: { url: string; };
    thumbnail?: { url: string; };
  } | null; // Formats can be null based on your JSON
  hash: string;
  ext: string;
  mime: string;
  size: number;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// TypeScript interface for ContactInfo (can be null or an object)
interface ContactInfo {
  id: number;
  contact_detail: string;
  contact_type: string;
}

// TypeScript interface for Company, now including 'slug'
interface Company {
  id: number;
  documentId: string; // Keeping this for existing logic if needed, but 'slug' is preferred for URLs
  slug: string;       // The new slug field for clean URLs
  companyName: string;
  mainTitle: string;
  mainDesc: string | null;
  contactTitle: string | null; // Can be null
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  buttonTxt: string | null;
  companyLogo: CompanyLogo | null; // Can be null if no logo
  contactInfo: ContactInfo | null; // Can be null based on your JSON
}

// Main Page Component
function LussoMainPage() {
  const [initialPopIn, setInitialPopIn] = useState(false);
  const [mainLogoTransitioning, setMainLogoTransitioning] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingLogos, setLoadingLogos] = useState(true);
  const [logosError, setLogosError] = useState<string | null>(null);

  // Define the base URL for your API
  const BASE_API_URL = 'https://lovely-basket-c9e8008024.strapiapp.com';
  // Changed populate parameter to '*' to fetch all relations and nested components
  const API_COMPANIES_URL = `${BASE_API_URL}/api/companies?populate=*`;

  const navigate = useNavigate();

  // Updated handleCardClick to use the company's 'slug' for navigation
  const handleCardClick = (companySlug: string) => {
    // Ensure companySlug is a valid string before navigating
    if (companySlug && typeof companySlug === 'string' && companySlug.trim() !== '') {
      navigate(`/companies/${companySlug}`);
    } else {
      console.error("Attempted to navigate with an invalid company slug:", companySlug);
      // Optionally, show a user-friendly error message or navigate to a fallback page
      setLogosError("Could not navigate to company page due to missing information.");
    }
  };

  useEffect(() => {
    setInitialPopIn(true);

    // Set timers for animation effects
    const transitionTimer = setTimeout(() => {
      setMainLogoTransitioning(true);
    }, 2500);

    const contentTimer = setTimeout(() => {
      setContentReady(true);
    }, 3800);

    // Function to fetch company data from Strapi
    const fetchCompanies = async () => {
      try {
        const response = await fetch(API_COMPANIES_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Map over the fetched companies to prepend BASE_API_URL to relative image URLs
        // Also, ensure that a 'slug' is available for each company.
        const companiesWithAbsoluteUrlsAndSlugs = data.data.map((company: any) => {
          // In Strapi v4, when populate=* is used for single types/components, 
          // the attributes are often directly nested, not inside an additional 'attributes' property
          // of a 'data' object for relations.
          // The top-level `company` object from `data.data` already contains the attributes directly.
          // So, `company.attributes` is not needed here; just `company` itself.
          
          // Let's re-evaluate the direct properties of the `company` object
          // as per your provided JSON structure.
          
          // If the company object itself is null or undefined, filter it out.
          if (!company) {
            console.warn("Skipping invalid company data: object is null/undefined.", company);
            return null; 
          }

          // Ensure generatedSlug is never an empty string.
          // Fallback to a random ID if companyName or slug is missing or empty.
          const generatedSlug = company.slug || 
                                (company.companyName 
                                  ? company.companyName.toLowerCase().replace(/\s/g, '-').replace(/llc$/, '')
                                  : `company-${company.id || Math.random().toString(36).substring(7)}`);

          let companyLogo: CompanyLogo | null = null;
          // As per your JSON, companyLogo attributes are directly under company.companyLogo, not nested in .data.attributes
          if (company.companyLogo) { // Check if companyLogo exists
            const logoAttributes = company.companyLogo;
            companyLogo = {
              id: logoAttributes.id,
              name: logoAttributes.name,
              alternativeText: logoAttributes.alternativeText,
              caption: logoAttributes.caption,
              width: logoAttributes.width,
              height: logoAttributes.height,
              formats: logoAttributes.formats || null, // Formats can be null
              hash: logoAttributes.hash,
              ext: logoAttributes.ext,
              mime: logoAttributes.mime,
              size: logoAttributes.size,
              previewUrl: logoAttributes.previewUrl,
              provider: logoAttributes.provider,
              provider_metadata: logoAttributes.provider_metadata,
              createdAt: logoAttributes.createdAt,
              updatedAt: logoAttributes.updatedAt,
              publishedAt: logoAttributes.publishedAt,
              // Ensure the URL is absolute. If it's already absolute, don't prepend.
              url: logoAttributes.url.startsWith('http://') || logoAttributes.url.startsWith('https://') 
                   ? logoAttributes.url 
                   : `${BASE_API_URL}${logoAttributes.url}`
            };
          }

          // contactInfo can be null directly as per your JSON
          let contactInfo: ContactInfo | null = null;
          if (company.contactInfo) {
              contactInfo = {
                  id: company.contactInfo.id,
                  contact_detail: company.contactInfo.contact_detail,
                  contact_type: company.contactInfo.contact_type
              };
          }

          return {
            id: company.id,
            documentId: company.documentId || generatedSlug,
            slug: generatedSlug,
            companyName: company.companyName || 'Unnamed Company',
            mainTitle: company.mainTitle || '', 
            mainDesc: company.mainDesc || null, 
            contactTitle: company.contactTitle || null,
            createdAt: company.createdAt || '', 
            updatedAt: company.updatedAt || '', 
            publishedAt: company.publishedAt || '', 
            buttonTxt: company.buttonTxt || null,
            companyLogo: companyLogo,
            contactInfo: contactInfo, 
          };
        }).filter(Boolean); // Filter out any null entries that resulted from invalid company data
        setCompanies(companiesWithAbsoluteUrlsAndSlugs);
      } catch (err: any) {
        console.error("Failed to fetch companies:", err);
        setLogosError("Failed to load company logos. Please try again later.");
        setCompanies(placeholderCompanies); // Fallback to placeholder data on error
      } finally {
        setLoadingLogos(false); // Set loading to false after fetch attempt
      }
    };

    fetchCompanies(); // Initiate the fetch operation

    // Cleanup function for timeouts
    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(contentTimer);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Placeholder data for companies (used if API fetch fails)
  const placeholderCompanies: Company[] = [
    { id: 1, documentId: 'blu-control', slug: 'blu-control', companyName: 'Blu Control LLC', mainTitle: 'Leading in automation', mainDesc: 'Blu Control provides cutting-edge automation solutions for smart homes and businesses.', contactTitle: 'Reach Us', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 101, url: 'https://placehold.co/200x200/ADD8E6/000000?text=Blu+Control', name: 'Blu Control Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 1, contact_detail: 'info@blucontrol.com', contact_type: 'Email' } },
    { id: 2, documentId: 'smart-development', slug: 'smart-development', companyName: 'Smart Development', mainTitle: 'Innovative urban planning', mainDesc: 'Focused on sustainable and smart urban developments.', contactTitle: 'Get in Touch', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 102, url: 'https://placehold.co/200x200/90EE90/000000?text=Smart+Dev', name: 'Smart Development Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 2, contact_detail: 'contact@smartdev.ge', contact_type: 'Email' } },
    { id: 3, documentId: 'lusso-autogallery', slug: 'lusso-autogallery', companyName: 'Lusso Autogallery', mainTitle: 'Premium car selection', mainDesc: 'Your destination for luxury and exotic vehicles.', contactTitle: 'Visit Us', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 103, url: 'https://placehold.co/200x200/FFD700/000000?text=Lusso+Auto', name: 'Lusso Autogallery Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 3, contact_detail: '123 Main St, City', contact_type: 'Address' } },
    { id: 4, documentId: 'lusso-invest', slug: 'lusso-invest', companyName: 'Lusso Invest', mainTitle: 'Strategic investment opportunities', mainDesc: 'Empowering growth through smart investments.', contactTitle: 'Invest with Us', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 104, url: 'https://placehold.co/200x200/FFA07A/000000?text=Lusso+Invest', name: 'Lusso Invest Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 4, contact_detail: '+995 555 123456', contact_type: 'Phone' } },
    { id: 5, documentId: 'wfc-nike-lusso', slug: 'wfc-nike-lusso', companyName: 'WFC Nike Lusso', mainTitle: 'Football Club Partnership', mainDesc: 'A powerful synergy in sports and lifestyle.', contactTitle: 'Follow Us', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 105, url: 'https://placehold.co/200x200/B0C4DE/000000?text=WFC+Nike', name: 'WFC Nike Lusso Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 5, contact_detail: '@wfcnikelusso', contact_type: 'Social' } },
    { id: 6, documentId: 'lusso-construction', slug: 'lusso-construction', companyName: 'Lusso Construction', mainTitle: 'Building the future', mainDesc: 'Expertise in high-quality construction and infrastructure.', contactTitle: 'Our Projects', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 106, url: 'https://placehold.co/200x200/DDA0DD/000000?text=Lusso+Const', name: 'Lusso Construction Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: '', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 6, contact_detail: 'projects@lussoconstruction.ge', contact_type: 'Email' } },
    { id: 7, documentId: 'luxury-car', slug: 'luxury-car', companyName: 'Luxury Car', mainTitle: 'Exquisite Automotive Experiences', mainDesc: 'Curated collection of the world\'s most luxurious automobiles.', contactTitle: 'Discover More', createdAt: '', updatedAt: '', publishedAt: '', buttonTxt: null, companyLogo: { id: 107, url: 'https://placehold.co/200x200/F0E68C/000000?text=Luxury+Car', name: 'Luxury Car Logo', alternativeText: null, caption: null, width: 200, height: 200, formats: {}, hash: '', ext: '', mime: 'image/png', size: 0, previewUrl: null, provider: '', provider_metadata: null, createdAt: '', updatedAt: '', publishedAt: '' }, contactInfo: { id: 7, contact_detail: 'sales@luxurycar.com', contact_type: 'Email' } },
  ];


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
    <div className="min-h-screen bg-white text-gray-800 font-inter flex flex-col items-center p-4 relative overflow-hidden">
      {/* Hamburger Menu Icon */}
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 group"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className={`
            w-8 h-1 bg-gray-700 mb-1.5 rounded-full transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}
            group-hover:bg-blue-500
          `}></div>
        <div className={`
            w-8 h-1 bg-gray-700 mb-1.5 rounded-full transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-0' : ''}
            group-hover:bg-blue-500
          `}></div>
        <div className={`
            w-8 h-1 bg-gray-700 rounded-full transition-all duration-300 ease-in-out
            ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}
            group-hover:bg-blue-500
          `}></div>
      </button>

      {/* Full-screen Overlay Menu */}
      <div
        className={`
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
      <div className={mainLogoContainerClasses}>
        {/* Main Logo Inner Div */}
        <div className={mainLogoInnerClasses}>
          {/* Using an img tag for the main logo */}
          <img
            src="/images/logos/blu_holding.png" // Path to your main logo image
            alt="Main Logo"
            className="w-full h-full object-contain p-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error"; // Fallback image
            }}
          />
        </div>
      </div>

      {/* Spacer Div: This div reserves space for the main logo at the top
          after it has animated up. This pushes the content below it down. */}
      <div className={`
        w-full
        transition-all duration-1000 ease-in-out
        ${mainLogoTransitioning ? 'h-24 md:h-32 lg:h-40' : 'h-0'}
      `}></div>

      {/* Services Section: Holds the supplementary logos and other content. */}
      <div
        className={`
          w-full flex flex-col items-center flex-grow
          transition-opacity duration-1000 ease-in-out
          ${contentReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          pt-12 md:pt-16 lg:pt-20
        `}
      >
        {/* Display loading, error, or company logos */}
        {loadingLogos ? (
          <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 font-inter">
            <p className="text-lg text-gray-700">Loading company logos...</p>
          </div>
        ) : logosError ? (
          <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-red-100 text-red-800 font-inter p-4 rounded-lg">
            <p className="text-lg">{logosError}</p>
          </div>
        ) : companies && companies.length > 0 ? (
          <>
            {/* Other Logos Container - Top Row (first 4 logos) */}
            <div
              className={`
                flex flex-wrap justify-center gap-6 mb-6
                transition-opacity duration-1000 ease-in-out
                ${contentReady ? 'opacity-100' : 'opacity-0'}
                z-10
              `}
            >
              {companies.slice(0, 4).map((company, index) => (
                // Changed 'a' to 'div' and added onClick for React Router navigation
                <div 
                  key={company.id}
                  // Call handleCardClick with company.slug for navigation
                  onClick={() => handleCardClick(company.slug)} 
                  className={`
                    w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40
                    bg-white bg-opacity-70 rounded-xl flex flex-col items-center justify-center p-0
                    shadow-lg
                    transform-gpu transition-all duration-200 ease-out
                    hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer
                    ${contentReady ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                  `}
                  style={{ transitionDelay: contentReady ? `${index * 150}ms` : '0ms' }}
                >
                  {company.companyLogo && company.companyLogo.url ? (
                    <img
                      src={company.companyLogo.url} // This will be the absolute URL
                      alt={company.companyName || 'Company Logo'}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
                      }}
                    />
                  ) : (
                    <img
                      src={`https://placehold.co/200x200/CCCCCC/333333?text=No+Logo`}
                      alt="No Logo Available"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Other Logos Container - Bottom Row (remaining logos) */}
            <div
              className={`
                flex justify-center gap-6
                transition-opacity duration-1000 ease-in-out
                ${contentReady ? 'opacity-100' : 'opacity-0'}
                z-10
              `}
            >
              {companies.slice(4).map((company, index) => (
                // Changed 'a' to 'div' and added onClick for React Router navigation
                <div 
                  key={company.id}
                  // Call handleCardClick with company.slug for navigation
                  onClick={() => handleCardClick(company.slug)} 
                  className={`
                    w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40
                    bg-white bg-opacity-70 rounded-xl flex flex-col items-center justify-center p-0
                    shadow-lg
                    transform-gpu transition-all duration-200 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer
                    ${contentReady ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                  `}
                  style={{ transitionDelay: contentReady ? `${(index + 4) * 150}ms` : '0ms' }}
                >
                  {company.companyLogo && company.companyLogo.url ? (
                    <img
                      src={company.companyLogo.url} // This will be the absolute URL
                      alt={company.companyName || 'Company Logo'}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
                      }}
                    />
                  ) : (
                    <img
                      src={`https://placehold.co/200x200/CCCCCC/333333?text=No+Logo`}
                      alt="No Logo Available"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 font-inter">
            <p className="text-lg text-gray-700">No companies found.</p>
          </div>
        )}

        <div className={`mt-16 text-center transition-opacity duration-1000 ${contentReady ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xl md:text-2xl font-light">Welcome to our integrated solutions.</p>
        </div>
      </div>
    </div>
  );
}

// Page type definition
type SectionType = 'nike' | 'construction' | 'smart' | 'invest' | 'blu' | 'luxury';

// Common layout component for Nike and other pages - Simplified due to commented out imports
function PageLayout({ children, section }: { children: React.ReactNode; section?: SectionType }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}

// Main application component
function App() {
  return (
    <Routes>
      <Route path="/" element={<LussoMainPage />} />

      {/* Dynamic route for individual company pages, now using ':slug' */}
      <Route path="/companies/:slug" element={<CompanyDetailPage />} />

      All other routes are commented out as their components are not imported in your original code
        <Route path="/wfcnikelusso/*" element={<WfcNikeLussoLayout />}>
        <Route path="" element={<WfcNikeLusso />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:documentId" element={<AthleteDetailPage />} />
        <Route path="team/detail/:documentId" element={<AthleteDetailPage />} />
        <Route path="news" element={<NewsPage_new />} />
      
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="gallery/:documentId" element={<GalleryPage />} />
        <Route path="fixtures" element={<FixturesPage />} />
      </Route>

      {/* <Route path="/construction" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/construction/*" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/smartdevelopment" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/smartdevelopment/*" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/lussoinvest" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/lussoinvest/*" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/blucontrol" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/blucontrol/*" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/luxurycar" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycar/*" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycars" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycars/*" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/lussoautogallery" element={<UserRoute path="/lussoautogallery" element={<LussoAutoGallery />} />} />
      <Route path="/luxurycars/showroom" element={<UserRoute path="/luxurycars/showroom" element={<Showroom />} />} />
      <Route path="/luxurycars/aboutus" element={<UserRoute path="/luxurycars/about_us" element={<Aboutus />} />} />
      <Route path="/luxurycars/contactus" element={<UserRoute path="/luxurycars/contact_us" element={<Contactus />} />} />
      <Route path="/luxurycars/contact" element={<UserRoute path="/luxurycars/contact_us" element={<Contactus />} />} />
      <Route path="/luxurycars/contact_us" element={<UserRoute path="/luxurycars/contact_us" element={<Contactus />} />} />
      <Route path="/luxurycars/cars" element={<UserRoute path="/luxurycars/cars" element={<Cars />} />} />
      <Route path="/luxurycars/car" element={<UserRoute path="/luxurycars/cars" element={<Cars />} />} />
      <Route path="/luxurycars/ourcars" element={<UserRoute path="/luxurycars/cars" element={<Cars />} />} />
      <Route path="/luxurycars/cardetails/:slug" element={<CarDetail />} />  */}
    </Routes>
  );
}

export default App;
