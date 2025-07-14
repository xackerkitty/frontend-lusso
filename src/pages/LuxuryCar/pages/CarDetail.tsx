import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "../scr/css/car_details.css";
import Footer from '../components/Footer';

// --- INTERFACES ---
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
    horsePower?: string;
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
    horsePower: string;
    fuelType: string;
    galleryImages: string[];
}

// --- Helper Functions ---
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

    // Ensure base URL is only prepended if the path is relative
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
    // Assuming mediaObj is `item.carPic.data.attributes` or similar
    if (!mediaObj || !mediaObj.attributes) return ''; // Ensure attributes exist
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

// --- Hero Section Component ---

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
                marginTop: '96px',
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

// --- Model Selector Component ---
interface ModelSelectorProps {
    activeModel: string;
    setActiveModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ activeModel, setActiveModel }) => {
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
                onClick={() => setActiveModel('Overview')}
            >
                Overview
            </button>
            <button
                className={buttonClass('Gallery')}
                onClick={() => setActiveModel('Gallery')}
            >
                Gallery
            </button>
            <button
                className={buttonClass('3D Model')}
                onClick={() => setActiveModel('3D Model')}
            >
                3D model
            </button>
        </div>
    );
};

// --- Logo fetch types ---
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

// --- CarDetail Main Component ---
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
        setCurrentImageIndex(0); // Reset index on close
        // Restore body scroll
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

                const carApiUrl = `${strapiBaseUrl}/api/luxurycars-cars?filters[slug][$eq]=${slug}&populate=*`;
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
                      // If Strapi returns direct object (not .data)
                      if (item.backgroundVID.url) {
                        backgroundVID = item.backgroundVID.url;
                      } else if (item.backgroundVID.data && item.backgroundVID.data.attributes && item.backgroundVID.data.attributes.url) {
                        backgroundVID = item.backgroundVID.data.attributes.url;
                      }
                      // If the url is not absolute, prepend base
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
                        horsePower: specs.horsePower || 'N/A',
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
    }, [slug, strapiBaseUrl]); // Added strapiBaseUrl to dependency array

    // Use logo from /api/luxurycar for Navbar and Footer
    const logoUrl = logoData?.logo?.url
        ? (logoData.logo.url.startsWith('http') ? logoData.logo.url : `${strapiBaseUrl}${logoData.logo.url.startsWith('/') ? '' : '/'}${logoData.logo.url}`)
        : car?.brandLogoUrl || "";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
                <h2 className="text-3xl font-bold mb-4">Loading Details...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4" >
                <h2 className="text-3xl font-bold mb-4 text-red-500">Error: {error}</h2>
                <p className="text-lg text-gray-400">There was a problem loading the page content. Please try again later.</p>
                <button
                    onClick={() => navigate('/luxurycars/cars')}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                >
                    Back to Cars
                </button>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
                <h2 className="text-3xl font-bold mb-4">No Car Details Available</h2>
                <p className="text-lg text-gray-400">The car you are looking for could not be found.</p>
                <button
                    onClick={() => navigate('/luxurycars/cars')}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                >
                    Back to Cars
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center">
            <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />

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

            <ModelSelector activeModel={activeModel} setActiveModel={setActiveModel} />

            <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 flex-grow">
                {activeModel === 'Overview' && (
                    <>
                        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 uppercase tracking-tight leading-tight">
                                {car.brand} {car.model}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium">
                                {car.description}
                            </p>

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Overview</h2>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                                    {car.overviewP1}
                                </p>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    {car.overviewP2}
                                </p>
                            </div>

                            <div className="border border-gray-300 rounded-lg overflow-hidden mb-8 shadow-sm">
                                <div
                                    className="flex justify-between items-center bg-gray-50 p-4 cursor-pointer select-none hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Description of vehicle</h3>
                                    <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDescriptionExpanded ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-4 text-gray-700 space-y-3">
                                        {car.engineDescription && <p><strong>Engine:</strong> {car.engineDescription}</p>}
                                        {car.fuelEconomyRange && <p><strong>Fuel Economy:</strong> {car.fuelEconomyRange}</p>}
                                        {car.suspension && <p><strong>Suspension:</strong> {car.suspension}</p>}
                                        {!car.engineDescription && !car.fuelEconomyRange && !car.suspension && (
                                            <p>No additional description details available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="mt-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 self-center"
                            >
                                Back to Cars
                            </button>
                        </div>

                        <div className="w-full lg:w-1/3 bg-emerald-950 rounded-xl shadow-lg p-3 md:p-4 text-white h-fit lg:sticky lg:top-24 flex flex-col border border-emerald-800">
                            <div className="bg-white rounded-lg p-5 md:p-6 flex flex-col text-gray-900 shadow-inner">
                                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 border-b border-gray-200 pb-3">SPECIFICATIONS</h2>
                                <div className="flex-grow">
                                    <ul className="w-full space-y-2">
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                YEAR
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.year}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                REG YEAR
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.regYear}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                NUMBER OF OWNERS
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.numberOfOwners}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 18c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM4 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM20 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
                                                </svg>
                                                MILEAGE
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.mileage}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17A.999.999 0 018 16V8.5L14 3v5.5a1 1 0 01-1 1H9z"></path>
                                                </svg>
                                                EXTERIOR COLOUR
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.exteriorColor}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17A.999.999 0 018 16V8.5L14 3v5.5a1 1 0 01-1 1H9z"></path>
                                                </svg>
                                                INTERIOR COLOUR
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.interiorColor}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 2m0 0l-2-2m2 2V3"></path>
                                                </svg>
                                                GEAR
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.gearType}</span>
                                        </li>
                                        <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                </svg>
                                                HORSEPOWER
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.horsePower}</span>
                                        </li>
                                        <li className="flex justify-between items-center pb-2"> {/* This was the incomplete li */}
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m-1 5l-1 1H8l-1-1m0 0V9m0 0L4 7m0 0l-1-2M4 7V3m0 0h2m0 4V3m0"></path>
                                                </svg>
                                                FUEL TYPE
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.fuelType}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        onClick={handleEnquireClick}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
                                    >
                                        Enquire Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeModel === 'Gallery' && car.galleryImages.length > 0 && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {car.galleryImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-48 sm:h-40 md:h-48 rounded-lg overflow-hidden cursor-pointer shadow-md transform transition-transform duration-200 hover:scale-105"
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">3D Model</h2>
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
                    onClick={closeModal} // Close modal when clicking outside the image
                >
                    <div className="relative max-w-screen-lg w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 text-white text-4xl font-bold z-50"
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <img
                            src={car.galleryImages[currentImageIndex]}
                            alt={`Full size image ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        {car.galleryImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full text-2xl hover:bg-opacity-75 transition-all"
                                    onClick={goToPrevImage}
                                    aria-label="Previous image"
                                >
                                    &#10094;
                                </button>
                                <button
                                    className="absolute right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full text-2xl hover:bg-opacity-75 transition-all"
                                    onClick={goToNextImage}
                                    aria-label="Next image"
                                >
                                    &#10095;
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer logoUrl={logoUrl} />
        </div>
    );
};

export default CarDetail;