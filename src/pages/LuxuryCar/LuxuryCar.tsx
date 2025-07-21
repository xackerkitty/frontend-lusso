import React, { useState, useEffect } from "react";

// --- Simple in-memory cache for SPA navigation ---
let cachedHeroData: any | null = null;
let cachedLogoData: any | null = null;
let cachedFeaturedCars: FeaturedCar[] = [];
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import "./components/navbar.css";
import "./scr/css/style.css";
import { useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
// --- Interface Definitions ---

interface MediaAttributes {
  url: string;
  mime?: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  // Add other attributes you might receive like formats, hash, etc. if you use them
}

interface MediaDataItem {
  id: number;
  attributes: MediaAttributes;
}

interface MediaData {
  data: MediaDataItem | MediaDataItem[] | null;
}

// Define a specific interface for single media fields
interface SingleMediaData {
  data: MediaDataItem | null;
}

interface FeaturedCar {
  id: number;
  carTitle?: string;
  carDesc?: string;
  carPhoto?: {
    data: MediaDataItem[] | null;
  };
  backgroundColor?: string;
}

// Location
interface locationSection {
  sectionTitle?: string;
  descLocation?: string;
}

interface ourCars {
  ourCarsTitle?: string;
  ourCarsDesc?: string;
  ourCarsBtn?: string;
}

// About Us section
interface aboutUsSection {
  aboutUsTitle?: string;
  aboutUsDesc?: string;
  buttonText?: string;
  carImage?: SingleMediaData;
  aboutUsBackground?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
}

interface LuxuryHeroAttributes {
  title?: string;
  subtitle?: string;
  cta?: string;
  videoUrl?: SingleMediaData;
  videoPoster?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  heroSection?: {
    lussoTitle?: string;
    lussoDesc?: string;
    buttonTxt?: string;
    landingVideo?: SingleMediaData;
    landingFailedImage?: {
      data?: {
        attributes: {
          url: string;
        };
      };
    };
  };
  basicinfo?: {
    companyName?: string;
    companyLogo?: SingleMediaData;
  };
  featuredCar?: FeaturedCar[];
  aboutUsSection?: aboutUsSection;
  aboutUsBackground?: SingleMediaData;
  porscheImage?: SingleMediaData;
  locationSection?: locationSection;
  ourCars?: ourCars;
}

// Fallback video source for robustness.
const FALLBACK_VIDEO_URL =
  "http://localhost:1337/uploads/landing_v2_03b5dc92f5.mp4";
const FALLBACK_VIDEO_MIME = "video/mp4";

// --- LuxuryHeroFetcher Component ---
// This component fetches and displays hero data, including a dynamic featured car section.
const LuxuryHeroFetcher = () => {
  // --- State Management ---
  // Use cached data if available
  const [heroData, setHeroData] = useState<any | null>(cachedHeroData);
  const [loading, setLoading] = useState(!cachedHeroData);
  const [error, setError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);
  // Featured cars state
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>(cachedFeaturedCars);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [logoData, setLogoData] = useState<any | null>(cachedLogoData);

  // Use base URL from environment variable only
  const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;

  // Helper to get best image format
  const getImageUrl = (imgObj: any) => {
    if (!imgObj) return '';
    let url = '';
    if (imgObj.formats) {
      if (imgObj.formats.large?.url) url = imgObj.formats.large.url;
      else if (imgObj.formats.medium?.url) url = imgObj.formats.medium.url;
      else if (imgObj.formats.small?.url) url = imgObj.formats.small.url;
      else if (imgObj.formats.thumbnail?.url) url = imgObj.formats.thumbnail.url;
    } else if (imgObj.url) {
      url = imgObj.url;
    }
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${STRAPI_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // --- Utility Function: getMediaUrl ---
  // Converts relative API paths to full URLs for media assets.
  const getMediaUrl = (
    mediaDataContent:
      | MediaDataItem
      | MediaDataItem[]
      | string
      | null
      | undefined
  ): string => {
    let url = '';
    if (typeof mediaDataContent === "string") {
      url = mediaDataContent;
    } else if (mediaDataContent && !Array.isArray(mediaDataContent)) {
      // It's a single MediaDataItem (e.g., logo.data, poster.data)
      url = getImageUrl(mediaDataContent.attributes);
    } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
      // It's an array of MediaDataItem (e.g., carPhoto.data)
      url = getImageUrl(mediaDataContent[0].attributes);
    } else {
      console.warn("getMediaUrl: No valid mediaDataContent provided or it's empty.");
      return "";
    }
    return url;
  };

  // --- useEffect Hook: Data Fetching and AOS Initialization ---
  // Handles data fetching and initializes the AOS library when the component mounts.
  useEffect(() => {
    if (cachedHeroData && cachedLogoData && cachedFeaturedCars.length > 0) {
      setHeroData(cachedHeroData);
      setLogoData(cachedLogoData);
      setFeaturedCars(cachedFeaturedCars);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch logo from /api/luxurycar?populate=*
        const logoRes = await fetch(`${STRAPI_BASE_URL}/api/luxurycar?populate=*`);
        if (!logoRes.ok) throw new Error(`HTTP error! Status: ${logoRes.status}`);
        const logoJson = await logoRes.json();
        setLogoData(logoJson.data);
        cachedLogoData = logoJson.data;

        const res = await fetch(`${STRAPI_BASE_URL}/api/luxurycars-home?populate[0]=mainBG&populate[1]=aboutUsBackground&populate[2]=carImg&populate[3]=featuredCar&populate[4]=featuredCar.carPhoto`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const json = await res.json();
        setHeroData(json.data);
        cachedHeroData = json.data;
        // Featured cars extraction
        if (json.data && json.data.featuredCar && Array.isArray(json.data.featuredCar)) {
          setFeaturedCars(json.data.featuredCar);
          cachedFeaturedCars = json.data.featuredCar;
        } else {
          setFeaturedCars([]);
          cachedFeaturedCars = [];
        }
      } catch (err: any) {
        setError(`Failed to load content: ${err.message}`);
        setFeaturedCars([]);
        cachedFeaturedCars = [];
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Button navigation handlers
  const navigate = useNavigate();
  const handleLearnMoreClick = () => navigate('/luxurycars/showroom');
  const handleAboutUsClick = () => navigate('/luxurycars/aboutus');
  const handleContactUsClick = () => navigate('/luxurycars/contact');
  const handleOurCarsClick = () => navigate('/luxurycars/cars');

  // Featured car logic
  const currentCar = featuredCars[currentCarIndex];
  const handlePreviousCar = () => {
    if (featuredCars.length > 0) {
      setCurrentCarIndex((prev) => (prev === 0 ? featuredCars.length - 1 : prev - 1));
    }
  };
  const handleNextCar = () => {
    if (featuredCars.length > 0) {
      setCurrentCarIndex((prev) => (prev === featuredCars.length - 1 ? 0 : prev + 1));
    }
  };

  // Get logo URL from /api/luxurycar
  const logoUrl = logoData?.logo ? getImageUrl(logoData.logo) : '';

  // --- Conditional Rendering for Loading and Error States ---
  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // --- Component JSX (Rendered Output) ---
  return (
    <div className="relative">
      {/* //////////////////////////////////////////////////////////////////////////// */}
      {/* { -------------------------|| Navbar begin || ---------------------------|| } */}

      <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />

      {/* ---------------------------|| Navbar End || ---------------------------||  */}
      {/*////////////////////////////////////////////////////////////////////////////*/}

      <div
        className="overflow-y-auto scroll-smooth"
        style={{
          height: "100vh",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| Hero/Landing begin || ---------------------------|| } */}

        {/* Displays the main introductory section with a background video or image. */}
        <section
          id="home"
          className="flex items-center justify-center relative bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 h-[calc(100vh-96px)] overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Video background */}
          {heroData?.mainBG && (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={getImageUrl(heroData.aboutUsBackground)}
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ pointerEvents: "none", display: videoLoaded ? "block" : "none" }}
              src={getImageUrl(heroData.mainBG)}
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setUseFallbackVideo(true)}
            />
          )}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
          {!videoLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="text-heading text-lg animate-pulse text-white">
                Loading video...
              </span>
            </div>
          )}
          {/* Main content overlaying the hero media */}
          <div className="relative z-10 text-center text-heading max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white flex flex-col items-center justify-center">
              <span> {heroData?.mainTitle || 'Welcome to '} </span>
              {logoUrl && (
                <img src={logoUrl} alt="Logo" style={{ maxHeight: '80px', margin: '32px auto 0 auto' }} />
              )}
            </h1>
            <div className="flex justify-center w-full">
              <button
                className="bg-green-900 hover:bg-green-800 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 border-2 border-white focus:outline-none focus:ring-4 focus:ring-green-900/40 flex items-center gap-3 mt-8"
                style={{ letterSpacing: '0.04em' }}
                onClick={handleLearnMoreClick}
              >
                {heroData?.mainBtnText || 'Explore Our Showroom'}
                <svg className="w-6 h-6 text-white ml-2 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* ---------------------------|| Hero/Landing End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}




        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| about us begin || ---------------------------|| } */}
        <section
          id="about"
          className="section-aboutus h-[calc(100vh-96px)] flex items-center justify-center bg-gray-600 text-white text-3xl"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* --- background image --- */}
          {heroData?.aboutUsBackground && (
            <img
              className="aboutUs_backgroundImg"
              src={getImageUrl(heroData.aboutUsBackground)}
              alt="About Us Background"
            />
          )}
          {/* --- car image --- */}
          {heroData?.carImg && (
            <img
              className="aboutUs_carPhoto"
              src={getImageUrl(heroData.carImg)}
              alt="Car"
            />
          )}
          <div className="textAboutUs">
            <h1 className="about_us_txt">{heroData?.aboutUsTitle}</h1>
            <p className="">{heroData?.aboutUsDesc}</p>
            <button className="aboutus-button" onClick={handleAboutUsClick}>
              <span>{heroData?.aboutusBtnText}</span>
            </button>
          </div>
        </section>

        {/* ---------------------------|| About us End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}

        

        
        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| Featured cars begin || ---------------------------|| } */}
    
        {/* Showcases a carousel of featured cars with navigation buttons. */}
        <section
          id="featured-cars"
          className="section_cars_we_offer h-[calc(100vh-96px)] "
          style={{
            scrollSnapAlign: "start",
            backgroundColor: currentCar?.backgroundColor || "",
          }}
        >
          <h2 className="cwo_title">Our Featured Cars</h2>
          <div className="cwo-content">
            <div className="cwo-text">
              {currentCar ? (
                <div className="text-center">
                  <h1 className="gradient-text-title carTitle">{currentCar.carTitle}</h1>
                  <p className="gradient-text-desc ">{currentCar.carDesc}</p>
                </div>
              ) : (
                <p className="text-xl">No featured cars available.</p>
              )}
            </div>
            <div className="cwo-buttons">
              {currentCar && featuredCars.length > 1 ? (
                <>
                  <button className="button_elegant button_v1 get-bigger" onClick={handleOurCarsClick}>See more</button>
                  <button className="button_elegant button_v2 get-bigger" onClick={handleContactUsClick}>Contact</button>
                </>
              ) : (
                <p className="text-xl">No featured cars available.</p>
              )}
            </div>
          </div>
          {/* Show the carPhoto for each featured car, fallback to carImg if missing */}
          <div className="cwo-car-image-container ">
            <div className="text-center mt-8">
              {currentCar?.carPhoto ? (
                <img
                  src={getImageUrl(currentCar.carPhoto)}
                  alt={currentCar?.carTitle || "Featured Car"}
                  className="cwo-car-image"
                />
              ) : heroData?.carImg ? (
                <img
                  src={getImageUrl(heroData.carImg)}
                  alt={currentCar?.carTitle || "Featured Car"}
                  className="cwo-car-image"
                />
              ) : null}
            </div>
            <svg
              className="cwo-svg"
              width="859"
              height="201"
              viewBox="0 0 859 201"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Next Button */}
              <g id="moveToNextCar_button_group" onClick={handleNextCar} className="cursor-pointer" filter="url(#filter0_b_58_50)">
                <g clipPath="url(#clip0_58_50)">
                  <rect x="572" y="151" width="42" height="43" rx="21" fill="white" fillOpacity="0.18" />
                  <path d="M588.578 160.985L599.161 172.002L589.583 183.903" stroke="white" strokeWidth="1.65277" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <rect x="572.5" y="151.5" width="41" height="42" rx="20.5" stroke="white" />
              </g>
              {/* Previous Button */}
              <g id="moveToPrevCar_button_group" onClick={handlePreviousCar} className="cursor-pointer" filter="url(#filter1_b_58_50)">
                <g clipPath="url(#clip1_58_50)">
                  <rect width="42.5543" height="41.3541" rx="20.677" transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 548.53 158)" fill="white" fillOpacity="0.18" />
                  <path d="M532.078 166.724L520.156 178.801L532.939 189.645" stroke="white" strokeWidth="1.65277" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <rect x="-0.485142" y="0.516884" width="41.5543" height="40.3541" rx="20.177" transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 547.544 158.017)" stroke="white" />
              </g>
              {/* Overlaying SVG Path */}
              <path id="overlaying_svg" d="M416.12 2C74.9536 18.6624 -324.798 232.444 439.956 184.657C1186.73 137.994 772.508 1.99983 416.12 2Z" stroke="url(#paint0_linear_58_50)" strokeOpacity="0.7" strokeWidth="3" />
              <defs>
                <filter id="filter0_b_58_50" x="479.5" y="58.5" width="227" height="228" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="46.25" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_58_50" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_58_50" result="shape" />
                </filter>
                <filter id="filter1_b_58_50" x="413.5" y="65.5" width="228.734" height="227.792" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="46.25" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_58_50" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_58_50" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_58_50" x1="476.674" y1="182.568" x2="469.013" y2="49.8858" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="0.775" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <clipPath id="clip0_58_50">
                  <rect x="572" y="151" width="42" height="43" rx="21" fill="white" />
                </clipPath>
                <clipPath id="clip1_58_50">
                  <rect width="42.5543" height="41.3541" rx="20.677" transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 548.53 158)" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </section>
        {/* ---------------------------|| Featured Cars End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}

      




        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| Our cars begin || ---------------------------|| } */}

        <section
          id="our_cars"
          className="h-[calc(100vh-96px)] flex items-center justify-center bg-gray-700 text-white text-3xl"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="relative w-full  h-[calc(100vh)] bg-white rounded-3xl overflow-hidden shadow-xl card-inner-shadow main-card-effect cursor-pointer flex items-center justify-center">
            {/* Blurry Background Layer */}
            <div className="absolute inset-0 blurry-background"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-6 rounded-3xl">
              <div className="text-center w-full">
                <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-wide">
                  Our Cars
                </h1>
                <p className="text-white text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                  Explore our exclusive collection of luxury vehicles.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-12 px-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/1200px-Lamborghini_Logo.svg.png"
                    alt="Lamborghini Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                  <img
                    src="https://i.redd.it/when-you-realize-it-is-actually-a-ferrari-which-is-actually-v0-xck74yvryfua1.png?width=1200&format=png&auto=webp&s=dfd369f5bf850b7ffecb348eb19d78e70a6b910f"
                    alt="Ferrari Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                  <img
                    src="https://images.seeklogo.com/logo-png/16/2/porsche-logo-png_seeklogo-168544.png"
                    alt="Porsche Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                  <img
                    src="https://cdn.freebiesupply.com/logos/large/2x/mercedes-benz-9-logo-svg-vector.svg"
                    alt="Mercedes-Benz Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                  <img
                    src="https://pngimg.com/uploads/bmw_logo/bmw_logo_PNG19707.png"
                    alt="BMW Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                  <img
                    src="https://images.seeklogo.com/logo-png/1/2/audi-logo-png_seeklogo-13450.png"
                    alt="Audi Logo"
                    className="h-20 w-20 object-contain logo-item cursor-pointer"
                  />
                </div>
                <button className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-semibold hover:text-gray-900 explore-button shadow-lg" onClick={handleOurCarsClick}>
                  Explore
                </button>
              </div>
            </div>
          </div>
        </section>

         {/* ---------------------------|| Our Cars End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}








         {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| location begin || ---------------------------|| } */}
        <section
          id="location"
          className="location_section h-[calc(100vh-96px)] flex flex-col items-center justify-center text-black text-3xl p-4"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-4 text-black">
              {heroData?.locationTitle}
            </h2>
            <p className="text-xl text-black">
              {heroData?.locationDesc}
            </p>
          </div>
          <div className="relative w-full max-w-4xl h-96 bg-gray-950 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1428.6398474235532!2d44.76948188322064!3d41.819053622244475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4044735ac5019363%3A0x8b995a731c788f59!2sLusso%20Luxury%20Car!5e1!3m2!1sen!2sge!4v1750926931945!5m2!1sen!2sge"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location on Google Maps"
              className="rounded-xl"
            ></iframe>
          </div>
          {heroData?.carImg && (
            <img
              className="absolute car-test"
              src={getImageUrl(heroData.carImg)}
              alt="Car"
            />
          )}
        </section>
        {/* ---------------------------|| location End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}


        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* { -------------------------|| Footer begin || ---------------------------|| } */} 
        <section
          className="h-screen flex flex-col bg-white"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* This div acts as the main content area of the 100vh section, taking up all available space above the footer */}
          <div className="flex-grow flex items-center justify-center text-gray-700">
            {/* Placeholder for your main content in this section */}
          </div>

          <Footer logoUrl={logoUrl} />
        </section>
         {/* ---------------------------|| Footer End || ---------------------------||  */}
        {/*////////////////////////////////////////////////////////////////////////////*/}

        
      </div>
    </div>
  );
};

export default LuxuryHeroFetcher;
