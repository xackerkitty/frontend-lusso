import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../scr/css/aboutus.css'; // Ensure this CSS file is used for global styles or specific overrides if needed

// --- Type Definitions (As provided, assuming they are in a types.ts or similar shared file) ---
interface MediaAttributes {
    url: string;
    mime?: string; // Added mime type for video detection
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
}

interface MediaDataItem {
    id: number;
    attributes: MediaAttributes;
}

interface SingleMediaData {
    data: MediaDataItem | null;
}

interface BasicInfoAttributes {
    companyName?: string;
    companyLogo?: SingleMediaData;
}

interface LuxuryHeroAttributes {
    basicinfo?: BasicInfoAttributes;
    videoPoster?: SingleMediaData;
    videoUrl?: SingleMediaData; // This will still be fetched but not directly used for hero background now
    aboutUsBackground?: SingleMediaData; // This will still be fetched but used as a general fallback if AU_mainBG fails
    porscheImage?: SingleMediaData;
    ourStoryTitle?: string;
    aboutUsTextP1?: string;
    aboutUsTextP2?: string;
    heroSection?: {};
    featuredCar?: {};
    aboutUsSection?: {};
    locationSection?: {};
    ourCars?: {};
}

interface LCMainSectionAttributes {
    id: number;
    AU_TitleText?: string;
    AU_mainDesc?: string;
    buttonTxt?: string;
    AU_mainBG?: SingleMediaData; // This is the source for our hero background
}

interface LCAUJourneySectionAttributes {
    id: number;
    Au_JourneyTitleTxt?: string;
    AU_JourneyDesc?: string;
    AU_journeyBG?: SingleMediaData;
}

interface LCAUValueItemAttributes {
    id: number;
    AU_valueTxt?: string;
    AU_valueDesc?: string;
    iconIdentifier?: string;
}

interface LCAUWhyChooseUsItemAttributes {
    id: number;
    AU_whyUsTitle?: string;
    whyUsText?: string;
}

interface AUMainSectionAttributes {
    AU_mainBG?: SingleMediaData; // This is for the root AU_mainSection, kept for robustness but LC_mainSection.AU_mainBG is priority
    LC_mainSection?: LCMainSectionAttributes;
    LC_AU_JourneySection?: LCAUJourneySectionAttributes;
    LC_AU_Values?: LCAUValueItemAttributes[];
    LC_AU_WhyChooseUs?: LCAUWhyChooseUsItemAttributes[];
    WCU_IMG?: SingleMediaData;
}

interface StrapiDataItem<T> {
    id: number;
    attributes: T;
}

interface StrapiSingleResponse<T> {
    data: StrapiDataItem<T> | null;
    meta: any;
}

interface StrapiCollectionResponse<T> {
    data: StrapiDataItem<T>[];
    meta: any;
}

// --- Constants and Utility Functions ---
const iconMap: { [key: string]: React.ReactNode } = {
    quality: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18s-2.5-3-4-5c-1.5-2-2-4-2-6 0-3.314 2.686-6 6-6s6 2.686 6 6c0 2-1 4-2.5 6-1.5 2-4 5-4 5z" />
        </svg>
    ),
    client: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4h2a1 1 0 001-1v-3a1 0 00-1-1h-2a1 1 0 00-1 1v3a1 1 0 001 1z" />
        </svg>
    ),
    innovation: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    default: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
};

const STRAPI_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

const getMediaUrl = (
    mediaDataContent: SingleMediaData['data'] | string | undefined
): string => {
    let relativePath: string | undefined;

    if (typeof mediaDataContent === "string") {
        relativePath = mediaDataContent;
    } else if (mediaDataContent && 'attributes' in mediaDataContent) {
        relativePath = mediaDataContent.attributes?.url;
    } else {
        return "";
    }

    if (!relativePath) {
        return "";
    }

    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        return relativePath;
    } else {
        return `${STRAPI_BASE_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
    }
};

// --- React Component ---
const Aboutus: React.FC = () => {
    const [heroData, setHeroData] = useState<LuxuryHeroAttributes | null>(null);
    const [auMainSectionData, setAuMainSectionData] = useState<AUMainSectionAttributes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const heroApiUrl = `${STRAPI_BASE_URL}/api/luxury-heroes?populate[basicinfo][populate]=companyLogo&populate[heroSection][populate]=*&populate[videoPoster]=*&populate[videoUrl]=*&populate[aboutUsBackground]=*&populate[porscheImage]=*&populate[featuredCar][populate]=*&populate[aboutUsSection][populate]=*&populate[locationSection][populate]=*&populate[ourCars][populate]=*&populate[aboutUsTextP1]=*&populate[aboutUsTextP2]=*&populate[ourStoryTitle]=*`;

            // Populate AU_mainBG and its attributes to get mime type
            const auMainSectionPopulate = [
                "populate[LC_mainSection][populate]=AU_TitleText,AU_mainDesc,buttonTxt,AU_mainBG",
                "populate[AU_mainBG]=*", // Fallback if AU_mainBG is directly on main section
                "populate[LC_AU_JourneySection][populate]=AU_JourneyTitleTxt,AU_JourneyDesc,AU_journeyBG", // Explicitly populate for journey section
                "populate[LC_AU_Values]=AU_valueTxt,AU_valueDesc,iconIdentifier", // Explicitly populate for values
                "populate[LC_AU_WhyChooseUs]=AU_whyUsTitle,whyUsText", // Explicitly populate for why choose us
                "populate[WCU_IMG]=*",
            ].join('&');

            const auMainSectionApiUrl = `${STRAPI_BASE_URL}/api/au-main-section?${auMainSectionPopulate}`;

            const [heroResponse, auMainSectionResponse] = await Promise.all([
                fetch(heroApiUrl),
                fetch(auMainSectionApiUrl)
            ]);

            if (!heroResponse.ok) {
                throw new Error(`HTTP error fetching hero data! Status: ${heroResponse.status}`);
            }
            const heroJson: StrapiCollectionResponse<LuxuryHeroAttributes> = await heroResponse.json();
            setHeroData(heroJson.data?.[0]?.attributes || null);

            if (!auMainSectionResponse.ok) {
                throw new Error(`HTTP error fetching AU_mainSection data! Status: ${auMainSectionResponse.status}. Check Strapi server logs.`);
            }
            const auMainSectionJson: StrapiSingleResponse<AUMainSectionAttributes> = await auMainSectionResponse.json();
            setAuMainSectionData(auMainSectionJson.data?.attributes || null);

        } catch (err: any) {
            setError(`Failed to load content: ${err.message}`);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const logoUrl = getMediaUrl(heroData?.basicinfo?.companyLogo?.data);

    // --- Data Destructuring & Fallbacks ---
    const mainSection = auMainSectionData?.LC_mainSection;
    const journeySection = auMainSectionData?.LC_AU_JourneySection;
    const valuesSection = auMainSectionData?.LC_AU_Values;
    const whyChooseUsSection = auMainSectionData?.LC_AU_WhyChooseUs;

    // Dynamic Hero Background Media (Image or Video from AU_mainBG)
    const auMainBgMedia = mainSection?.AU_mainBG?.data || auMainSectionData?.AU_mainBG?.data;
    const heroBgUrl = getMediaUrl(auMainBgMedia);
    const isHeroBgVideo = auMainBgMedia?.attributes?.mime?.startsWith('video/');

    // Fallback image if AU_mainBG is not set or fails
    const fallbackHeroImage = getMediaUrl(heroData?.aboutUsBackground?.data) || 'https://placehold.co/1920x1080/0A1C0D/ffffff?text=Luxury+Car+Hero';

    // Other section background images
    const journeyBackgroundImage = getMediaUrl(journeySection?.AU_journeyBG?.data) || 'https://placehold.co/600x400/1e3a24/ffffff?text=Our+Story';
    const whyChooseUsImage = getMediaUrl(auMainSectionData?.WCU_IMG?.data) || 'https://placehold.co/600x400/1e3a24/ffffff?text=Why+Choose+Us';

    if (loading) {
        return <div className="text-center p-8 text-gray-700">Loading showroom data...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 font-bold">Error: {error}</div>;
    }

    // Calculate parallax effect for the hero text/button
    const parallaxOffset = scrollY * 0.2; // Adjust multiplier for desired speed

    // Split title for word-by-word animation
    const titleWords = (mainSection?.AU_TitleText || "Driving Excellence, Defining Luxury").split(' ');

    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#1a202c] overflow-x-hidden font-inter antialiased">
            <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />

            {/* Hero Section - Reworked for Cinematic Luxury with Dynamic BG */}
            <section
                className="relative py-24 sm:py-32 lg:py-48 flex items-center justify-center text-white overflow-hidden min-h-screen hero-background-container"
                aria-label="About Us Hero Section"
            >
                {/* Dynamic Background Media from AU_mainBG */}
                {isHeroBgVideo && heroBgUrl ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover object-center hero-background-media"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={getMediaUrl(auMainBgMedia?.attributes?.alternativeText) || fallbackHeroImage}
                    >
                        <source src={heroBgUrl} type={auMainBgMedia?.attributes?.mime || 'video/mp4'} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center hero-background-media"
                        style={{ backgroundImage: `url('${heroBgUrl || fallbackHeroImage}')` }}
                    ></div>
                )}

                {/* Stronger, Dynamic Dark Green Gradient Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-dark-green-overlay-start via-dark-green-overlay-mid to-transparent animate-gradient-reveal"
                    aria-hidden="true"
                ></div>

                {/* Main Content - Centered and impactful */}
                <div
                    className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center hero-content-wrapper"
                    style={{ transform: `translateY(${parallaxOffset}px)` }} // Parallax effect
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight text-white hero-title">
                        {titleWords.map((word, index) => (
                            <span
                                key={index}
                                className={`inline-block overflow-hidden animate-word-pop ${word.includes(',') ? 'text-emerald-300' : ''}`}
                                style={{ animationDelay: `${0.1 * index}s` }}
                            >
                                <span className="block">{word}</span>
                            </span>
                        ))}
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 sm:mb-10 opacity-90 text-gray-200 animate-fade-in-up delay-700 hero-description">
                        {mainSection?.AU_mainDesc || "Experience the pinnacle of automotive luxury and performance."}
                    </p>
                    <a
                        href="#"
                        className="inline-block bg-emerald-600 text-white font-bold py-4 px-12 sm:py-5 sm:px-16 rounded-full shadow-xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 animate-button-slide-up hero-button"
                        aria-label={mainSection?.buttonTxt || "Explore Our Legacy"}
                    >
                        {mainSection?.buttonTxt || "Explore Our Legacy"}
                    </a>
                </div>
            </section>

            {/* Our Story Section */}
            <section
                className="aboutUsSec bg-white py-16 sm:py-24"
                aria-labelledby="our-story-heading"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <h2
                            id="our-story-heading"
                            className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] mb-4 sm:mb-6"
                        >
                            {journeySection?.Au_JourneyTitleTxt ||
                                "Our Journey of Passion and Precision"}
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 text-gray-700">
                            {journeySection?.AU_JourneyDesc?.split("\n\n")[0] ||
                                "At Lusso Luxury Car, we are committed to delivering high-quality, reliable, and eco-friendly luxury vehicles that combine elegance with advanced performance. Since our launch in 2023, we’ve focused on redefining automotive passion through innovative design and modern technology. Each Lusso model is crafted to offer a refined driving experience that reflects both style and functionality."}
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                            {journeySection?.AU_JourneyDesc?.split("\n\n")[1] ||
                                "Sustainability and customer satisfaction are at the heart of everything we do. From development to delivery, we take an eco-conscious approach while maintaining the highest standards of excellence. At Lusso, we believe true luxury means driving with purpose—where performance, innovation, and responsibility come together seamlessly."}
                        </p>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center">
                        <img
                            src={journeyBackgroundImage}
                            alt={
                                journeySection?.Au_JourneyTitleTxt ||
                                "Our Story Image depicting luxury car journey"
                            }
                            className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Our Values Section - Dark Green Background with White Cards */}
            <section
                className="ourValues bg-[#1e3a24] text-white py-20 sm:py-32 relative overflow-hidden" // Added relative & overflow-hidden for absolute positioning
                aria-labelledby="our-values-heading"
            >
                {/* Blurry Lusso Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="lusso-blurry-text">LUSSO</span>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10"> {/* Added relative z-10 for content over Lusso text */}
                    <h2
                        id="our-values-heading"
                        className="text-4xl sm:text-5xl font-extrabold mb-16 text-white"
                    >
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {valuesSection?.length ? (
                            valuesSection.map((valueItem) => (
                                <div
                                    key={valueItem.id}
                                    className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200"
                                >
                                    <div className="mb-6">
                                        {React.cloneElement(
                                            iconMap[
                                                valueItem.iconIdentifier || "default"
                                            ] as React.ReactElement,
                                            {
                                                className:
                                                    "h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-emerald-600",
                                            }
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700 transition-colors duration-300">
                                        {valueItem.AU_valueTxt || "Value Title"}
                                    </h3>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                        {valueItem.AU_valueDesc ||
                                            "Description of this core value."}
                                    </p>
                                </div>
                            ))
                        ) : (
                            // Default values if data not loaded
                            <>
                                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200">
                                    <div className="mb-6">{iconMap["quality"]}</div>
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700">
                                        Unrivaled Quality
                                    </h3>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                        Every vehicle and service meets the highest standards of
                                        excellence and meticulous attention to detail.
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200">
                                    <div className="mb-6">{iconMap["client"]}</div>
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700">
                                        Client-Centric Approach
                                    </h3>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                        We prioritize our clients' desires, delivering tailored
                                        experiences and fostering lasting relationships.
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200">
                                    <div className="mb-6">{iconMap["innovation"]}</div>
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700">
                                        Innovation & Integrity
                                    </h3>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                        Continuously embracing advancements while upholding the
                                        highest ethical standards in every interaction.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section
                className="aboutUsSec bg-white py-16 sm:py-24"
                aria-labelledby="why-choose-us-heading"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        id="why-choose-us-heading"
                        className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] text-center mb-8 sm:mb-12"
                    >
                        Why Choose Lusso?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="flex justify-center">
                            <img
                                src={whyChooseUsImage}
                                alt="Why Choose Us image, showcasing luxury and trust"
                                className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700">
                                {whyChooseUsSection?.length ? (
                                    whyChooseUsSection.map((whyUsItem) => (
                                        <li key={whyUsItem.id} className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">
                                                    {whyUsItem.AU_whyUsTitle ||
                                                        "Default Why Choose Us Title"}
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    {whyUsItem.whyUsText ||
                                                        "Default why choose us description."}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    // Default values if data not loaded
                                    <>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">
                                                    Exclusive Selection
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    Access to a meticulously curated inventory of rare and
                                                    sought-after luxury vehicles.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">
                                                    Personalized Concierge Service
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    Dedicated advisors providing bespoke services from
                                                    selection to after-sales care.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">
                                                    Uncompromising Standards
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    Every vehicle undergoes rigorous inspection to ensure
                                                    peak condition and authenticity.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">
                                                    Legacy of Trust
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    Decades of experience building a reputation for
                                                    integrity and client satisfaction.
                                                </p>
                                            </div>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="beforeFooter bg-[#1e3a24] text-white py-16 sm:py-24 text-center"
                aria-label="Call to action to contact specialists"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="beforefooter_text text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
                        Ready to Experience True Luxury?
                    </h2>
                    <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90 text-gray">
                        Connect with our team today to begin your journey with Luxury Lanes.
                    </p>
                    <a
                        href="/luxurycars/contact"
                        className="inline-block bg-white text-[#1e3a24] font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        aria-label="Contact Our Specialists"
                    >
                        Contact Our Specialists
                    </a>
                </div>
            </section>
            <Footer logoUrl={logoUrl} />
        </div>
    );
};

export default Aboutus;