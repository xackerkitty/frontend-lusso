
// ! Importing React and hooks to build the page and handle state/side effects
import React, { useState, useEffect } from 'react';
// * Navbar, Footer, and LoadingScreen are custom components for layout and user experience
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
// * Importing the CSS for this page
import '../scr/css/aboutus.css';

// ! This file is the About Us page for Lusso. It shows info about the company, values, and more.
// * It uses React and some custom components for the navbar, footer, and loading screen.
// ? Curious how the data is structured? See the interfaces below!

// * This describes a single value (like a company value)
interface Value {
    id: number;
    valueTitle: string | null;
    valueDesc: string | null;
}

// * This describes a single "Why Us" reason
interface WhyUsItem {
    id: number;
    whyUsTitle: string | null;
    whyUsDesc: string | null;
}

// * This describes an image/media object from the API
interface Media {
    url: string;
    formats?: {
        large?: { url: string };
        medium?: { url: string };
        small?: { url: string };
        thumbnail?: { url: string };
    };
}

// ! This is the main shape of all the data for the About Us page
interface AboutUsData {
    id: number;
    documentId: string;
    mainTitle: string;
    mainDesc: string;
    buttonTxt: string;
    JourneyTitleTxt: string;
    JourneyDesc: string;
    CTA_title: string;
    CTA_Desc: string;
    CTA_buttonTxt: string;
    ourValues?: Value[];
    whyUs?: WhyUsItem[];
    whyUsImg?: Media | null;
    JourneyIMG?: Media | null;
    mainBGImg?: Media | null; 
    // ? If you add more fields to the API, add them here too!
}


// ! This is the base URL for the API, set in your environment variables
const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;
// * This is the full API endpoint to get all About Us data, including images
const API_URL = `${STRAPI_BASE_URL}/api/luxurycars-aboutus?populate=*`;

// * Helper function to get the correct image URL from the API response
// ? This makes sure we always show the best quality image available
const getMediaUrl = (media: any): string => {
    if (!media) return '';
    if (typeof media === 'string') return media;
    // * Try to use the largest image format first
    if (media.formats) {
        if (media.formats.large?.url) {
            return media.formats.large.url.startsWith('http') ? media.formats.large.url : `${STRAPI_BASE_URL}${media.formats.large.url}`;
        }
        if (media.formats.medium?.url) {
            return media.formats.medium.url.startsWith('http') ? media.formats.medium.url : `${STRAPI_BASE_URL}${media.formats.medium.url}`;
        }
        if (media.formats.small?.url) {
            return media.formats.small.url.startsWith('http') ? media.formats.small.url : `${STRAPI_BASE_URL}${media.formats.small.url}`;
        }
        if (media.formats.thumbnail?.url) {
            return media.formats.thumbnail.url.startsWith('http') ? media.formats.thumbnail.url : `${STRAPI_BASE_URL}${media.formats.thumbnail.url}`;
        }
    }
    // * If no formats, just use the main URL
    if (media.url) return media.url.startsWith('http') ? media.url : `${STRAPI_BASE_URL}${media.url}`;
    // ? Sometimes the image is nested deeper (Strapi v4)
    if (media.data && media.data.attributes && media.data.attributes.url) {
        const url = media.data.attributes.url;
        return url.startsWith('http') ? url : `${STRAPI_BASE_URL}${url}`;
    }
    // ! If nothing works, return empty string so no broken image
    return '';
};


// * Simple in-memory cache so we don't re-fetch data if user navigates back and forth
let cachedAboutData: AboutUsData | null = null;
let cachedLogoData: any | null = null;


// ! This is the main About Us page component
const Aboutus: React.FC = () => {
    // * These are React state variables to keep track of our data and UI state
    // ? 'data' holds all the info for the page, 'loading' shows a spinner, 'error' shows if something went wrong
    const [data, setData] = useState<AboutUsData | null>(cachedAboutData);
    const [loading, setLoading] = useState(!cachedAboutData);
    const [loadingVisible, setLoadingVisible] = useState(!cachedAboutData);
    const [error, setError] = useState<string | null>(null);
    // * This tracks how far the user has scrolled, for parallax effect
    const [scrollY, setScrollY] = useState(0);
    // * This holds the logo image data
    const [logoData, setLogoData] = useState<any | null>(cachedLogoData);


    // ! This effect listens for scroll events to create a parallax effect on the hero section
    useEffect(() => {
        window.addEventListener('scroll', () => setScrollY(window.scrollY));
        return () => window.removeEventListener('scroll', () => setScrollY(window.scrollY));
    }, []);


    // ! This effect fetches the About Us data from the API when the page loads
    useEffect(() => {
        if (cachedAboutData) {
            setData(cachedAboutData);
            // For cached data, show loading for minimum 2 seconds
            setTimeout(() => {
                setLoadingVisible(false);
                setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
            }, 2000); // Minimum 2s for cached data
            return;
        }
        
        setLoading(true);
        setError(null);
        const startTime = Date.now(); // Track when loading started
        
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(json => {
                setData(json.data);
                cachedAboutData = json.data;
            })
            .catch(err => setError(err.message))
            .finally(() => {
                const loadTime = Date.now() - startTime;
                const minLoadTime = 2000; // Minimum 2 seconds
                const remainingTime = Math.max(0, minLoadTime - loadTime);
                
                setTimeout(() => {
                    setLoadingVisible(false);
                    setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
                }, remainingTime);
            });
    }, []);


    // * This effect fetches the logo image from the API (used in the navbar and footer)
    useEffect(() => {
        if (cachedLogoData) {
            setLogoData(cachedLogoData);
            return;
        }
        const fetchLogo = async () => {
            try {
                // ? We use a separate API endpoint just for the logo
                const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;
                const luxuryCarApiUrl = `${STRAPI_BASE_URL}/api/luxurycar?populate=*`;
                const luxuryCarResponse = await fetch(luxuryCarApiUrl);
                if (!luxuryCarResponse.ok) throw new Error('Failed to fetch logo');
                const luxuryCarJson = await luxuryCarResponse.json();
                setLogoData(luxuryCarJson?.data || null);
                cachedLogoData = luxuryCarJson?.data || null;
            } catch (e) {
                setLogoData(null);
            }
        };
        fetchLogo();
    }, []);


    // * Get the logo image URL using our helper
    const logoUrl = logoData?.logo?.url ? getMediaUrl(logoData.logo) : '';

    // * Calculate how much to move the hero text for the parallax effect
    const parallaxOffset = scrollY * 0.2;
    // * Split the main title into words so we can animate them one by one
    const titleWords = (data?.mainTitle || '').split(' ');


    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#1a202c] overflow-x-hidden font-inter antialiased">

            {/* Loading Screen Overlay */}
            {loading && (
                <div 
                    className={`fixed inset-0 z-[9999] w-full h-full transition-opacity duration-1000 ${
                        loadingVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{backgroundColor: 'rgb(26, 54, 47)'}}
                >
                    <LoadingScreen isVisible={loadingVisible} />
                </div>
            )}

            {/* Show error or no data messages only when not loading */}
            {!loading && error && (
                <div className="text-center p-8 text-red-600 font-bold">Error: {error}</div>
            )}
            {!loading && !error && !data && (
                <div className="text-center p-8 text-gray-700">No data found.</div>
            )}

            {/* Main content - only show when we have data or when still loading */}
            {(data || loading) && (
                <>
                    {/* //////////////////////////////////////////////////////////////////////////// */}
                    {/* { -------------------------|| Navbar begin || ---------------------------|| } */}
                    <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} hideOnScrollDown={true}/>
                    {/* ---------------------------|| Navbar End || ---------------------------||  */}
                    {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| Hero Section begin || ---------------------|| } */}
            <section
                className="relative min-h-screen flex items-center justify-center text-white overflow-hidden hero-background-container py-24 sm:py-32 lg:py-48"
                aria-label="About Us Hero Section"
            >
                {/* // * Show a big background image if available, otherwise use a fallback color */}
                {data?.JourneyIMG ? (
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center hero-background-media"
                        style={{
                            backgroundImage: `url('${getMediaUrl(data.JourneyIMG)}')`,
                        }}
                    ></div>
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-background-media bg-[#1e3a24] opacity-80"></div>
                )}
                {/* // * Glassmorphism overlay for a modern blurry effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a24cc] via-[#1e3a24b3] to-transparent backdrop-blur-md" aria-hidden="true"></div>
                {/* // * Floating blurred logo/watermark in the background */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 select-none">
                    <span className="text-[15vw] font-extrabold tracking-widest" style={{textShadow:'0 8px 32px #000'}}>LUSSO</span>
                </div>
                {/* // ! Main Content: Title, description, and button */}
                <div
                    className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center hero-content-wrapper"
                    style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                    {/* ? This is the big animated title at the top. Each word pops in one by one. */}
                    <h1
                        className="text-5xl sm:text-7xl lg:text-8xl font-extrabold mb-1 sm:mb-2 tracking-widest text-white hero-title animate-fade-in-up drop-shadow-[0_4px_32px_rgba(30,58,36,0.5)]"
                        style={{
                            lineHeight: '1.15',
                            minHeight: 'min(18vw, 10em)',
                            wordBreak: 'break-word',
                        }}
                    >
                        {titleWords.map((word, index) => (
                            <span
                                key={index}
                                className={`inline-block overflow-visible animate-word-pop ${word.includes(',') ? 'text-emerald-300' : ''}`}
                                style={{
                                    animationDelay: `${0.1 * index}s`,
                                    verticalAlign: 'baseline',
                                    paddingBottom: '0.1em',
                                }}
                            >
                                <span className="block" style={{lineHeight: '1.15'}}>{word}</span>
                            </span>
                        ))}
                    </h1>
                    {/* // ? This is the main description text under the title. */}
                    {/* <p
                        className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 sm:mb-10 opacity-90 text-gray-200 animate-fade-in-up delay-700 hero-description"
                        style={{
                            marginTop: 'clamp(-0.5em, -2vw, -1.2em)',
                        }}
                    >
                        {data.mainDesc}
                    </p> */}
                    {/* // ! Button you see under the description. It uses the text from the API. */}
                    {/* <a
                        href="#"
                        className="inline-block bg-emerald-600 text-white font-bold py-4 px-12 sm:py-5 sm:px-16 rounded-full shadow-xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 animate-button-slide-up hero-button"
                        aria-label={data.buttonTxt}
                    >
                        {data.buttonTxt}
                    </a> */}
                </div>
                {/* // * Animated scroll-down indicator to show there's more below */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
                    <span className="block w-2 h-2 rounded-full bg-white mb-1"></span>
                    <span className="block w-1 h-8 rounded-full bg-gradient-to-b from-white/80 to-transparent"></span>
                </div>
            </section>
            {/* ---------------------------|| Hero Section End || ---------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| Our Story begin || ------------------------|| } */}
            <section className="aboutUsSec bg-white min-h-screen flex items-center py-16 sm:py-24" aria-labelledby="our-story-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        {/* // * Title for the story section */}
                        <h2 id="our-story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] mb-4 sm:mb-6">
                            {data?.JourneyTitleTxt}
                        </h2>
                        {/* // ? First paragraph of the story, split by double newlines */}
                        <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 text-gray-700">
                            {data?.JourneyDesc?.split("\n\n")[0]}
                        </p>
                        {/* // ? Second paragraph of the story, if available */}
                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                            {data?.JourneyDesc?.split("\n\n")[1]}
                        </p>
                    </div>
                    {/* // * Show the journey image on the right */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        {data?.JourneyIMG && (
                            <img
                                src={getMediaUrl(data.JourneyIMG)}
                                alt="Our Journey image"
                                className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                                loading="lazy"
                            />
                        )}
                    </div>
                </div>
            </section>
            {/* ---------------------------|| Our Story End || ------------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| Our Values begin || -----------------------|| } */}
            <section className="ourValues bg-[#1e3a24] text-white min-h-screen flex items-center relative overflow-hidden py-20 sm:py-32" aria-labelledby="our-values-heading">
                {/* // * Blurry LUSSO text in the background for style */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="lusso-blurry-text">LUSSO</span>
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 w-full">
                    <h2 id="our-values-heading" className="text-4xl sm:text-5xl font-extrabold mb-16 text-white">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {Array.isArray(data?.ourValues) && data.ourValues.filter(v => v.valueTitle && v.valueDesc).length > 0 ? (
                            // ! Show each value in a nice card if available
                            data.ourValues.filter(v => v.valueTitle && v.valueDesc).map((value) => (
                                <div key={value.id} className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200">
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700 transition-colors duration-300">{value.valueTitle}</h3>
                                    <p className="text-base text-gray-700 leading-relaxed">{value.valueDesc}</p>
                                </div>
                            ))
                        ) : (
                            // * If no values, show a placeholder message
                            <div className="col-span-full text-gray-300">No values found.</div>
                        )}
                    </div>
                </div>
            </section>
            {/* ---------------------------|| Our Values End || -----------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| Why Choose Us begin || --------------------|| } */}
            <section className="aboutUsSec bg-white min-h-screen flex items-center py-16 sm:py-24" aria-labelledby="why-choose-us-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <h2 id="why-choose-us-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] text-center mb-8 sm:mb-12">
                        Why Choose Lusso?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* // * Show the image for this section if available */}
                        <div className="flex justify-center">
                            {data?.whyUsImg && (
                                <img
                                    src={getMediaUrl(data.whyUsImg)}
                                    alt="Why Choose Us image"
                                    className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                                    loading="lazy"
                                />
                            )}
                        </div>
                        <div>
                            <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700">
                                {Array.isArray(data?.whyUs) && data.whyUs.filter(w => w.whyUsTitle && w.whyUsDesc).length > 0 ? (
                                    // ! Show each reason as a list item with a checkmark
                                    data.whyUs.filter(w => w.whyUsTitle && w.whyUsDesc).map((item) => (
                                        <li key={item.id} className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">{item.whyUsTitle}</h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.whyUsDesc}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    // * If no reasons, show a placeholder
                                    <li className="text-gray-300">No reasons found.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* ---------------------------|| Why Choose Us End || --------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| CTA Section begin || ---------------------|| } */}
            <section className="size-50vh beforeFooter bg-[#1e3a24] text-white  flex items-center text-center py-16 sm:py-24" aria-label="Call to action to contact specialists">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* * Title for the CTA section */}
                    <h2 className="beforefooter_text text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
                        {data?.CTA_title}
                    </h2>
                    {/* ? Description for the CTA section */}
                    <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90 text-gray">
                        {data?.CTA_Desc}
                    </p>
                    {/* ! Button to go to the contact page */}
                    <a
                        href="/luxurycars/contact"
                        className="inline-block bg-white text-[#1e3a24] font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        aria-label={data?.CTA_buttonTxt}
                    >
                        {data?.CTA_buttonTxt}
                    </a>
                </div>
            </section>
            {/* ---------------------------|| CTA Section End || ---------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

            {/* //////////////////////////////////////////////////////////////////////////// */}
            {/* { -------------------------|| Footer begin || ---------------------------|| } */}
            <Footer logoUrl={logoUrl} />
            {/* ---------------------------|| Footer End || ---------------------------||  */}
            {/*////////////////////////////////////////////////////////////////////////////*/}

                </>
            )}
        </div>
    );
};

export default Aboutus;