// src/pages/ShowroomPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- ABSOLUTELY CRITICAL: IMPORT LOCAL PLACEHOLDER IMAGES ---
import defaultMainImage from '../scr/images/gallery01.png';
import defaultAboutImage from '../scr/images/gallery01.png';

// Import the Navbar component from the components directory
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define Strapi Data Interfaces

// Represents a single media item's attributes (URL, dimensions, etc.)
interface MediaAttributes {
    url: string;
    mime?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
}

// Represents the data wrapper for a single media item
interface MediaDataItem {
    id: number;
    attributes: MediaAttributes;
}

// Represents a field in Strapi that holds a single media item (e.g., an image, a video file)
interface SingleMediaData {
    data: MediaDataItem | null; // 'data' can be null if no media is uploaded
}

// Attributes for the 'BasicInfo' component (assuming it holds company logo)
interface BasicInfoAttributes {
    companyName?: string;
    companyLogo?: SingleMediaData;
}

// Attributes for the 'LuxuryHero' single type/component
interface LuxuryHeroAttributes {
    basicinfo?: BasicInfoAttributes;
    videoPoster?: SingleMediaData; // Poster image for the video
    videoUrl?: SingleMediaData;    // Actual video file URL
    aboutUsBackground?: SingleMediaData; // Background image for about us (if any, not used in this specific hero but good to keep)
}

// Interface for the repeatable component 'SR_mainCards'
interface SRMainCard {
    id: number;
    Title: string;
    Description: string;
}

// Interface for a single 'GalleryImageCard' repeatable component
interface GalleryImageCard {
    id: number; // Strapi provides an ID for repeatable components
    Title: string;
    Description: string;
    Image: SingleMediaData; // The image associated with this gallery card
    spanColumns?: number; // Field added in Strapi to control grid spanning (1 or 2)
}

// Interface for the 'ShowroomPage' Single Type's main attributes
interface ShowroomPageAttributes {
    mainTitle?: string;
    mainDesc?: string;
    SR_mainCards?: SRMainCard[];
    discoverTitle?: string;
    discoverP1?: string;
    discoverp2?: string; // Corrected casing to 'discoverp2' based on your API response
    descriptionIMG?: SingleMediaData; // Image for the 'AboutSection'
    GalleryImageCard?: GalleryImageCard[]; // The array of gallery items
}

// Generic Strapi Response Structures

// For a single entry (e.g., a Single Type like ShowroomPage)
interface StrapiDataItem<T> {
    id: number;
    attributes: T;
}
interface StrapiSingleResponse<T> {
    data: StrapiDataItem<T> | null;
    meta: any;
}

// For a collection of entries (e.g., if LuxuryHero was a Collection Type)
interface StrapiCollectionResponse<T> {
    data: StrapiDataItem<T>[];
    meta: any;
}

// --- Tailwind CSS Color Utility Classes (unchanged) ---
const COLORS = {
    mainDarkGreen: 'bg-dark-green-main',
    accentDarkGreen: 'bg-dark-green-accent',
    buttonGreenPrimary: 'bg-green-primary hover:bg-green-hover',
    white: 'bg-white',
    grayTextDark: 'text-gray-900',
    grayTextLight: 'text-gray-100',
    grayTextMedium: 'text-gray-300',
    grayTextLighter: 'text-gray-400',
};

// --- Helper function to construct full media URL from Strapi data (unchanged) ---
const getMediaUrl = (
    mediaDataContent: MediaDataItem | MediaDataItem[] | string | null | undefined
): string => {
    let relativePath: string | undefined;

    if (typeof mediaDataContent === "string") {
        relativePath = mediaDataContent;
    } else if (mediaDataContent && !Array.isArray(mediaDataContent)) {
        relativePath = mediaDataContent.attributes?.url;
    } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
        relativePath = mediaDataContent[0].attributes?.url;
    } else {
        console.warn("getMediaUrl: No valid mediaDataContent provided or it's empty.");
        return "";
    }

    if (!relativePath) {
        console.warn("getMediaUrl: extracted relativePath was empty or undefined.");
        return "";
    }

    const STRAPI_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

    let fullUrl = "";
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        fullUrl = relativePath;
    } else {
        fullUrl = `${STRAPI_BASE_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
    }
    return fullUrl;
};

// --- Intersection Observer Hook for animations (unchanged) ---
const useIntersectionObserver = (
    ref: React.RefObject<HTMLElement>,
    options: IntersectionObserverInit = { threshold: 0.1 }
) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return isVisible;
};

// --- Animated Section Component (unchanged) ---
const AnimatedSection: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
    id?: string;
}> = ({ children, className = '', delay = 0, threshold = 0.2, id }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(sectionRef, { threshold });

    return (
        <div
            ref={sectionRef}
            id={id}
            className={`${className} transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- Hero Section Component (MODIFIED FOR HEIGHT AND LAYOUT) ---
const HeroSection: React.FC<{
    videoSrc: string;
    posterSrc: string;
    scrollToNextSection: () => void;
    mainTitle: string;
    mainDescription: string;
    pillars: SRMainCard[];
}> = ({ videoSrc, posterSrc, scrollToNextSection, mainTitle, mainDescription, pillars }) => {
    const heroContainerRef = useRef<HTMLElement>(null);
    const [videoTransform, setVideoTransform] = useState('translateY(0%)');
    const [videoBlur, setVideoBlur] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleScroll = useCallback(() => {
        if (heroContainerRef.current) {
            const { top, height } = heroContainerRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const parallaxOffset = scrollY * 0.5;
            setVideoTransform(`translateY(-${parallaxOffset}px)`);
            const scrollProgressOutOfView = Math.max(0, -top / (height * 0.5));
            const blurAmount = Math.min(scrollProgressOutOfView * 6, 8);
            setVideoBlur(blurAmount);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (videoRef.current) {
                    if (entry.isIntersecting) {
                        videoRef.current.play().catch(e => console.error("Video play failed:", e));
                    } else {
                        videoRef.current.pause();
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={heroContainerRef}
            // Removed justify-center to allow content to push height
            // Increased vertical padding (py-32 for larger screens, pt-24 pb-16 for smaller)
            // Added larger top/bottom padding for mobile (sm:py-24) to ensure title visibility and space for cards
            className="mainCard relative w-full min-h-screen flex flex-col items-center pt-24 pb-16 sm:pt-32 sm:pb-24 md:py-32 overflow-hidden"
        >
            <video
                ref={videoRef}
                className="card-video absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                poster={posterSrc}
                style={{ transform: videoTransform, filter: `blur(${videoBlur}px)` }}
            >
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black bg-opacity-70 before:content-[''] before:absolute before:inset-0 before:bg-radial-gradient-vignette before:opacity-50"></div>

            <div className="relative text-center z-10 max-w-5xl mx-auto flex flex-col px-4">
                <h1
                    className={`text-5xl md:text-6xl font-heading font-extrabold mb-8 ${COLORS.grayTextLight} drop-shadow-lg
                        animate-fade-in-up-custom animate-breathe text-shimmer-light`}
                    style={{ animationDelay: '200ms' }}
                >
                    {mainTitle}
                </h1>
                <p
                    className={`text-xl md:text-2xl ${COLORS.grayTextLight} mb-12 leading-relaxed max-w-3xl mx-auto
                        animate-fade-in-up-custom`}
                    style={{ animationDelay: '600ms' }}
                >
                    {mainDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                    {pillars.map((pillar, index) => (
                        <div
                            key={pillar.id || index}
                            className={`p-6 rounded-lg backdrop-filter backdrop-blur-sm bg-white bg-opacity-10
                                    shadow-lg border border-white border-opacity-20
                                    transform transition-all duration-500 ease-out
                                    hover:bg-opacity-20 hover:scale-[1.02] hover:shadow-xl hover:border-green-primary
                                    animate-fade-in-up-custom`}
                            style={{ animationDelay: `${800 + (100 * index)}ms` }}
                        >
                            <h3 className={`text-2xl font-heading font-bold mb-2 ${COLORS.grayTextLight}`}>
                                {pillar.Title}
                            </h3>
                            <p className={`text-base ${COLORS.grayTextMedium}`}>
                                {pillar.Description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative bottom-8 z-10 animate-bounce cursor-pointer mt-auto" onClick={scrollToNextSection}>
                <svg
                    className="w-12 h-12 text-green-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                </svg>
            </div>
        </section>
    );
};

// --- About Section Component (unchanged logic, dynamic content) ---
const AboutSection: React.FC<{
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageSrc: string;
}> = ({ title, paragraph1, paragraph2, imageSrc }) => {
    return (
        <AnimatedSection
            id="about-section"
            className={`py-24 px-4 md:px-12 w-full flex flex-col lg:flex-row items-center gap-16 ${COLORS.white} ${COLORS.grayTextDark} shadow-xl rounded-b-lg`}
            threshold={0.2}
            
        >
            <div className="lg:w-1/2 flex-shrink-0 relative group">
                <div className="absolute inset-0 border-4 border-green-primary rounded-lg transform translate-x-4 -translate-y-4 md:translate-x-8 md:-translate-y-8 z-0 opacity-60"></div>
                <img
                    src={imageSrc}
                    alt="Showroom Interior"
                    className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-2xl transform transition-transform duration-700 ease-in-out group-hover:scale-[1.02] relative z-10"
                    onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x400/333/FFF?text=Image+Error`;
                        e.currentTarget.alt = "Image failed to load";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-lg z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <p className="text-3xl font-heading font-bold drop-shadow-md">Discover the Difference</p>
                </div>
            </div>

            <div className="lg:w-1/2 text-left">
                <h2 className={`text-5xl font-heading font-extrabold mb-6 ${COLORS.grayTextDark}`}>
                    {title}
                </h2>
                <p className={`text-xl ${COLORS.grayTextDark} mb-6 leading-relaxed`}>
                    {paragraph1}
                </p>
                <p className={`text-lg ${COLORS.grayTextDark} leading-relaxed`}>
                    {paragraph2}
                </p>
            </div>
        </AnimatedSection>
    );
};

// --- Gallery Section Component (MODIFIED to include onImageClick prop) ---
interface GallerySectionProps {
    galleryData: GalleryImageCard[];
    onImageClick: (imageUrl: string, imageTitle: string) => void; // New prop for click handler
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryData, onImageClick }) => {
    return (
        <div
            className={`w-full py-24 `}
            style={{ backgroundColor: 'white' }}
        >
            <h2
                className={`text-5xl font-heading font-extrabold mb-16 text-center ${COLORS.grayTextDark}`}
            >
                A Glimpse Inside Our World
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4 md:px-12 max-w-7xl mx-auto">
                {galleryData.map((item, index) => (
                    <div
                        key={item.id || index}
                        // Make the entire div clickable
                        onClick={() => onImageClick(getMediaUrl(item.Image.data), item.Title)}
                        className={
                            `relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer aspect-video
                            ${item.spanColumns === 2 ? 'md:col-span-2' : ''}  
                            transform transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.03]
                            opacity-100 translate-y-0 `
                        }
                    >
                        <img
                            src={getMediaUrl(item.Image.data)}
                            alt={item.Title || "Gallery Image"}
                            className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/600x400/333/FFF?text=Image+Error`;
                                e.currentTarget.alt = "Image failed to load";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-primary via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                        <div className="absolute bottom-4 left-4 right-4 text-white p-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <p
                                className={`text-xl md:text-2xl font-bold font-heading tracking-wide ${COLORS.grayTextLight}`}
                            >
                                {item.Title}
                            </p>
                            <p className={`${COLORS.grayTextLighter} text-sm mt-1`}>
                                {item.Description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p
                className={`text-center ${COLORS.grayTextMedium} mt-20 text-lg max-w-3xl mx-auto px-4`}
            >
                Every detail, every corner, meticulously designed to elevate your senses
                and connect you with the artistry of luxury automobiles.
            </p>
        </div>
    );
};


// --- ImageModal Component (UPDATED DESIGN) ---
interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    imageTitle: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, imageTitle }) => {
    // State for mount/unmount animation
    const [shouldRender, setShouldRender] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Add a slight delay for fade-in animation
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.classList.add('scale-100', 'opacity-100');
                    modalRef.current.classList.remove('scale-95', 'opacity-0');
                }
            }, 50); // Small delay to allow render before animation
        } else {
            if (modalRef.current) {
                modalRef.current.classList.remove('scale-100', 'opacity-100');
                modalRef.current.classList.add('scale-95', 'opacity-0');
            }
            // Wait for transition to finish before unmounting
            const timer = setTimeout(() => setShouldRender(false), 300); // Duration of the transition
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null; // Only render if shouldRender is true


    return (
        <div
            // Overlay background with blur and transition
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-filter backdrop-blur-md transition-opacity duration-300 ease-out"
            onClick={onClose} // Close modal when clicking on the dark overlay
        >
            <div
                ref={modalRef}
                // Modal content container - Dark Gray Background, improved padding, rounded corners, shadow, and initial animation state
                className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/50
                           max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col
                           transform transition-all duration-300 ease-out scale-95 opacity-0" // Initial state for animation
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the content box
            >
                {/* Close button - Styled for better appearance */}
                <button
                    className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full
                               w-10 h-10 flex items-center justify-center text-xl font-bold
                               transition-all duration-200 ease-in-out transform hover:scale-110 hover:shadow-lg hover:text-green-primary"
                    onClick={onClose}
                    aria-label="Close Image"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                {/* Image */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={imageTitle || "Gallery Image"}
                        className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-md border border-gray-700/30"
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x400/555/EEE?text=Image+Load+Error`;
                            e.currentTarget.alt = "Image failed to load";
                        }}
                    />
                )}

                {/* Title - Improved typography and a subtle line below */}
                {imageTitle && (
                    <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                        <h3 className="text-white text-3xl md:text-4xl font-heading font-extrabold">
                            {imageTitle}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main ShowroomPage Component: Orchestrates the entire page layout ---
const ShowroomPage: React.FC = () => {
    const [heroData, setHeroData] = useState<LuxuryHeroAttributes | null>(null);
    const [showroomPageData, setShowroomPageData] = useState<ShowroomPageAttributes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // NEW STATES for the Image Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [modalImageTitle, setModalImageTitle] = useState<string | null>(null);

    const aboutSectionRef = useRef<HTMLDivElement>(null);

    const scrollToAboutSection = useCallback(() => {
        if (aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }, []);

    // NEW: Handlers for the Image Modal
    const handleImageClick = useCallback((imageUrl: string, imageTitle: string) => {
        setModalImageUrl(imageUrl);
        setModalImageTitle(imageTitle);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setModalImageUrl(null);
        setModalImageTitle(null);
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const STRAPI_API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

                // Fetch Luxury Hero Data
                const heroApiUrl =
                    `${STRAPI_API_URL}/api/luxury-heroes?populate[basicinfo][populate]=companyLogo&populate[videoPoster]=*&populate[videoUrl]=*&populate[aboutUsBackground]=*`;

                const heroResponse = await fetch(heroApiUrl);
                if (!heroResponse.ok) {
                    throw new Error(`HTTP error fetching hero data! Status: ${heroResponse.status}`);
                }
                const heroJson: StrapiCollectionResponse<LuxuryHeroAttributes> = await heroResponse.json();
                if (heroJson?.data?.length > 0) {
                    setHeroData(heroJson.data[0].attributes);
                } else {
                    setHeroData(null);
                    console.warn("API returned no data for Luxury Hero. Ensure it's published.");
                }

                // Fetch Showroom Page Data
                const showroomPageApiUrl =
                    `${STRAPI_API_URL}/api/showroom-page?populate[SR_mainCards]=*&populate[descriptionIMG]=*&populate[GalleryImageCard][populate]=Image&populate[GalleryImageCard][populate]=spanColumns`;

                const showroomPageResponse = await fetch(showroomPageApiUrl);
                if (!showroomPageResponse.ok) {
                    throw new Error(
                        `HTTP error fetching showroom page data! Status: ${showroomPageResponse.status}. Please check Strapi permissions for 'showroom-page' (find/findOne) and ensure the single type is published.`
                    );
                }
                const showroomPageJson: StrapiSingleResponse<ShowroomPageAttributes> = await showroomPageResponse.json();
                if (showroomPageJson?.data?.attributes) {
                    setShowroomPageData(showroomPageJson.data.attributes);
                } else {
                    setShowroomPageData(null);
                    console.warn("API returned no data for Showroom Page. Ensure it's published and has content.");
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

    // Derive URLs and content for components from fetched data
    const logoUrl = heroData?.basicinfo?.companyLogo?.data
        ? getMediaUrl(heroData.basicinfo.companyLogo.data)
        : defaultMainImage; // Fallback logo

    const heroVideoUrl = heroData?.videoUrl?.data
        ? getMediaUrl(heroData.videoUrl.data)
        : 'https://www.w3schools.com/html/mov_bbb.mp4'; // Fallback video URL

    const heroVideoPosterUrl = heroData?.videoPoster?.data
        ? getMediaUrl(heroData.videoPoster.data)
        : defaultMainImage; // Fallback poster image

    // Content for Hero Section
    const mainTitle = showroomPageData?.mainTitle || "Defining the Lusso Standard";
    const mainDescription = showroomPageData?.mainDesc || "At Lusso, we don't just craft automobiles; we embody a philosophy of unparalleled quality, pioneering spirit, and an enduring commitment to luxury.";
    const pillars = showroomPageData?.SR_mainCards || [
        { id: 1, Title: "ELEGANCE", Description: "Refined aesthetics, timeless design." },
        { id: 2, Title: "INNOVATION", Description: "Pioneering technology, future-forward." },
        { id: 3, Title: "HERITAGE", Description: "Rich legacy, enduring craftsmanship." },
        { id: 4, Title: "EXCLUSIVITY", Description: "Bespoke experiences, unparalleled access." },
    ];

    // Content for About Section
    const aboutTitle = showroomPageData?.discoverTitle || "An Experience Beyond Expectations";
    const aboutP1 = showroomPageData?.discoverP1 || "More than just a display space, our showroom is an architectural masterpiece, thoughtfully curated to reflect the prestige and innovation of every vehicle it houses. From the gleaming polished floors to the ambient, intelligent lighting, every element contributes to an atmosphere of exclusive sophistication.";
    const aboutP2 = showroomPageData?.discoverp2 || "We've designed every corner to evoke a sense of wonder and comfort, inviting you to immerse yourself in dedicated zones for personalized consultations, unwind in our luxurious private lounges, and engage with dynamic interactive displays that bring the legacy and future of our automotive masterpieces to life. This is where dreams are realized.";
    const aboutSectionImageUrl = showroomPageData?.descriptionIMG?.data
        ? getMediaUrl(showroomPageData.descriptionIMG.data)
        : defaultAboutImage; // Fallback to a dedicated about image placeholder

    // Get Gallery Section data
    const galleryData = showroomPageData?.GalleryImageCard || []; // Default to an empty array if no data

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-green-main text-gray-100">
                <p className="text-xl">Loading showroom data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-800 text-white p-4 text-center">
                <p className="text-xl">Error: {error}</p>
                <p className="text-md mt-2">Please check your network, Strapi server, and API permissions.</p>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div
            className={`min-h-screen ${COLORS.grayTextLight} flex flex-col items-center overflow-hidden font-body ${COLORS.mainDarkGreen}`}
        >
            <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />

            <div className="w-full">
                <HeroSection
                    videoSrc={heroVideoUrl}
                    posterSrc={heroVideoPosterUrl}
                    scrollToNextSection={scrollToAboutSection}
                    mainTitle={mainTitle}
                    mainDescription={mainDescription}
                    pillars={pillars}
                />

                <div ref={aboutSectionRef}>
                    <AboutSection
                        title={aboutTitle}
                        paragraph1={aboutP1}
                        paragraph2={aboutP2}
                        imageSrc={aboutSectionImageUrl}
                    />
                </div>

                {/* Pass the new click handler to GallerySection */}
                <GallerySection galleryData={galleryData} onImageClick={handleImageClick} />
                
                <Footer logoUrl={logoUrl} />
            </div>

            {/* Render the ImageModal, which is now defined within this file */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageUrl={modalImageUrl}
                imageTitle={modalImageTitle}
            />
        </div>
    );
};

export default ShowroomPage;