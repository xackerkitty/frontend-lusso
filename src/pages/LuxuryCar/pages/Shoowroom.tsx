import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';

// Local placeholder images
import defaultMainImage from '../scr/images/gallery01.png';
import defaultAboutImage from '../scr/images/gallery01.png';

// Import the Navbar component from the components directory
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import showroom styles
import '../scr/css/showroom.css';

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
    // Add documentId, hash, ext, size, previewUrl, provider, provider_metadata, createdAt, updatedAt, publishedAt if needed
}

// Represents the data wrapper for a single media item
// This interface is adjusted to match the flat structure for media from your luxurycars-showroom endpoint
interface MediaDataItem {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: {
        large?: MediaAttributes;
        small?: MediaAttributes;
        medium?: MediaAttributes;
        thumbnail?: MediaAttributes;
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string; // Direct URL for the media item
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Represents a field in Strapi that holds a single media item (e.g., an image, a video file)
// This is for cases where media is nested under 'data.attributes' as per Strapi's default populate
interface SingleMediaData {
    data: MediaDataItem | null; // 'data' can be null if no media is uploaded
}

interface MediaDataItemWithUrl {
    url: string;
    // ... other properties if any
}


// Attributes for the 'BasicInfo' component (assuming it holds company logo)
interface BasicInfoAttributes {
    companyName?: string;
    companyLogo?: SingleMediaData;
}

// Attributes for the 'LuxuryHero' single type/component (assuming this is from a different endpoint/structure)
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

// Interface for the 'luxurycars-showroom' Single Type's main attributes
interface LuxuryCarsShowroomAttributes {
    mainTitle: string;
    mainDesc: string;
    discoverTitle: string;
    discoverP1: string;
    discoverp2: string;
    mainBG: MediaDataItem; // The main background video
    descriptionIMG: MediaDataItem; // Image for the 'AboutSection'
    cards: SRMainCard[]; // Your 'SR_mainCards' from your original code are 'cards' here
    galleryCards: { // This structure is simpler in your provided JSON, still not an array of images
        id: number;
        title: string;
        description: string;
        Image: SingleMediaData;
        spanColums: number;
    } | null;
}

// NEW INTERFACE for the /api/luxurycar endpoint for the logo
interface LuxuryCarAttributes {
    logo: MediaDataItem; // The logo data
    bigLogo: MediaDataItem | null; // Assuming this could be another logo size
}

interface StrapiLuxuryCarResponse {
    data: LuxuryCarAttributes | null;
    meta: any;
}


// Generic Strapi Response Structures

// For a single entry (e.g., a Single Type like ShowroomPage)
interface StrapiDataItem<T> {
    id: number;
    attributes: T;
}

// THIS IS THE STRUCTURE FOR THE `luxurycars-showroom` ENDPOINT!
interface StrapiLuxuryCarsShowroomResponse {
    data: LuxuryCarsShowroomAttributes | null; // Direct attributes, no nested 'id' or 'attributes' layer for the main type
    meta: any;
}

// For a collection of entries (e.g., if LuxuryHero was a Collection Type)
interface StrapiCollectionResponse<T> {
    data: StrapiDataItem<T>[];
    meta: any;
}




// Tailwind CSS Color Utility Classes
// Type alias for all possible media data shapes used in getMediaUrl
type MediaDataContent =
    | string
    | MediaDataItem
    | MediaDataItemWithUrl
    | SingleMediaData
    | { attributes?: MediaAttributes }
    | Array<MediaDataItem | MediaDataItemWithUrl | { attributes?: MediaAttributes }>
    | null;
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

// Helper function to construct full media URL from Strapi data
const getMediaUrl = (
    mediaDataContent: MediaDataContent
): string => {
    let relativePath: string | undefined;

    if (mediaDataContent === null || mediaDataContent === undefined) {
        console.warn("getMediaUrl: mediaDataContent is null or undefined.");
        return "";
    }
    if (typeof mediaDataContent === "string") {
        relativePath = mediaDataContent;
    } else if (!Array.isArray(mediaDataContent)) {
        // Handle SingleMediaData['data'] case where data itself might be null
        if ('data' in mediaDataContent && mediaDataContent.data !== null && mediaDataContent.data !== undefined) {
            // Check for the new structure (direct 'url')
            if ('url' in mediaDataContent.data) {
                relativePath = mediaDataContent.data.url;
            }
            // Then check for the old structure (nested 'attributes.url')
            else if (
                mediaDataContent.data &&
                typeof mediaDataContent.data === 'object' &&
                'attributes' in mediaDataContent.data &&
                (mediaDataContent.data as any).attributes?.url
            ) {
                relativePath = (mediaDataContent.data as any).attributes.url;
            }
        }
        // Handle MediaDataItemWithUrl or MediaDataItemWithAttributes directly
        else if ('url' in mediaDataContent) {
            relativePath = mediaDataContent.url;
        } else if ('attributes' in mediaDataContent && mediaDataContent.attributes?.url) {
            relativePath = mediaDataContent.attributes.url;
        }
    } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
        const firstItem = mediaDataContent[0];
        // Use type guards to safely access properties on array items
        if (firstItem && 'url' in firstItem) { // Check for direct 'url' first
            relativePath = firstItem.url;
        } else if (firstItem && 'attributes' in firstItem && (firstItem as any).attributes?.url) {
            relativePath = (firstItem as any).attributes.url;
        }
    } else {
        console.warn("getMediaUrl: No valid mediaDataContent provided or it's empty.");
        return "";
    }

    if (!relativePath) {
        console.warn("getMediaUrl: extracted relativePath was empty or undefined.");
        return "";
    }

    const STRAPI_BASE_URL = import.meta.env.VITE_API_URL || "https://accessible-charity-d22e30cd98.strapiapp.com";

    let fullUrl = "";
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        fullUrl = relativePath;
    } else {
        // Ensure only one slash between base URL and relative path
        const separator = relativePath.startsWith("/") ? "" : "/";
        fullUrl = `${STRAPI_BASE_URL}${separator}${relativePath}`;
    }
    return fullUrl;
};


// Intersection Observer Hook for animations
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

// Animated Section Component
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

// Hero Section Component
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
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold mb-6 sm:mb-8 ${COLORS.grayTextLight} drop-shadow-lg
                        animate-fade-in-up-custom animate-breathe text-shimmer-light`}
                    style={{ 
                        animationDelay: '200ms',
                        fontFamily: 'Ferrari Sans, sans-serif',
                        fontWeight: 700
                    }}
                >
                    {mainTitle}
                </h1>
                <p
                    className={`text-lg sm:text-xl md:text-2xl lg:text-2xl ${COLORS.grayTextLight} mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto
                        animate-fade-in-up-custom`}
                    style={{ 
                        animationDelay: '600ms',
                        fontFamily: 'Ferrari Sans, sans-serif',
                        fontWeight: 300
                    }}
                >
                    {mainDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {pillars.map((pillar, index) => (
                        <div
                            key={pillar.id || index}
                            className={`p-4 sm:p-6 rounded-lg backdrop-filter backdrop-blur-sm bg-white bg-opacity-10
                                    shadow-lg border border-white border-opacity-20
                                    animate-fade-in-up-custom`}
                            style={{ animationDelay: `${800 + (100 * index)}ms` }}
                        >
                            <h3 className={`text-base sm:text-lg md:text-xl font-heading font-bold mb-2 ${COLORS.grayTextLight}`}
                                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                            >
                                {pillar.Title}
                            </h3>
                            <p className={`text-sm sm:text-base ${COLORS.grayTextMedium}`}
                               style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 300 }}
                            >
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

// About Section Component
const AboutSection: React.FC<{
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageSrc: string;
}> = ({ title, paragraph1, paragraph2, imageSrc }) => {
    return (
        <AnimatedSection
            id="about-section"
            className={`px-4 md:px-12 w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 ${COLORS.white} ${COLORS.grayTextDark} shadow-xl`}
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
                    <p className="text-xl sm:text-2xl md:text-3xl font-heading font-bold drop-shadow-md"
                       style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                    >
                        Discover the Difference
                    </p>
                </div>
            </div>

            <div className="lg:w-1/2 text-left">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-heading font-extrabold mb-4 sm:mb-6 ${COLORS.grayTextDark}`}
                    style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                >
                    {title}
                </h2>
                <p className={`text-lg sm:text-xl md:text-xl ${COLORS.grayTextDark} mb-4 sm:mb-6 leading-relaxed`}
                   style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 400 }}
                >
                    {paragraph1}
                </p>
                <p className={`text-base sm:text-lg md:text-lg ${COLORS.grayTextDark} leading-relaxed`}
                   style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 300 }}
                >
                    {paragraph2}
                </p>
            </div>
        </AnimatedSection>
    );
};

// Gallery Section Component
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
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-heading font-extrabold mb-12 sm:mb-16 text-center ${COLORS.grayTextDark}`}
                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
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
                                className={`text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold font-heading tracking-wide ${COLORS.grayTextLight}`}
                                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                            >
                                {item.Title}
                            </p>
                            <p className={`${COLORS.grayTextLighter} text-xs sm:text-sm mt-1`}
                               style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 300 }}
                            >
                                {item.Description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* <p
                className={`text-center ${COLORS.grayTextMedium} mt-16 sm:mt-20 text-base sm:text-lg max-w-3xl mx-auto px-4`}
                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 300 }}
            >
                Every detail, every corner, meticulously designed to elevate your senses
                and connect you with the artistry of luxury automobiles.
            </p> */}
        </div>
    );
};


// Image modal component for gallery images
interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    imageTitle: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, imageTitle }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.classList.add('scale-100', 'opacity-100');
                    modalRef.current.classList.remove('scale-95', 'opacity-0');
                }
            }, 50);
        } else {
            if (modalRef.current) {
                modalRef.current.classList.remove('scale-100', 'opacity-100');
                modalRef.current.classList.add('scale-95', 'opacity-0');
            }
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-95 backdrop-filter backdrop-blur-lg transition-opacity duration-300 ease-out"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden
                           transform transition-all duration-300 ease-out scale-95 opacity-0"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 z-20 bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-full
                               w-12 h-12 flex items-center justify-center text-xl font-bold
                               transition-all duration-200 ease-in-out transform hover:scale-110 backdrop-filter backdrop-blur-sm
                               border border-white border-opacity-30"
                    onClick={onClose}
                    aria-label="Close Image"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="relative">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={imageTitle || "Gallery Image"}
                            className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/600x400/555/EEE?text=Image+Load+Error`;
                                e.currentTarget.alt = "Image failed to load";
                            }}
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 pointer-events-none rounded-lg"></div>
                    
                    {imageTitle && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-2 drop-shadow-2xl text-white"
                                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                            >
                                {imageTitle}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// Simple in-memory cache for SPA navigation
let cachedShowroomData: LuxuryCarsShowroomAttributes | null = null;
let cachedLogoData: LuxuryCarAttributes | null = null;

// Main ShowroomPage Component
const ShowroomPage: React.FC = () => {
    const [currentLocale, setCurrentLocale] = useState<string>('en');
    const [showroomData, setShowroomData] = useState<LuxuryCarsShowroomAttributes | null>(cachedShowroomData);
    const [logoData, setLogoData] = useState<LuxuryCarAttributes | null>(cachedLogoData);
    const [loading, setLoading] = useState(!(cachedShowroomData && cachedLogoData));
    const [loadingVisible, setLoadingVisible] = useState(!(cachedShowroomData && cachedLogoData));
    const [error, setError] = useState<string | null>(null);

    // States for the Image Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [modalImageTitle, setModalImageTitle] = useState<string | null>(null);

    const aboutSectionRef = useRef<HTMLDivElement>(null);

    const scrollToAboutSection = useCallback(() => {
        if (aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }, []);

    // Handlers for the Image Modal
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

    // Function to handle locale change from Navbar
    const handleLocaleChange = (locale: string) => {
        setCurrentLocale(locale);
        // Clear cache when locale changes to force refetch
        if (locale !== 'en') {
            cachedShowroomData = null;
            cachedLogoData = null;
        }
        // Trigger data refetch
        fetchData(locale);
    };

    // Data fetching function with locale support
    const fetchData = async (locale: string = 'en') => {
        setLoading(true);
        const startTime = Date.now(); // Track when loading started
        
        try {
            const STRAPI_BASE_URL = import.meta.env.VITE_API_URL || "https://accessible-charity-d22e30cd98.strapiapp.com";

            // Determine locale parameter for API calls
            const localeParam = locale === 'ka' ? '?locale=ka' : '';
            const populateParam = locale === 'ka' ? '&populate' : '?populate';

            try {
                // Fetch Luxury Car Data (for logo) with locale
                console.log('Fetching logo with URL:', `${STRAPI_BASE_URL}/api/luxurycar${localeParam}${locale === 'ka' ? '&' : '?'}populate=*`);
                const luxuryCarApiUrl = `${STRAPI_BASE_URL}/api/luxurycar${localeParam}${locale === 'ka' ? '&' : '?'}populate=*`;
                const luxuryCarResponse = await fetch(luxuryCarApiUrl);
                
                if (!luxuryCarResponse.ok) {
                    console.warn(`Logo request failed with status ${luxuryCarResponse.status}, falling back to English`);
                    // Fallback to English if Georgian content is not available
                    const englishLogoRes = await fetch(`${STRAPI_BASE_URL}/api/luxurycar?populate=*`);
                    if (!englishLogoRes.ok) throw new Error(`HTTP error! Status: ${englishLogoRes.status}`);
                    const luxuryCarJson: StrapiLuxuryCarResponse = await englishLogoRes.json();
                    if (luxuryCarJson?.data) {
                        setLogoData(luxuryCarJson.data);
                    }
                } else {
                    const luxuryCarJson: StrapiLuxuryCarResponse = await luxuryCarResponse.json();
                    if (luxuryCarJson?.data) {
                        setLogoData(luxuryCarJson.data);
                        if (locale === 'en') cachedLogoData = luxuryCarJson.data;
                    } else {
                        console.warn("API returned no data for Luxury Car (logo). Ensure it's published.");
                    }
                }

                // Fetch Showroom Page Data with locale
                const showroomApiUrl = `${STRAPI_BASE_URL}/api/luxurycars-showroom${localeParam}${populateParam}[0]=mainBG&populate[1]=descriptionIMG&populate[2]=galleryCards.image&populate[3]=cards`;
                console.log('Fetching showroom data with URL:', showroomApiUrl);
                const showroomResponse = await fetch(showroomApiUrl);
                
                if (!showroomResponse.ok) {
                    console.warn(`Showroom request failed with status ${showroomResponse.status}, falling back to English`);
                    // Fallback to English if Georgian content is not available
                    const englishShowroomRes = await fetch(`${STRAPI_BASE_URL}/api/luxurycars-showroom?populate[0]=mainBG&populate[1]=descriptionIMG&populate[2]=galleryCards.image&populate[3]=cards`);
                    if (!englishShowroomRes.ok) throw new Error(`HTTP error! Status: ${englishShowroomRes.status}`);
                    const showroomJson: any = await englishShowroomRes.json();
                    if (showroomJson?.data) {
                        setShowroomData(showroomJson.data);
                        // Add a note that we're showing English content
                        if (locale === 'ka') {
                            console.log('Displaying English content as Georgian translation is not available yet');
                        }
                    }
                } else {
                    const showroomJson: any = await showroomResponse.json();
                    if (showroomJson?.data) {
                        setShowroomData(showroomJson.data);
                        if (locale === 'en') cachedShowroomData = showroomJson.data;
                    } else {
                        setShowroomData(null);
                        console.warn("API returned no data for Luxury Cars Showroom. Ensure it's published.");
                    }
                }

            } catch (fetchError: any) {
                console.error('Fetch error:', fetchError);
                throw fetchError;
            }

        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(`Failed to load content: ${e.message}`);
            } else {
                setError("An unknown error occurred while fetching data.");
            }
            console.error("Error fetching data:", e);
        } finally {
            const loadTime = Date.now() - startTime;
            const minLoadTime = 2000; // Minimum 2 seconds
            const remainingTime = Math.max(0, minLoadTime - loadTime);
            
            setTimeout(() => {
                setLoadingVisible(false);
                setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
            }, remainingTime);
        }
    };


    useEffect(() => {
        if (cachedShowroomData && cachedLogoData && currentLocale === 'en') {
            setShowroomData(cachedShowroomData);
            setLogoData(cachedLogoData);
            // For cached data, show loading for minimum 2 seconds
            setTimeout(() => {
                setLoadingVisible(false);
                setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
            }, 2000); // Minimum 2s for cached data
            return;
        }
        
        fetchData(currentLocale);
    }, []); // Don't include currentLocale in dependencies to prevent infinite loops

    // Derive URLs and content for components from fetched data
    // Logo URL now comes from `logoData`
    const logoUrl = logoData?.logo?.url
        ? getMediaUrl(logoData.logo)
        : defaultMainImage; // Fallback logo

    const heroVideoUrl = showroomData?.mainBG?.url
        ? getMediaUrl(showroomData.mainBG)
        : ''; // Fallback video URL

    // Your provided JSON does not have a 'videoPoster' directly in 'luxurycars-showroom'.
    // If you need a poster, it should be added to your Strapi schema for 'luxurycars-showroom'
    // or you can use a static image/default.
    const heroVideoPosterUrl = defaultMainImage; // Fallback to a default image for poster


    // Content for Hero Section
    const mainTitle = showroomData?.mainTitle || "Defining the Lusso Standard";
    const mainDescription = showroomData?.mainDesc || "At Lusso, we don't just craft automobiles; we embody a philosophy of unparalleled quality, pioneering spirit, and an enduring commitment to luxury.";
    const pillars = showroomData?.cards || [ // Use 'cards' from the new data structure
        { id: 1, Title: "ELEGANCE", Description: "Refined aesthetics, timeless design." },
        { id: 2, Title: "INNOVATION", Description: "Pioneering technology, future-forward." },
        { id: 3, Title: "HERITAGE", Description: "Rich legacy, enduring craftsmanship." },
        { id: 4, Title: "EXCLUSIVITY", Description: "Bespoke experiences, unparalleled access." },
    ];

    // Content for About Section
    const aboutTitle = showroomData?.discoverTitle || "An Experience Beyond Expectations";
    const aboutP1 = showroomData?.discoverP1 || "More than just a display space, our showroom is an architectural masterpiece, thoughtfully curated to reflect the prestige and innovation of every vehicle it houses. From the gleaming polished floors to the ambient, intelligent lighting, every element contributes to an atmosphere of exclusive sophistication.";
    const aboutP2 = showroomData?.discoverp2 || "We've designed every corner to evoke a sense of wonder and comfort, inviting you to immerse yourself in dedicated zones for personalized consultations, unwind in our luxurious private lounges, and engage with dynamic interactive displays that bring the legacy and future of our automotive masterpieces to life. This is where dreams are realized.";
    const aboutSectionImageUrl = showroomData?.descriptionIMG?.url
        ? getMediaUrl(showroomData.descriptionIMG)
        : defaultAboutImage; // Fallback to a dedicated about image placeholder

    // Get Gallery Section data from API response
    const galleryData: GalleryImageCard[] = Array.isArray(showroomData?.galleryCards)
        ? showroomData.galleryCards.map((card: any) => ({
            id: card.id,
            Title: card.title,
            Description: card.description,
            Image: { data: card.image },
            spanColumns: card.spanColums,
        }))
        : [];


    // Loading and Error States
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-800 text-white p-4 text-center">
                <p className="text-xl">Error: {error}</p>
                <p className="text-md mt-2">Please check your network, Strapi server, and API permissions.</p>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${COLORS.grayTextLight} flex flex-col items-center overflow-hidden font-body ${COLORS.mainDarkGreen}`}
            style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 400 }}
        >
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

            <Navbar 
                largeLogoSrc={logoUrl} 
                smallLogoSrc={logoUrl} 
                hideOnScrollDown={true}
                onLocaleChange={handleLocaleChange}
                currentLocale={currentLocale}
            />

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