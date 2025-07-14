import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CompanyDetailPage from './pages/CompanyDetailPage';
import BluControl from './pages/BluControl';
import Construction from './pages/Construction';
import SmartDevelopment from './pages/SmartDevelopment';
import LussoInvest from './pages/LussoInvest';
import LussoAutoGallery from './pages/lusso-autogallery';
import LuxuryCar from './pages/LuxuryCar/LuxuryCar';
import LuxuryCarTest from './pages/LuxuryCar/pages/LuxuryCarsV2';
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
import GalleryPage from './pages/wfcnikelusso/GalleryPage';
import FixturesPage from './pages/wfcnikelusso/FixturesPage';
import "./style.css";

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

  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const API_COMPANIES_URL = `${BASE_API_URL}/api/companies?populate=*`;

  const navigate = useNavigate();

  const handleCardClick = (companySlug: string) => {
    if (companySlug && typeof companySlug === 'string' && companySlug.trim() !== '') {
      navigate(`/companies/${companySlug}`);
    } else {
      setLogosError("Could not navigate to company page due to missing information.");
    }
  };

  useEffect(() => {
    setInitialPopIn(true);
    const transitionTimer = setTimeout(() => setMainLogoTransitioning(true), 2500);
    const contentTimer = setTimeout(() => setContentReady(true), 3800);

    const fetchCompanies = async () => {
      try {
        const response = await fetch(API_COMPANIES_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const companiesWithAbsoluteUrlsAndSlugs = data.data.map((company: any) => {
          if (!company) return null;
          const generatedSlug = company.slug ||
            (company.companyName
              ? company.companyName.toLowerCase().replace(/\s/g, '-').replace(/llc$/, '')
              : `company-${company.id || Math.random().toString(36).substring(7)}`);
          let companyLogo: CompanyLogo | null = null;
          if (company.companyLogo) {
            const logoAttributes = company.companyLogo;
            companyLogo = {
              id: logoAttributes.id,
              name: logoAttributes.name,
              alternativeText: logoAttributes.alternativeText,
              caption: logoAttributes.caption,
              width: logoAttributes.width,
              height: logoAttributes.height,
              formats: logoAttributes.formats || null,
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
              url: logoAttributes.url.startsWith('http://') || logoAttributes.url.startsWith('https://')
                ? logoAttributes.url
                : `${BASE_API_URL}${logoAttributes.url}`
            };
          }
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
        }).filter(Boolean);
        setCompanies(companiesWithAbsoluteUrlsAndSlugs);
      } catch (err: any) {
        setLogosError("Failed to load company logos. Please try again later.");
        setCompanies([]); // fallback to empty array if error
      } finally {
        setLoadingLogos(false);
      }
    };

    fetchCompanies();

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // --- DESIGN FROM LuxuryCarsV2.tsx ---
  // Use .luxury-bg for background and .main-logo for logo
  return (
    <div className="luxury-bg min-h-screen font-inter flex flex-col items-center p-4 relative overflow-hidden">
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

      {/* Main Logo Container */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 transform-gpu
          transition-all duration-1000 ease-in-out
          ${initialPopIn ? 'opacity-100' : 'opacity-0'}
          ${mainLogoTransitioning ? 'top-8 md:top-10' : 'top-1/2 -translate-y-1/2'}
          z-20
        `}
      >
        <div
          className={`
            bg-transparent flex items-center justify-center
            transition-all duration-1000 ease-in-out
            ${mainLogoTransitioning
              ? 'rounded-xl w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64'
              : 'rounded-full w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px]'}
          `}
        >
          <img
            src="/images/companyLogos/bluholding.png"
            alt="Main Logo"
            className="main-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/100x100/E0E0E0/000000?text=Error";
            }}
          />
        </div>
      </div>

      {/* Spacer Div */}
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
            <div
              className={`
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6
                transition-opacity duration-1000 ease-in-out
                ${contentReady ? 'opacity-100' : 'opacity-0'}
                z-10
              `}
            >
              {companies.slice(0, 6).map((company, index) => (
                <div
                  key={company.id}
                  onClick={() => handleCardClick(company.slug)}
                  className={`
                    w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40
                    rounded-xl flex flex-col items-center justify-center p-0
                    shadow-lg
                    transform-gpu transition-all duration-200 ease-out
                    hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer
                    ${contentReady ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                  `}
                  style={{ transitionDelay: contentReady ? `${index * 150}ms` : '0ms' }}
                >
                  {company.companyLogo && company.companyLogo.url ? (
                    <img
                      src={company.companyLogo.url}
                      alt={company.companyName || 'Company Logo'}
                      className="company-logo-img"
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
                      className="company-logo-img"
                    />
                  )}
                </div>
              ))}
            </div>
            <div
              className={`
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6
                transition-opacity duration-1000 ease-in-out
                ${contentReady ? 'opacity-100' : 'opacity-0'}
                z-10
              `}
            >
              {companies.slice(6, 12).map((company, index) => (
                <div
                  key={company.id}
                  onClick={() => handleCardClick(company.slug)}
                  className={`
                    w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40
                    rounded-xl flex flex-col items-center justify-center p-0
                    shadow-lg
                    transform-gpu transition-all duration-200 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer
                    ${contentReady ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                  `}
                  style={{ transitionDelay: contentReady ? `${(index + 6) * 150}ms` : '0ms' }}
                >
                  {company.companyLogo && company.companyLogo.url ? (
                    <img
                      src={company.companyLogo.url}
                      alt={company.companyName || 'Company Logo'}
                      className="company-logo-img"
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
                      className="company-logo-img"
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


       <Route path="/construction" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/construction/*" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/smartdevelopment" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/smartdevelopment/*" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/lussoinvest" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/lussoinvest/*" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/blucontrol" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/blucontrol/*" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/luxurycar" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycars/test" element={<UserRoute path="/luxurycars/test" element={<LuxuryCarTest />} />} />
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
      <Route path="/luxurycars/cardetails/:slug" element={<CarDetail />} />  
    </Routes>
  );
}

export default App;
