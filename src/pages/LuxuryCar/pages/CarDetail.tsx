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
    backgroundVid?: SingleMediaRelation;
    brandLogo?: SingleMediaRelation;
    isSold?: boolean;
    checkingIMGs?: MultipleMediaRelation;
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
    backgroundVideoUrl: string;
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

    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        return relativePath;
    } else {
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

// --- Hero Section Component ---
const HeroSection: React.FC<{ backgroundVideoUrl: string }> = ({ backgroundVideoUrl }) => (
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
        {backgroundVideoUrl && (
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
                src={backgroundVideoUrl}
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

// --- CarDetail Main Component ---
const CarDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const strapiBaseUrl = "http://localhost:1337";

    const [car, setCar] = useState<CarDetailData | null>(null);
    const [heroData, setHeroData] = useState<LuxuryHeroAttributes | null>(null);
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
                // Fetch Luxury Heroes Data for Navbar Logo
                const heroApiUrl = `${strapiBaseUrl}/api/luxury-heroes?populate[basicinfo][populate]=companyLogo`;
                const heroResponse = await fetch(heroApiUrl);
                if (!heroResponse.ok) {
                    throw new Error(`HTTP error fetching hero data! Status: ${heroResponse.status}`);
                }
                const heroJson = await heroResponse.json();
                if (heroJson?.data?.length > 0) {
                    setHeroData(heroJson.data[0].attributes);
                } else {
                    console.warn("No luxury hero data found for Navbar logo.");
                }

                // Fetch Car Details Data
                if (!slug) {
                    setError("No car slug provided in the URL.");
                    setLoading(false);
                    return;
                }

                const populateFields = [
                    'carImage', 'carPic', 'backgroundVid', 'brandLogo', 'carDescription',
                    'carOverviewP1', 'carOverviewP2', 'carEngineDesc',
                    'Car_fuel_economy_range', 'carSuspension',
                    'carSpecifications', // <<< KEY CHANGE: Populating the component
                    'checkingIMGs'
                ].join(',');

                const carResponse = await fetch(`${strapiBaseUrl}/api/cars?filters[slug][$eq]=${slug}&populate=${populateFields}`);
                if (!carResponse.ok) {
                    throw new Error(`HTTP error! status: ${carResponse.status}`);
                }
                const responseData: { data: StrapiCarData[] } = await carResponse.json();

                if (responseData.data && responseData.data.length > 0) {
                    const strapiCar = responseData.data[0];
                    const attributes = strapiCar.attributes;

                    const priceString = attributes.carPrice;
                    const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;

                    const imageUrl = getMediaUrl(attributes.carImage?.data, strapiBaseUrl)
                        || `https://placehold.co/1920x600/333333/ffffff?text=${encodeURIComponent(attributes.carName || 'Car Background')}`;

                    const carPicUrl = getMediaUrl(attributes.carPic?.data, strapiBaseUrl)
                        || `https://placehold.co/800x400/cccccc/333333?text=${encodeURIComponent(attributes.carName || 'Main Car Image')}`;

                    const backgroundVideoUrl = getMediaUrl(attributes.backgroundVid?.data, strapiBaseUrl)
                        || ``;

                    const brand = attributes.carBrand || '';
                    const brandLogoPlaceholder = brand ? encodeURIComponent(brand.charAt(0)) : '';
                    const brandLogoUrl = getMediaUrl(attributes.brandLogo?.data, strapiBaseUrl)
                        || `https://placehold.co/20x20/cccccc/ffffff?text=${brandLogoPlaceholder}`;

                    const galleryImages = getMultipleMediaUrls(attributes.checkingIMGs, strapiBaseUrl);

                    setCar({
                        id: strapiCar.id,
                        model: attributes.carName,
                        brand: brand,
                        price: price,
                        slug: attributes.slug,
                        imageUrl: imageUrl,
                        carPicUrl: carPicUrl,
                        backgroundVideoUrl: backgroundVideoUrl,
                        brandLogoUrl: brandLogoUrl,
                        isSold: attributes.isSold || false,

                        description: attributes.carDesc || 'A luxurious and high-performance vehicle offering unparalleled elegance and power.',
                        overviewP1: attributes.carOverviewP1 || 'From its sleek exterior lines to its meticulously designed interior, every detail has been considered to provide both comfort and control. Advanced aerodynamics ensure stability at high speeds, while the intuitive infotainment system keeps you connected on the go.',
                        overviewP2: attributes.carOverviewP2 || 'Under the hood, a powerful engine awaits, delivering exhilarating acceleration and a refined ride. The cabin is an oasis of tranquility, shielding occupants from road noise and vibrations, making every journey a pleasure. Experience the pinnacle of automotive engineering.',
                        engineDescription: attributes.carEngineDesc || '4.0-liter Twin-Turbocharged V8 engine, producing 507 horsepower and 568 lb-ft of torque. Featuring quattro all-wheel drive system and adaptive air suspension.',
                        fuelEconomyRange: attributes.Car_fuel_economy_range || '18-25 MPG combined',
                        suspension: attributes.carSuspension || 'Adaptive air suspension with multiple driving modes for optimal comfort and performance.',

                        // <<< KEY CHANGE: Accessing fields from the carSpecifications component
                        year: attributes.carSpecifications?.year || 'N/A',
                        regYear: attributes.carSpecifications?.regYear || 'N/A',
                        numberOfOwners: attributes.carSpecifications?.owners || 'N/A',
                        mileage: attributes.carSpecifications?.mileage || 'N/A',
                        exteriorColor: attributes.carSpecifications?.exteriorColor || 'N/A',
                        interiorColor: attributes.carSpecifications?.interiorColor || 'N/A',
                        gearType: attributes.carSpecifications?.gearType || 'N/A',
                        horsePower: attributes.carSpecifications?.horsePower || 'N/A',
                        fuelType: attributes.carSpecifications?.fuelType || 'N/A',
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
    }, [slug, strapiBaseUrl]);

    const companyLogoUrl = heroData?.basicinfo?.companyLogo?.data
        ? getMediaUrl(heroData.basicinfo.companyLogo.data, strapiBaseUrl)
        : "";

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
            <Navbar largeLogoSrc={companyLogoUrl} smallLogoSrc={companyLogoUrl} />

            <HeroSection backgroundVideoUrl={car.backgroundVideoUrl} />

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
                                                EXTERNAL COLOUR
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
                                        <li className="flex justify-between items-center pb-2">
                                            <span className="flex items-center text-gray-600 text-sm md:text-base">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m-1 5l-1 1H8l-1-1m0 0V9m0 0L4 7m0 0l-1-2M4 7V3m0 0h2m0 4V3m0 0l-2-2m2 2h2"></path>
                                                </svg>
                                                FUEL TYPE
                                            </span>
                                            <span className="font-semibold text-base md:text-lg text-gray-800">{car.fuelType}</span>
                                        </li>
                                    </ul>
                                </div>
                                 <div className="text-center mt-6">
                                    <p className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                        Price: ${car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    {car.isSold ? (
                                        <span className="inline-block bg-red-600 text-white text-lg font-bold px-5 py-2 rounded-full shadow-md">
                                            SOLD
                                        </span>
                                    ) : (
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300" onClick={handleEnquireClick}>
                                            Enquire Now
                                        </button>
                                    )}
                                </div>
                                
                                {car.isSold && (
                                    <div className="mt-4 text-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                        <p className="font-bold">SOLD!</p>
                                        <p className="text-sm">This vehicle is no longer available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeModel === 'Gallery' && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">Gallery</h2>
                        {car.galleryImages && car.galleryImages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {car.galleryImages.map((image, index) => (
                                    <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                                        onClick={() => openModal(index)}>
                                        <img
                                            src={image}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m0 0H7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 text-lg">No gallery images available for this car.</p>
                        )}
                    </div>
                )}

                {/* Image Modal */}
                {isModalOpen && car && car.galleryImages.length > 0 && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                        <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                            <button
                                className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-gray-300"
                                onClick={closeModal}
                                aria-label="Close image modal"
                            >
                                &times;
                            </button>
                            <img
                                src={car.galleryImages[currentImageIndex]}
                                alt={`Gallery image ${currentImageIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-xl"
                            />
                            <button
                                className="absolute left-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200 z-50"
                                onClick={goToPrevImage}
                                aria-label="Previous image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            <button
                                className="absolute right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200 z-50"
                                onClick={goToNextImage}
                                aria-label="Next image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>
                )}

                {activeModel === '3D Model' && (
                    <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">3D Model</h2>
                        <p className="text-lg text-gray-600">
                            3D model integration coming soon!
                        </p>
                        {/* Placeholder for 3D model viewer or iframe */}
                        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mt-6">
                            <p className="text-gray-500">Your 3D model viewer will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
             <div
            style={{marginTop: '50px', width: "100%"}}>
                <Footer logoUrl={companyLogoUrl} />
            </div>
        </div>
    );
};

export default CarDetail;