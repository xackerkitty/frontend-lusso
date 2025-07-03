import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
  // Manages the component's data and UI state.
  const [heroData, setHeroData] = useState<LuxuryHeroAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

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
    let relativePath: string | undefined;

    if (typeof mediaDataContent === "string") {
      relativePath = mediaDataContent; // It's already a direct URL string
    } else if (mediaDataContent && !Array.isArray(mediaDataContent)) {
      // It's a single MediaDataItem (e.g., logo.data, poster.data)
      relativePath = mediaDataContent.attributes?.url;
    } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
      // It's an array of MediaDataItem (e.g., carPhoto.data)
      relativePath = mediaDataContent[0].attributes?.url;
    } else {
      console.warn(
        "getMediaUrl: No valid mediaDataContent provided or it's empty."
      );
      return ""; // Return empty string or a placeholder if no path
    }

    if (!relativePath) {
      console.warn(
        "getMediaUrl: extracted relativePath was empty or undefined."
      );
      return "";
    }

    // Ensure this base URL is correct for your Strapi instance
    // It's highly recommended to use environment variables for this.
    const STRAPI_BASE_URL = "http://localhost:1337";

    let fullUrl = "";
    if (
      relativePath.startsWith("http://") ||
      relativePath.startsWith("https://")
    ) {
      fullUrl = relativePath; // Already a full URL
    } else {
      // Handle cases where relativePath might start with a leading slash or not
      fullUrl = `${STRAPI_BASE_URL}${
        relativePath.startsWith("/") ? "" : "/"
      }${relativePath}`;
    }

    console.log(
      `DEBUG: getMediaUrl input: "${relativePath}" -> output URL: "${fullUrl}"`
    );
    return fullUrl;
  };

  // --- useEffect Hook: Data Fetching and AOS Initialization ---
  // Handles data fetching and initializes the AOS library when the component mounts.
  useEffect(() => {
    // AOS.init({
    //   duration: 1000,
    //   once: true,
    // });

    const fetchData = async () => {
      try {
        const heroApiUrl =
          "http://localhost:1337/api/luxury-heroes?populate[basicinfo][populate]=companyLogo&populate[heroSection][populate]=*&populate[videoPoster]=*&populate[videoUrl]=*&populate[aboutUsBackground]=*&populate[porscheImage]=*&populate[featuredCar][populate]=*&populate[aboutUsSection][populate]=*&populate[locationSection][populate]=*&populate[ourCars][populate]=*";

        const heroResponse = await fetch(heroApiUrl);
        if (!heroResponse.ok) {
          throw new Error(
            `HTTP error fetching hero data! Status: ${heroResponse.status}`
          );
        }
        const heroJson = await heroResponse.json();
        console.log("Fetched Luxury Hero Data:", heroJson); // Log the raw fetched data

        if (heroJson?.data?.length > 0) {
          const attributes = heroJson.data[0].attributes;
          setHeroData(attributes);
          console.log("Featured Cars Data:", attributes.featuredCar);
        } else {
          setHeroData(null);
          console.warn("API returned no data for Luxury Hero.");
        }
      } catch (err: any) {
        setError(`Failed to load content: ${err.message}`);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Derived URLs for Navbar and About Us section images.
  const logoUrl = heroData?.basicinfo?.companyLogo?.data
    ? getMediaUrl(heroData.basicinfo.companyLogo.data)
    : "";

  const lussoBgUrl = heroData?.aboutUsSection?.aboutUsBackground?.data
    ?.attributes?.url
    ? getMediaUrl(
        heroData?.aboutUsSection?.aboutUsBackground?.data?.attributes?.url
      )
    : "";


    // BUTTONSSS
    const navigate = useNavigate(); // Initialize the navigate hook

  
    const handleLearnMoreClick = () => {
    navigate('/luxurycars/showroom');
     };

    const handleAboutUsClick = () => {
    navigate('/luxurycars/aboutus');
     };

    const handleContactUsClick = () => {
    navigate('/luxurycars/contact');
     };

     const handleOurCarsClick = () => {
    navigate('/luxurycars/cars');
     };

  const porscheUrl = heroData?.porscheImage?.data
    ? getMediaUrl(heroData.porscheImage.data)
    : "";

  // --- Event Handlers: Featured Car Navigation ---
  // Functions to navigate through the featured cars carousel.
  // --- Event Handlers: Featured Car Navigation ---
  const handlePreviousCar = () => {
    const featuredCarsArray = heroData?.featuredCar;
    if (featuredCarsArray && featuredCarsArray.length > 0) {
      setCurrentCarIndex((prevIndex) =>
        prevIndex === 0 ? featuredCarsArray.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextCar = () => {
    const featuredCarsArray = heroData?.featuredCar;
    if (featuredCarsArray && featuredCarsArray.length > 0) {
      setCurrentCarIndex((prevIndex) =>
        prevIndex === featuredCarsArray.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const currentCar = heroData?.featuredCar?.[currentCarIndex];

  console.log("--- Rendering Check ---");
  console.log("heroData:", heroData);
  console.log("currentCarIndex:", currentCarIndex);
  console.log("currentCar:", currentCar);
  console.log("Is currentCar truthy?", !!currentCar);
  console.log(
    "Is heroData?.featuredCar an array?",
    Array.isArray(heroData?.featuredCar)
  );
  console.log("heroData?.featuredCar.length:", heroData?.featuredCar?.length);

  // --- Conditional Rendering for Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // --- Component JSX (Rendered Output) ---
  // Defines the visual structure of the component.
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
          {loading ? null : error && !useFallbackVideo ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-900/50">
              <span className="text-red-400 text-lg">
                Error loading content: {error}
              </span>
            </div>
          ) : (heroData &&
              (heroData.heroSection?.landingVideo?.data?.attributes?.url ||
                heroData.videoUrl?.data?.attributes?.url)) ||
            useFallbackVideo ? (
            <>
              {/* Video and Overlay */}
              <video
                autoPlay
                loop
                muted
                playsInline
                key={useFallbackVideo ? "fallback-video" : "primary-video"}
                poster={
                  heroData?.videoPoster?.data?.attributes?.url
                    ? getMediaUrl(heroData.videoPoster.data.attributes.url)
                    : undefined
                }
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  pointerEvents: "none",
                  display: videoLoaded ? "block" : "none",
                }}
                onLoadedData={() => {
                  setVideoLoaded(true);
                  console.log("Video loaded successfully!");
                }}
                onError={(e) => {
                  console.error("VIDEO LOAD ERROR:", e);
                  if (e.currentTarget.error) {
                    switch (e.currentTarget.error.code) {
                      case e.currentTarget.error.MEDIA_ERR_ABORTED:
                        console.error("Video playback aborted.");
                        break;
                      case e.currentTarget.error.MEDIA_ERR_NETWORK:
                        console.error("Network error during video load.");
                        break;
                      case e.currentTarget.error.MEDIA_ERR_DECODE:
                        console.error("Decoding error during video playback.");
                        break;
                      case e.currentTarget.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        console.error("Unsupported or missing video source.");
                        break;
                      default:
                        console.error("Unknown video error.");
                        break;
                    }
                  }
                  if (!useFallbackVideo) {
                    setError(
                      "Failed to load primary video. Attempting fallback."
                    );
                    setUseFallbackVideo(true);
                    setVideoLoaded(false);
                  } else {
                    setError(
                      "Failed to load video (both primary and fallback). Displaying image fallback."
                    );
                    setHeroData(null); // Set heroData to null to trigger image fallback
                  }
                }}
              >
                {useFallbackVideo ? (
                  <source src={FALLBACK_VIDEO_URL} type={FALLBACK_VIDEO_MIME} />
                ) : heroData?.heroSection?.landingVideo?.data?.attributes
                    ?.url ? (
                  <source
                    src={getMediaUrl(
                      heroData.heroSection.landingVideo.data.attributes.url
                    )}
                    type={
                      heroData.heroSection.landingVideo.data.attributes.mime ||
                      "video/mp4"
                    }
                  />
                ) : heroData?.videoUrl?.data?.attributes?.url ? (
                  <source
                    src={getMediaUrl(heroData.videoUrl.data.attributes.url)}
                    type={heroData.videoUrl.data.attributes.mime || "video/mp4"}
                  />
                ) : null}
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
              {!videoLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <span className="text-heading text-lg animate-pulse text-white">
                    {useFallbackVideo
                      ? "Loading fallback video..."
                      : "Loading video..."}
                  </span>
                </div>
              )}
            </>
          ) : (
            // Fallback image if no video, or if videos failed.
            <div className="absolute inset-0 z-0">
              {heroData?.heroSection?.landingFailedImage?.data?.attributes
                ?.url ? (
                <img
                  src={getMediaUrl(
                    heroData.heroSection.landingFailedImage.data.attributes.url
                  )}
                  alt="Fallback Luxury background"
                  className="w-full h-full object-cover opacity-40"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1500&q=80"
                  alt="Default Luxury background"
                  className="w-full h-full object-cover opacity-40"
                />
              )}
            </div>
          )}
          {/* Main content overlaying the hero media */}
          <div className="relative z-10 text-center text-heading max-w-2xl mx-auto">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <span className="text-heading text-2xl animate-pulse">
                  Loading content...
                </span>
              </div>
            )}
            {error && !loading && !useFallbackVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 rounded-lg">
                <span className="text-red-400 text-xl">{error}</span>
              </div>
            )}

            <h1 className=" text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white">
              {heroData?.heroSection?.lussoTitle
                ? heroData.heroSection.lussoTitle
                : heroData?.title
                ? heroData.title
                : "Welcome to "}
              <span className="text-primary">Lu$$o</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-8 drop-shadow text-gray-500">
              {heroData?.heroSection?.lussoDesc
                ? heroData.heroSection.lussoDesc
                : heroData?.subtitle
                ? heroData.subtitle
                : "Experience the Pinnacle of Luxury"}
            </p>
            {(heroData?.heroSection?.buttonTxt ||
              heroData?.cta ||
              "Learn More") && (
              <button
            className="bg-primary hover:bg-primary/80 text-heading px-10 py-5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
            onClick={handleLearnMoreClick} // Add the onClick handler here
          >
                {heroData?.heroSection?.buttonTxt
                  ? heroData.heroSection.buttonTxt
                  : heroData?.cta || "Learn More"}
              </button>
            )}
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
          <img
            className="aboutUs_backgroundImg"
            src={getMediaUrl(
              heroData?.aboutUsSection?.aboutUsBackground?.data?.attributes.url
            )}
          />

          {/* --- car image --- */}
          <img
            className="aboutUs_carPhoto"
            src={getMediaUrl(
              heroData?.aboutUsSection?.carImage?.data?.attributes.url
            )}
          />

          <div className="textAboutUs">
            <h1 className="about_us_txt">
              {heroData?.aboutUsSection?.aboutUsTitle}
            </h1>

            <p className="">{heroData?.aboutUsSection?.aboutUsDesc}</p>
            <button className="aboutus-button" onClick={handleAboutUsClick}>
              <span>{heroData?.aboutUsSection?.buttonText}</span>
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
                  <h1 className="gradient-text-title carTitle">
                    {currentCar.carTitle}
                  </h1>
                  <p className="gradient-text-desc ">{currentCar.carDesc}</p>
                </div>
              ) : (
                <p className="text-xl">No featured cars available.</p>
              )}
            </div>

           
            <div className="cwo-buttons">
              {" "}
             
              {currentCar &&
              heroData?.featuredCar &&
              heroData.featuredCar.length > 1 ? (
                <>
                  <button
                    className="button_elegant button_v1 get-bigger" 
                    onClick={handleOurCarsClick}
                  >
                    See more
                  </button>
                  <button
                    className="button_elegant button_v2 get-bigger"
                    onClick={handleContactUsClick}
                  >
                    Contact
                  </button>
                </>
              ) : (
                <p className="text-xl">No featured cars available.</p>
              )}
            </div>
          </div>

          {heroData?.featuredCar && heroData.featuredCar.length > 1 && (
            <div className="cwo-car-image-container ">
              {currentCar &&
              currentCar.carPhoto?.data &&
              currentCar.carPhoto.data.length > 0 &&
              currentCar.carPhoto.data[0]?.attributes?.url ? (
                <div className="text-center mt-8">
                  <img
                    src={getMediaUrl(
                      currentCar.carPhoto.data[0].attributes.url
                    )}
                    alt={currentCar.carTitle || "Featured Car"}
                    className="cwo-car-image"
                  />
                </div>
              ) : (
                currentCar && (
                  <p className="text-xl mt-8">
                    No image available for this car.
                  </p>
                )
              )}

              <svg
                className="cwo-svg"
                width="859"
                height="201"
                viewBox="0 0 859 201"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Next Button */}
                <g
                  id="moveToNextCar_button_group"
                  onClick={handleNextCar}
                  className="cursor-pointer"
                  filter="url(#filter0_b_58_50)"
                >
                  <g clipPath="url(#clip0_58_50)">
                    <rect
                      x="572"
                      y="151"
                      width="42"
                      height="43"
                      rx="21"
                      fill="white"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M588.578 160.985L599.161 172.002L589.583 183.903"
                      stroke="white"
                      strokeWidth="1.65277"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <rect
                    x="572.5"
                    y="151.5"
                    width="41"
                    height="42"
                    rx="20.5"
                    stroke="white"
                  />
                </g>

                {/* Previous Button */}
                <g
                  id="moveToPrevCar_button_group"
                  onClick={handlePreviousCar}
                  className="cursor-pointer"
                  filter="url(#filter1_b_58_50)"
                >
                  <g clipPath="url(#clip1_58_50)">
                    <rect
                      width="42.5543"
                      height="41.3541"
                      rx="20.677"
                      transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 548.53 158)"
                      fill="white"
                      fillOpacity="0.18"
                    />
                    <path
                      d="M532.078 166.724L520.156 178.801L532.939 189.645"
                      stroke="white"
                      strokeWidth="1.65277"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <rect
                    x="-0.485142"
                    y="0.516884"
                    width="41.5543"
                    height="40.3541"
                    rx="20.177"
                    transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 547.544 158.017)"
                    stroke="white"
                  />
                </g>

                {/* Overlaying SVG Path */}
                <path
                  id="overlaying_svg"
                  d="M416.12 2C74.9536 18.6624 -324.798 232.444 439.956 184.657C1186.73 137.994 772.508 1.99983 416.12 2Z"
                  stroke="url(#paint0_linear_58_50)"
                  strokeOpacity="0.7"
                  strokeWidth="3"
                />
                <defs>
                  <filter
                    id="filter0_b_58_50"
                    x="479.5"
                    y="58.5"
                    width="227"
                    height="228"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                      in="BackgroundImageFix"
                      stdDeviation="46.25"
                    />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_58_50"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_58_50"
                      result="shape"
                    />
                  </filter>
                  <filter
                    id="filter1_b_58_50"
                    x="413.5"
                    y="65.5"
                    width="228.734"
                    height="227.792"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                      in="BackgroundImageFix"
                      stdDeviation="46.25"
                    />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_58_50"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_58_50"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_58_50"
                    x1="476.674"
                    y1="182.568"
                    x2="469.013"
                    y2="49.8858"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="0.775" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="clip0_58_50">
                    <rect
                      x="572"
                      y="151"
                      width="42"
                      height="43"
                      rx="21"
                      fill="white"
                    />
                  </clipPath>
                  <clipPath id="clip1_58_50">
                    <rect
                      width="42.5543"
                      height="41.3541"
                      rx="20.677"
                      transform="matrix(-0.999415 0.0341914 0.0291314 0.999576 548.53 158)"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}
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
                  {heroData?.ourCars?.ourCarsTitle}
                </h1>
                <p className="text-white text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                 {heroData?.ourCars?.ourCarsDesc}
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
                   {heroData?.ourCars?.ourCarsBtn}
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
            <h2 className="text-5xl font-bold mb-4 text-blacm">
               {heroData?.locationSection?.sectionTitle}
            </h2>
            {/* Updated address details */}
            <p className="text-xl text-black">
               {heroData?.locationSection?.descLocation}
            </p>
          </div>
          {/* Map container with car image positioned at bottom right */}
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
            {/* Car image positioned to pop out further from the bottom right corner */}
          </div>
          {heroData?.aboutUsSection?.carImage?.data?.attributes?.url && (
            <img
              className="absolute car-test" // Increased negative values for bottom/right, and increased width
              src={getMediaUrl(
                heroData.aboutUsSection.carImage.data.attributes.url
              )}
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
