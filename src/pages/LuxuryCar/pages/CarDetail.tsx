
// This file shows the details for a luxury car. It has a lot of code, but each part is explained simply below.

// We need some tools from React to make things work (like showing/hiding things, remembering stuff, etc)
import React, { useState, useEffect, useCallback, useRef } from 'react';

// This is a special pop-up for looking at car pictures up close
// You can zoom in, zoom out, and go to the next or previous picture
// The code below makes that work
interface ModalImageZoomProps {
    imageSrc: string; // The picture to show
    altText: string; // The text if the picture can't load
    onClose: () => void; // What to do when you close the pop-up
    onPrev: () => void; // What to do when you click previous
    onNext: () => void; // What to do when you click next
    showNav: boolean; // Should we show next/prev buttons?
    modalKey: number; // Used to reset zoom when you open a new picture
}

// This is the pop-up component
const ModalImageZoom: React.FC<ModalImageZoomProps> = ({ imageSrc, altText, onClose, onPrev, onNext, showNav, modalKey }) => {
    // This remembers how much we are zoomed in
    const [scale, setScale] = useState(1);
    // These help us work with the picture and the pop-up box
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // This is for a fade effect when changing pictures
    const [fade, setFade] = useState(false);

    // When you open a new picture, always reset zoom to normal
    React.useEffect(() => {
        setScale(1);
    }, [modalKey]);

    // If you scroll your mouse wheel, zoom in or out
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        let newScale = scale + (e.deltaY < 0 ? 0.2 : -0.2); // Scroll up = zoom in, down = zoom out
        newScale = Math.max(1, Math.min(newScale, 5)); // Don't zoom out too much or in too much
        setScale(newScale);
    };

    // If you double-click the picture, zoom in (or go back to normal)
    const handleDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!containerRef.current) return;
        // If zoom is normal, zoom in. If already zoomed, go back to normal.
        if (scale === 1) {
            setScale(2);
        } else {
            setScale(1);
        }
    };

    // This is what shows up on the screen
    return (
        <div
            ref={containerRef}
            className="relative max-w-screen-lg w-full h-full flex items-center justify-center select-none"
            // ? This stops the pop-up from closing if you click inside it
            onClick={e => e.stopPropagation()}
            // ? This lets you zoom in and out with your mouse wheel
            onWheel={handleWheel}
        >
            {/* // ? This is a dark see-through layer for the fade effect when changing pictures */}
            <div
                className="fixed inset-0 z-[9999] pointer-events-none bg-black bg-opacity-60"
                style={{
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 0.28s cubic-bezier(0.5, 0, 0.5, 1)',
                    willChange: 'opacity',
                }}
            />
            {/* // ? This is the X button to close the pop-up */}
            <button
                className="absolute top-4 right-4 text-white text-4xl font-bold z-50"
                onClick={onClose}
                aria-label="Close modal"
            >
                &times;
            </button>
            {/* // ? This shows the car picture. You can double-click to zoom in/out. */}
            <img
                ref={imgRef}
                src={imageSrc}
                alt={altText}
                className="max-w-full max-h-full object-contain cursor-pointer"
                style={{
                    display: 'block',
                    margin: 'auto',
                    transform: `scale(${scale})`, // ? Makes the picture bigger or smaller
                    transition: 'transform 0.18s cubic-bezier(0.5, 0, 0.5, 1)',
                    userSelect: 'none',
                }}
                onDoubleClick={handleDoubleClick}
                onDragStart={e => e.preventDefault()}
                draggable={false}
            />
            {/* // ? If there are more pictures, show next and previous buttons */}
            {showNav && (
                <>
                    <button
                        className="absolute left-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full text-2xl hover:bg-opacity-75 transition-all"
                        onClick={() => {
                            setFade(true);
                            setTimeout(() => { setFade(false); onPrev(); }, 180);
                        }}
                        aria-label="Previous image"
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full text-2xl hover:bg-opacity-75 transition-all"
                        onClick={() => {
                            setFade(true);
                            setTimeout(() => { setFade(false); onNext(); }, 180);
                        }}
                        aria-label="Next image"
                    >
                        &#10095;
                    </button>
                </>
            )}
            {/* // ? This is a little message at the bottom to help users know what to do */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded shadow z-40 pointer-events-none">
                Scroll to zoom, drag to pan, double click to zoom in/out
            </div>
        </div>
    );
};
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "../scr/css/car_details.css";
import Footer from '../components/Footer';

// ! ========================= Interfaces =========================
// * All TypeScript interfaces for car, media, and logo data
interface MediaAttributes {
    url: string;
    mime?: string;
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

interface SingleMediaRelation {
    data: MediaDataItem | null;
}

interface MultipleMediaRelation {
    data: MediaDataItem[];
}

interface BasicInfoAttributes {
    companyName?: string;
    companyLogo?: SingleMediaRelation;
}

interface LuxuryHeroAttributes {
    basicinfo?: BasicInfoAttributes;
}

// NEW INTERFACE for the carSpecifications component
interface CarSpecificationsAttributes {
    year?: string;
    regYear?: string;
    owners?: string; // Assuming 'owners' is the field name in Strapi for number of owners
    mileage?: string;
    exteriorColor?: string;
    interiorColor?: string;
    gearType?: string;
    power?: string;
    fuelType?: string;
}

interface StrapiCarAttributes {
    carName: string;
    carBrand: string | null;
    carPrice: string;
    slug: string;
    carDesc?: string;
    carOverview?: string; // This property is no longer used in CarDetailData
    carOverviewP1?: string;
    carOverviewP2?: string;
    carEngineDesc?: string;
    Car_fuel_economy_range?: string;
    carSuspension?: string;

    // This is the key change: carSpecifications is a component
    carSpecifications?: CarSpecificationsAttributes;

    carImage?: SingleMediaRelation;
    carPic?: SingleMediaRelation;
    backgroundVID?: SingleMediaRelation;
    brandLogo?: SingleMediaRelation;
    isSold?: boolean;
    checkingIMGs?: MultipleMediaRelation; // Assuming this is for a general gallery
    carSliderImg?: MultipleMediaRelation; // Assuming this is for slider/gallery specifically
}

interface StrapiCarData {
    id: number;
    attributes: StrapiCarAttributes;
}

interface CarDetailData {
    id: number;
    model: string;
    brand: string;
    price: number;
    slug: string;
    imageUrl: string;
    carPicUrl: string;
    backgroundVID: string;
    brandLogoUrl: string;
    isSold: boolean;

    description: string;
    overviewP1: string;
    overviewP2: string;
    engineDescription: string;
    fuelEconomyRange: string;
    suspension: string;

    // These are now populated from carSpecifications component
    year: string;
    regYear: string;
    numberOfOwners: string;
    mileage: string;
    exteriorColor: string;
    interiorColor: string;
    gearType: string;
    power: string;
    fuelType: string;
    galleryImages: string[];
}

// ! ========================= Helper Functions =========================
// * Utility functions for extracting media URLs and best image formats from Strapi
const getMediaUrl = (
    mediaContent: MediaDataItem | string | null | undefined,
    baseUrl: string
): string => {
    let relativePath: string | undefined;

    if (typeof mediaContent === "string") {
        relativePath = mediaContent;
    } else if (mediaContent && mediaContent.attributes && mediaContent.attributes.url) {
        relativePath = mediaContent.attributes.url;
    } else {
        return "";
    }

    if (!relativePath) {
        return "";
    }

    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        return relativePath;
    } else {
        // Handle cases where relativePath might or might not start with '/'
        return `${baseUrl}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
    }
};

const getMultipleMediaUrls = (
    mediaRelation: MultipleMediaRelation | null | undefined,
    baseUrl: string
): string[] => {
    if (!mediaRelation || !mediaRelation.data || mediaRelation.data.length === 0) {
        return [];
    }
    return mediaRelation.data.map(item => getMediaUrl(item, baseUrl)).filter(url => url !== "");
};

// Helper to get best image format from Strapi media object
const getBestImageUrl = (mediaObj: any) => {

    if (!mediaObj || !mediaObj.attributes) return ''; 
    const formats = mediaObj.attributes.formats;
    const url = mediaObj.attributes.url;

    if (formats) {
        return (
            formats.large?.url ||
            formats.medium?.url ||
            formats.small?.url ||
            formats.thumbnail?.url ||
            url || ''
        );
    }
    return url || '';
};

// ! ========================= Hero Section Component =========================
// * Section with video background and car title
// ? Responsive height, overlays, and video error handling

const HeroSection: React.FC<{ backgroundVID: string }> = ({ backgroundVID }) => {
    // console.log("HeroSection backgroundVID:", backgroundVID); // Debugging: Check the URL passed
    return (
        <section
            className="relative w-full flex justify-center items-center text-white text-center overflow-hidden"
            style={{
                height: '55vh',
                minHeight: '200px',
                position: 'relative',
                zIndex: 1,
            }}
        >
            {backgroundVID && (
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={backgroundVID}
                    onError={(e) => console.error("Video error:", e.currentTarget.error)} // Add error handling for video
                >
                    Your browser does not support the video tag.
                </video>
            )}
            <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
            <style>{`
                @media (min-width: 769px) {
                    section {
                        height: 55vh !important;
                    }
                }
                @media (max-width: 768px) {
                    section {
                        height: 40vh !important;
                    }
                }
                @media (max-width: 480px) {
                    section {
                        height: 30vh !important;
                    }
                }
            `}</style>
        </section>
    );
};
// * ========================= End Hero Section Component =========================




// * ========================= Model Selector Component =========================
// Tabs for switching between Overview, Gallery, and 3D Model
// ? Easily switch car detail views
interface ModelSelectorProps {
    activeModel: string;
    setActiveModel: (model: string) => void;
    t: (key: any) => string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ activeModel, setActiveModel, t }) => {
    const buttonClass = (model: string) =>
        `px-4 py-2 text-sm md:px-6 md:py-3 md:text-base font-semibold rounded-full transition-colors duration-300 ${
            activeModel === model
                ? 'bg-neutral-800 text-white shadow-md'
                : 'bg-transparent text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4 bg-white rounded-lg shadow-inner z-40 -mt-8 relative md:-mt-12 lg:-mt-16">
            <button
                className={buttonClass('Overview')}
                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                onClick={() => setActiveModel('Overview')}
            >
                {t('overview')}
            </button>
            <button
                className={buttonClass('Gallery')}
                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                onClick={() => setActiveModel('Gallery')}
            >
                {t('gallery')}
            </button>
            <button
                className={buttonClass('3D Model')}
                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                onClick={() => setActiveModel('3D Model')}
            >
                {t('gallery3D')}
            </button>
        </div>
    );
};

// * ========================= End Model Selector Component =========================



// * ========================= Logo Fetch Types =========================
// Types for logo data from Strapi
interface LogoMediaDataItem {
    id: number;
    url: string;
}
interface LuxuryCarLogoAttributes {
    logo: LogoMediaDataItem;
    bigLogo?: LogoMediaDataItem | null;
}
interface StrapiLuxuryCarLogoResponse {
    data: LuxuryCarLogoAttributes | null;
    meta: any;
}

// * ========================= End Logo Fetch Types =========================

// * ========================= CarDetail Main Component =========================
// Main car detail page, handles data fetching, modal, and layout
// ? Fetches car, logo, and hero data from Strapi. Handles modal, navigation, and error states.
const CarDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    // Set base URL from environment variable
    const strapiBaseUrl = import.meta.env.VITE_API_URL;

    const [car, setCar] = useState<CarDetailData | null>(null);
    const [heroData, setHeroData] = useState<LuxuryHeroAttributes | null>(null);
    const [logoData, setLogoData] = useState<LuxuryCarLogoAttributes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [activeModel, setActiveModel] = useState('Overview');
    const [currentLocale, setCurrentLocale] = useState<string>('en');

    const handleLocaleChange = (newLocale: string) => {
        setCurrentLocale(newLocale);
    };

    // Translation object for static text
    const translations = {
        en: {
            loadingDetails: "Loading Details...",
            errorTitle: "Error:",
            errorMessage: "There was a problem loading the page content. Please try again later.",
            backToCars: "Back to Cars",
            noCarDetails: "No Car Details Available",
            carNotFound: "The car you are looking for could not be found.",
            overview: "Overview",
            gallery: "Gallery",
            gallery3D: "3D model",
            specifications: "SPECIFICATIONS",
            year: "YEAR",
            regYear: "REG YEAR",
            numberOfOwners: "NUMBER OF OWNERS",
            mileage: "MILEAGE",
            exteriorColor: "EXTERIOR COLOUR",
            interiorColor: "INTERIOR COLOUR",
            gear: "GEAR",
            horsepower: "HORSEPOWER",
            fuelType: "FUEL TYPE",
            priceOnRequest: "Price on Request",
            contactUs: "Contact Us",
            descriptionOfVehicle: "Description of vehicle",
            engine: "Engine:",
            fuelEconomy: "Fuel Economy:",
            suspension: "Suspension:",
            noAdditionalDetails: "No additional description details available.",
            noGalleryImages: "No gallery images available for this car.",
            model3DComingSoon: "3D Model Coming Soon!",
            scrollToZoom: "Scroll to zoom, drag to pan, double click to zoom in/out",
            closeModal: "Close modal",
            previousImage: "Previous image",
            nextImage: "Next image",
            fullSizeImage: "Full size image",
            galleryImage: "Gallery image"
        },
        ka: {
            loadingDetails: "დეტალები იტვირთება...",
            errorTitle: "შეცდომა:",
            errorMessage: "გვერდის კონტენტის ჩატვირთვისას პრობლემა მოხდა. გთხოვთ, მოგვიანებით სცადოთ.",
            backToCars: "მანქანებზე დაბრუნება",
            noCarDetails: "მანქანის დეტალები მიუწვდომელია",
            carNotFound: "თქვენს მიერ ძებნილი მანქანა ვერ მოიძებნა.",
            overview: "მიმოხილვა",
            gallery: "გალერეა",
            gallery3D: "3D მოდელი",
            specifications: "სპეციფიკაციები",
            year: "წელი",
            regYear: "რეგ. წელი",
            numberOfOwners: "მფლობელების რაოდენობა",
            mileage: "გარბენი",
            exteriorColor: "გარე ფერი",
            interiorColor: "შიდა ფერი",
            gear: "გადაცემათა კოლოფი",
            horsepower: "ცხენის ძალა",
            fuelType: "საწვავის ტიპი",
            priceOnRequest: "ფასი მოთხოვნით",
            contactUs: "დაგვიკავშირდით",
            descriptionOfVehicle: "მანქანის აღწერა",
            engine: "ძრავა:",
            fuelEconomy: "საწვავის ეკონომია:",
            suspension: "სუსპენზია:",
            noAdditionalDetails: "დამატებითი აღწერილობითი დეტალები მიუწვდომელია.",
            noGalleryImages: "ამ მანქანისთვის გალერეის სურათები მიუწვდომელია.",
            model3DComingSoon: "3D მოდელი მალე!",
            scrollToZoom: "გადაადგილება მასშტაბირებისთვის, გადათრევა პანირებისთვის, ორმაგი დაწკაპუნება მასშტაბირებისთვის",
            closeModal: "მოდალის დახურვა",
            previousImage: "წინა სურათი",
            nextImage: "შემდეგი სურათი",
            fullSizeImage: "სრული ზომის სურათი",
            galleryImage: "გალერეის სურათი"
        }
    };

    const t = (key: keyof typeof translations.en) => {
        return translations[currentLocale as keyof typeof translations]?.[key] || translations.en[key];
    };

    // --- State for Image Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index for navigation

    // Function to open the modal
    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    // Function to close the modal
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentImageIndex(0); 
        
        document.body.style.overflow = 'unset';
    }, []);


    // BUTTONSSS

    const handleEnquireClick = () => {
        navigate('/luxurycars/contact');
    };
    // Navigate to next image in modal
    const goToNextImage = useCallback(() => {
        if (car && car.galleryImages.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % car.galleryImages.length
            );
        }
    }, [car]);

    // Navigate to previous image in modal
    const goToPrevImage = useCallback(() => {
        if (car && car.galleryImages.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex - 1 + car.galleryImages.length) % car.galleryImages.length
            );
        }
    }, [car]);

    // Keyboard navigation for modal (Escape key, arrow keys)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isModalOpen) return;

            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowRight') {
                goToNextImage();
            } else if (event.key === 'ArrowLeft') {
                goToPrevImage();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, closeModal, goToNextImage, goToPrevImage]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch logo from /api/luxurycar
                const logoApiUrl = `${strapiBaseUrl}/api/luxurycar?populate=*`;
                const logoResponse = await fetch(logoApiUrl);
                if (logoResponse.ok) {
                    const logoJson: StrapiLuxuryCarLogoResponse = await logoResponse.json();
                    if (logoJson?.data) {
                        setLogoData(logoJson.data);
                    }
                }

                // Fetch Luxury Heroes Data for Navbar Logo from remote Strapi
                const heroApiUrl = `${strapiBaseUrl}/api/luxury-heroes?populate[basicinfo][populate]=companyLogo`;
                const heroResponse = await fetch(heroApiUrl);
                if (heroResponse.ok) {
                    const heroJson = await heroResponse.json();
                    if (heroJson?.data?.length > 0) {
                        setHeroData(heroJson.data[0].attributes);
                    } else {
                        setHeroData(null); // No hero data found
                    }
                } else {
                    // If 404 or other error, just skip hero data
                    setHeroData(null);
                }

                // Fetch Car Details Data from remote Strapi
                if (!slug) {
                    setError("No car slug provided in the URL.");
                    setLoading(false);
                    return;
                }

                const carApiUrl = `${strapiBaseUrl}/api/luxurycars-cars?filters[slug][$eq]=${slug}&populate=*&locale=${currentLocale}`;
                const carResponse = await fetch(carApiUrl);
                if (!carResponse.ok) {
                    setError("Car not found.");
                    setLoading(false);
                    return;
                }
                const remoteData = await carResponse.json();
                if (remoteData.data && remoteData.data.length > 0) {
                    // Support both Strapi formats: with and without .attributes
                    const raw = remoteData.data[0];
                    const item = raw.attributes ? raw.attributes : raw;
                    const itemId = raw.id;

                    // --- Use cars.tsx mapping logic ---
                    const Brand = item.carBrand || '';
                    const carSlug = item.slug;
                    if (!carSlug) {
                        setError("Car not found.");
                        setLoading(false);
                        return;
                    }
                    // Parse price
                    const priceString = item.carPrice || '';
                    const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;


                    // Main image - support direct object with .url property
                    let imageUrl = '';
                    if (item.carPic) {
                      if (item.carPic.url) {
                        imageUrl = item.carPic.url;
                      } else if (item.carPic.data && item.carPic.data.attributes && item.carPic.data.attributes.url) {
                        imageUrl = item.carPic.data.attributes.url;
                      }
                      if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = `${strapiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                      }
                    }
                    if (!imageUrl) {
                      imageUrl = `https://placehold.co/800x400/cccccc/333333?text=${encodeURIComponent(item.carName || 'Main Car Image')}`;
                    }

                    // Brand logo
                    const brandLogoUrl = item.brandLogo?.data
                        ? getMediaUrl(item.brandLogo.data, strapiBaseUrl)
                        : `https://placehold.co/20x20/cccccc/ffffff?text=${Brand.charAt(0)}`;

                    // Background video - support direct object with .url property
                    let backgroundVID = '';
                    if (item.backgroundVID) {
                      // ? Sometimes the video info comes as a simple object with a web link inside (url)
                      // ? Other times, the video info is inside a box called 'data', and then inside another box called 'attributes', and then 'url'
                      // ? We check both ways, so it works no matter how the info comes
                      if (item.backgroundVID.url) {
                        // ? If the video link is right here, just use it
                        backgroundVID = item.backgroundVID.url;
                      } else if (item.backgroundVID.data && item.backgroundVID.data.attributes && item.backgroundVID.data.attributes.url) {
                        // ? If the video link is hidden deeper, go inside the boxes to get it
                        backgroundVID = item.backgroundVID.data.attributes.url;
                      }
                      // ? If the link does not start with 'http', it means it's not a full web address, so we add the website address in front
                      if (backgroundVID && !backgroundVID.startsWith('http')) {
                        backgroundVID = `${strapiBaseUrl}${backgroundVID.startsWith('/') ? '' : '/'}${backgroundVID}`;
                      }
                    }


                    // Gallery images: prefer galleryIMGs, then sliderImages, then carPic
                    let galleryImages: string[] = [];
                    if (item.galleryIMGs && Array.isArray(item.galleryIMGs)) {
                      // If Strapi returns direct array
                      galleryImages = item.galleryIMGs.map((img: any) => img.url ? (img.url.startsWith('http') ? img.url : `${strapiBaseUrl}${img.url.startsWith('/') ? '' : '/'}${img.url}`) : '').filter(Boolean);
                    } else if (item.galleryIMGs && item.galleryIMGs.length) {
                      // If Strapi returns array-like
                      galleryImages = item.galleryIMGs.map((img: any) => img.url ? (img.url.startsWith('http') ? img.url : `${strapiBaseUrl}${img.url.startsWith('/') ? '' : '/'}${img.url}`) : '').filter(Boolean);
                    } else if (item.galleryIMGs && item.galleryIMGs.data && Array.isArray(item.galleryIMGs.data)) {
                      // If Strapi returns relation object
                      galleryImages = getMultipleMediaUrls(item.galleryIMGs, strapiBaseUrl);
                    }
                    if (!galleryImages.length) {
                      // Fallback to sliderImages
                      const sliderImages = item.carSliderImg?.data && Array.isArray(item.carSliderImg.data)
                        ? getMultipleMediaUrls(item.carSliderImg, strapiBaseUrl)
                        : (item.checkingIMGs?.data && Array.isArray(item.checkingIMGs.data)
                            ? getMultipleMediaUrls(item.checkingIMGs, strapiBaseUrl)
                            : []);
                      galleryImages = sliderImages.length > 0 ? sliderImages : [imageUrl];
                    }

                    // Specifications
                    const specs = item.carSpecifications || {};
                    setCar({
                        id: itemId,
                        model: item.carName || '',
                        brand: Brand,
                        price: price,
                        slug: carSlug,
                        imageUrl: imageUrl,
                        carPicUrl: imageUrl, // carPicUrl will use the same as imageUrl
                        backgroundVID: backgroundVID,
                        brandLogoUrl: brandLogoUrl,
                        isSold: !!item.isSold, // Corrected from carSold to isSold based on StrapiCarAttributes
                        description: item.carDesc || 'A luxurious and high-performance vehicle offering unparalleled elegance and power.',
                        overviewP1: item.carOverviewP1 || '',
                        overviewP2: item.carOverviewP2 || '',
                        engineDescription: item.carEngineDesc || '',
                        fuelEconomyRange: item.Car_fuel_economy_range || '',
                        suspension: item.carSuspension || '',
                        year: specs.year || 'N/A',
                        regYear: specs.regYear || 'N/A',
                        numberOfOwners: specs.owners || 'N/A',
                        mileage: specs.mileage || 'N/A',
                        exteriorColor: specs.exteriorColor || 'N/A',
                        interiorColor: specs.interiorColor || 'N/A',
                        gearType: specs.gearType || 'N/A',
                        power: specs.power || 'N/A',
                        fuelType: specs.fuelType || 'N/A',
                        galleryImages: galleryImages,
                    });
                } else {
                    setError("Car not found.");
                }
            } catch (e: any) {
                console.error("Failed to fetch data:", e);
                setError(`Failed to load content: ${e.message}. Please check if Strapi is running and accessible.`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, strapiBaseUrl, currentLocale]); // Added currentLocale to refetch when language changes

    // Use logo from /api/luxurycar for Navbar and Footer
    const logoUrl = logoData?.logo?.url
        ? (logoData.logo.url.startsWith('http') ? logoData.logo.url : `${strapiBaseUrl}${logoData.logo.url.startsWith('/') ? '' : '/'}${logoData.logo.url}`)
        : car?.brandLogoUrl || "";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4"
                 style={{ fontFamily: 'Ferrari Sans, sans-serif' }}
            >
                <h2 className="text-3xl font-bold mb-4" style={{ fontWeight: 700 }}>{t('loadingDetails')}</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4"
                 style={{ fontFamily: 'Ferrari Sans, sans-serif' }}
            >
                <h2 className="text-3xl font-bold mb-4 text-red-500" style={{ fontWeight: 700 }}>{t('errorTitle')} {error}</h2>
                <p className="text-lg text-gray-400" style={{ fontWeight: 300 }}>{t('errorMessage')}</p>
                <button
                    onClick={() => navigate('/luxurycars/cars')}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                    style={{ fontWeight: 600 }}
                >
                    {t('backToCars')}
                </button>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4"
                 style={{ fontFamily: 'Ferrari Sans, sans-serif' }}
            >
                <h2 className="text-3xl font-bold mb-4" style={{ fontWeight: 700 }}>{t('noCarDetails')}</h2>
                <p className="text-lg text-gray-400" style={{ fontWeight: 300 }}>{t('carNotFound')}</p>
                <button
                    onClick={() => navigate('/luxurycars/cars')}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                    style={{ fontWeight: 600 }}
                >
                    {t('backToCars')}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center"
             style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 400 }}
        >
            <Navbar 
                largeLogoSrc={logoUrl} 
                smallLogoSrc={logoUrl} 
                hideOnScrollDown={true}
                onLocaleChange={handleLocaleChange}
                currentLocale={currentLocale}
            />

            <HeroSection backgroundVID={car.backgroundVID} />

            <div
                className="relative z-30 text-center pb-12 flex flex-col items-center w-full"
                style={{
                    marginTop: '-31vh',
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

                    @media (max-width: 768px) {
                        .relative.z-30.text-center.pb-12 {
                            margin-top: -20vh !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .relative.z-30.text-center.pb-12 {
                            margin-top: -15vh !important;
                        }
                    }
                `}</style>
                <h2
                    className="car-text text-6xl md:text-7xl lg:text-8xl font-extrabold text-white uppercase tracking-tight leading-none mb-4 md:mb-6 z-40 drop-shadow-lg"
                    style={{ fontFamily: "'Dancing Script', cursive", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', paddingTop: '10px', paddingBottom: '30px' }}
                >
                    {car.model}
                </h2>
                <img
                    src={car.carPicUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full max-w-xl md:max-w-3xl lg:max-w-5xl h-auto object-contain mx-auto -mt-16 md:-mt-24 lg:-mt-32 z-40 relative"
                />
            </div>

            <ModelSelector activeModel={activeModel} setActiveModel={setActiveModel} t={t} />

            <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 flex-grow">
                {activeModel === 'Overview' && (
                    <>
                        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 uppercase tracking-tight leading-tight"
                                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                            >
                                {car.model}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium keep-original-font">
                                {car.description}
                            </p>

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200"
                                    style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                                >
                                    {t('overview')}
                                </h2>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 keep-original-font">
                                    {car.overviewP1}
                                </p>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed keep-original-font">
                                    {car.overviewP2}
                                </p>
                            </div>

                            <div className="border border-gray-300 rounded-lg overflow-hidden mb-8 shadow-sm">
                                <div
                                    className="flex justify-between items-center bg-gray-50 p-4 cursor-pointer select-none hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800"
                                        style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                                    >
                                        {t('descriptionOfVehicle')}
                                    </h3>
                                    <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDescriptionExpanded ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-4 text-gray-700 space-y-3 keep-original-font">
                                        {car.engineDescription && <p><strong>{t('engine')}</strong> {car.engineDescription}</p>}
                                        {car.fuelEconomyRange && <p><strong>{t('fuelEconomy')}</strong> {car.fuelEconomyRange}</p>}
                                        {car.suspension && <p><strong>{t('suspension')}</strong> {car.suspension}</p>}
                                        {!car.engineDescription && !car.fuelEconomyRange && !car.suspension && (
                                            <p>{t('noAdditionalDetails')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="mt-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 self-center"
                                style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                            >
                                {t('backToCars')}
                            </button>
                        </div>

                        <div className="w-full lg:w-1/3 bg-emerald-950 rounded-xl shadow-lg p-3 md:p-4 text-white h-fit lg:sticky lg:top-24 flex flex-col border border-emerald-800">
                            <div className="bg-white rounded-lg p-5 md:p-6 flex flex-col text-gray-900 shadow-inner">
                                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 border-b border-gray-200 pb-3"
                                    style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                                >
                                    {t('specifications')}
                                </h2>
                                <div className="flex-grow">
                                    <ul className="w-full space-y-2">
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {t('year')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.year}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                {t('regYear')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.regYear}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                {t('numberOfOwners')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.numberOfOwners}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 18c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM4 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM20 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
                                                </svg>
                                                {t('mileage')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.mileage}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17A.999.999 0 018 16V8.5L14 3v5.5a1 1 0 01-1 1H9z"></path>
                                                </svg>
                                                {t('exteriorColor')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.exteriorColor}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17A.999.999 0 018 16V8.5L14 3v5.5a1 1 0 01-1 1H9z"></path>
                                                </svg>
                                                {t('interiorColor')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.interiorColor}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3"></path>
                                                </svg>
                                                {t('gear')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.gearType}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                </svg>
                                                {t('horsepower')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.power}</span>
                                        </li>
                                        <li className="flex justify-between items-center pb-2"> {/* This was the incomplete li */}
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m-1 5l-1 1H8l-1-1m0 0V9m0 0L4 7m0 0l-1-2M4 7V3m0 0h2m0 4V3m0"></path>
                                                </svg>
                                                {t('fuelType')}
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.fuelType}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    {/* Price tag above Contact Us button */}
                                    <span className="block w-full text-center text-emerald-700 font-bold text-2xl mb-2 bg-emerald-100 rounded-lg py-2 shadow-sm">
                                        {car.price > 0 ? car.price.toLocaleString() : t('priceOnRequest')}
                                    </span>
                                    <button
                                        onClick={handleEnquireClick}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                                        style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 600 }}
                                    >
                                        {t('contactUs')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeModel === 'Gallery' && car.galleryImages.length > 0 && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200"
                            style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                        >
                            {t('gallery')}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {car.galleryImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-48 sm:h-40 md:h-48 rounded-lg overflow-hidden cursor-zoom-in shadow-md group"
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${t('galleryImage')} ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-125"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m0 0H7"></path></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeModel === 'Gallery' && car.galleryImages.length === 0 && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center text-gray-600">
                        <p className="text-lg">No gallery images available for this car.</p>
                    </div>
                )}

                {activeModel === '3D Model' && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200"
                            style={{ fontFamily: 'Ferrari Sans, sans-serif', fontWeight: 700 }}
                        >
                            3D Model
                        </h2>
                        <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                            <p className="text-xl font-medium">3D Model Coming Soon!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {isModalOpen && car && car.galleryImages.length > 0 && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <ModalImageZoom
                        imageSrc={car.galleryImages[currentImageIndex]}
                        altText={`Full size image ${currentImageIndex + 1}`}
                        onClose={closeModal}
                        onPrev={goToPrevImage}
                        onNext={goToNextImage}
                        showNav={car.galleryImages.length > 1}
                        modalKey={isModalOpen ? 1 + currentImageIndex : 0}
                    />
                </div>
            )}

            <Footer logoUrl={logoUrl} />
        </div>
    );
};

// ! ========================= End CarDetail Main Component =========================

export default CarDetail;