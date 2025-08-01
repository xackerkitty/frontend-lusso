// src/pages/LuxuryCar/pages/cars.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import "../scr/css/style.css";

// --- Logo Helper ---
interface MediaDataItem {
    url: string;
    [key: string]: any;
}
interface LuxuryCarAttributes {
    logo: MediaDataItem;
    bigLogo?: MediaDataItem | null;
}
interface StrapiLuxuryCarResponse {
    data: LuxuryCarAttributes | null;
    meta: any;
}

const getMediaUrl = (mediaDataContent: any): string => {
    let relativePath: string | undefined;
    if (mediaDataContent === null || mediaDataContent === undefined) {
        return "";
    }
    if (typeof mediaDataContent === "string") {
        relativePath = mediaDataContent;
    } else if (!Array.isArray(mediaDataContent)) {
        if ('data' in mediaDataContent && mediaDataContent.data !== null && mediaDataContent.data !== undefined) {
            if ('url' in mediaDataContent.data) {
                relativePath = mediaDataContent.data.url;
            } else if (mediaDataContent.data.attributes?.url) {
                relativePath = mediaDataContent.data.attributes.url;
            }
        } else if ('url' in mediaDataContent) {
            relativePath = mediaDataContent.url;
        } else if (mediaDataContent.attributes?.url) {
            relativePath = mediaDataContent.attributes.url;
        }
    } else if (Array.isArray(mediaDataContent) && mediaDataContent.length > 0) {
        const firstItem = mediaDataContent[0];
        if (firstItem && 'url' in firstItem) {
            relativePath = firstItem.url;
        } else if (firstItem && firstItem.attributes?.url) {
            relativePath = firstItem.attributes.url;
        }
    } else {
        return "";
    }
    if (!relativePath) {
        return "";
    }
    const STRAPI_BASE_URL = import.meta.env.VITE_API_URL || "";
    let fullUrl = "";
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        fullUrl = relativePath;
    } else {
        const separator = relativePath.startsWith("/") ? "" : "/";
        fullUrl = `${STRAPI_BASE_URL}${separator}${relativePath}`;
    }
    return fullUrl;
};
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

// Updated StrapiCarAttributes: 'Brand' is a direct string (enumeration)
interface StrapiCarAttributes {
    carName: string;
    Brand: string; // CORRECTED: Now 'Brand' with capital 'B'
    carPrice: string;
    slug: string;
    carImage?: SingleMediaRelation;
    brandLogo?: SingleMediaRelation; // This is a separate image field on the car itself
    carSliderImg?: MultipleMediaRelation;
    carSold?: boolean; // Matches the field name in Strapi
    display?: boolean; // NEW: Added display property from Strapi
}

interface StrapiCarData {
    id: number;
    attributes: StrapiCarAttributes;
}

interface Car {
    id: number;
    model: string;
    Brand: string; // CORRECTED: This property will store the car's brand name (e.g., "Ferrari") with capital 'B'
    price: number;
    slug: string;
    imageUrl: string;
    brandLogoUrl: string; // This would typically come from the related Brand entity's logo
    sliderImages: string[];
    isSold: boolean; // Internal model name for your React components
    display: boolean; // NEW: Added display property for the internal Car model
}

interface FilterSidebarProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minPrice: number;
    maxPrice: number;
    onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedBrands: string[];
    onBrandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    availableBrands: string[];
    // --- SOLD FILTER DISABLED: Make these optional ---
    selectedSoldStatus?: 'all' | 'sold' | 'not-sold';
    onSoldStatusChange?: (status: 'all' | 'sold' | 'not-sold') => void;
    selectedCurrency: 'USD' | 'EUR';
    onCurrencyChange: (currency: 'USD' | 'EUR') => void;
    t: (key: any) => string;
}

interface CarCardProps {
    car: Car;
    convertPrice: (price: number) => number;
    getCurrencySymbol: () => string;
    t: (key: any) => string;
}

interface CarListingsProps {
    cars: Car[];
    convertPrice: (price: number) => number;
    getCurrencySymbol: () => string;
}

// --- Hero Section Component ---
interface HeroSectionProps {
    t: (key: any) => string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ t }) => (
  <section
    className="relative bg-gray-900 text-white overflow-hidden shadow-xl flex items-center justify-center"
    style={{
      height: "320px",
      minHeight: "320px",
      maxHeight: "320px",
      marginTop: "0",
      width: "100%",
    }}
  >
    {/* Blue Gradient Background */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to right,rgb(45, 58, 46),rgb(0, 27, 6))",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
      {/* Subtle overlay for depth */}
    </div>
    <div className="container mx-auto relative z-10 text-center px-4">
      <h1
        className="text-2xl md:text-4xl font-bold mb-1 text-white"
        style={{ fontFamily: "'Ferrari-SansBold', sans-serif" }}
      >
        {t('heroTitle')}
      </h1>
      <p className="text-sm md:text-base opacity-90">
        {t('heroSubtitle')}
      </p>
    </div>
  </section>
);

// --- Filter Sidebar Component ---
const FilterSidebar: React.FC<FilterSidebarProps> = ({
    searchTerm, onSearchChange,
    minPrice, maxPrice, onMinPriceChange, onMaxPriceChange,
    selectedBrands, onBrandChange, availableBrands,
    selectedSoldStatus, onSoldStatusChange,
    selectedCurrency, onCurrencyChange,
    t
}) => {
    const [isPriceExpanded, setIsPriceExpanded] = useState(true);
    const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
    const [isAvailabilityExpanded, setIsAvailabilityExpanded] = useState(true);
    // Conversion rate (should match parent)
    const USD_TO_EUR = 0.92;
    // Calculate slider min/max based on selected currency
    const sliderMin = selectedCurrency === 'EUR' ? Math.round(0 * USD_TO_EUR) : 0;
    const sliderMax = selectedCurrency === 'EUR' ? Math.round(500000 * USD_TO_EUR) : 500000;
    // Convert minPrice/maxPrice for display
    const displayMinPrice = selectedCurrency === 'EUR' ? Math.round(minPrice * USD_TO_EUR) : minPrice;
    const displayMaxPrice = selectedCurrency === 'EUR' ? Math.round(maxPrice * USD_TO_EUR) : maxPrice;

    return (
        <aside className="sticky top-2 w-full lg:w-[320px] bg-white p-4 rounded-xl shadow-lg h-fit mb-8 lg:mb-0 min-h-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('filterTitle')}</h2>

            <div className="mb-6">
                <label htmlFor="search-cars" className="block text-gray-700 text-sm font-medium mb-2">{t('searchPlaceholder')}</label>
                <div className="relative">
                    <input
                        type="text"
                        id="search-cars"
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                    <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>

          
<div className="mb-6">
    <div
        className="flex justify-between items-center mb-2 cursor-pointer select-none"
        onClick={() => setIsPriceExpanded(!isPriceExpanded)}
    >
        <label className="block text-gray-700 text-sm font-medium">{t('priceLabel')}</label>
        <svg className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isPriceExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    </div>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPriceExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-200 pt-4">
            {/* Currency Filter Section (moved here) */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">{t('currencyLabel')}</label>
                <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="currency"
                            value="USD"
                            checked={selectedCurrency === 'USD'}
                            onChange={() => onCurrencyChange('USD')}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                        />
                        <span className="ml-2 text-gray-700 text-sm">USD ($)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="currency"
                            value="EUR"
                            checked={selectedCurrency === 'EUR'}
                            onChange={() => onCurrencyChange('EUR')}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                        />
                        <span className="ml-2 text-gray-700 text-sm">EUR (€)</span>
                    </label>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-2">
                <div className="flex flex-col flex-1">
                    <label className="block text-gray-600 text-sm font-medium mb-1">{t('minimumPrice')}</label>
                    <input
                        type="number"
                        min={sliderMin}
                        max={sliderMax}
                        value={displayMinPrice}
                        onChange={e => {
                            // Convert back to USD for parent state
                            const val = Number(e.target.value);
                            const usdVal = selectedCurrency === 'EUR' ? Math.round(val / USD_TO_EUR) : val;
                            onMinPriceChange({
                                ...e,
                                target: { ...e.target, value: usdVal.toString() }
                            });
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right text-gray-800 bg-white"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <label className="block text-gray-600 text-sm font-medium mb-1">{t('maximumPrice')}</label>
                    <input
                        type="number"
                        min={displayMinPrice}
                        max={sliderMax}
                        value={displayMaxPrice}
                        onChange={e => {
                            const val = Number(e.target.value);
                            const usdVal = selectedCurrency === 'EUR' ? Math.round(val / USD_TO_EUR) : val;
                            onMaxPriceChange({
                                ...e,
                                target: { ...e.target, value: usdVal.toString() }
                            });
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right text-gray-800 bg-white"
                    />
                </div>
            </div>
            <div className="mb-2">
                <label className="block text-gray-600 text-sm font-medium mb-1">{t('minimumPrice')} </label>
                <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayMinPrice}
                    onChange={e => {
                        const val = Number(e.target.value);
                        const usdVal = selectedCurrency === 'EUR' ? Math.round(val / USD_TO_EUR) : val;
                        onMinPriceChange({
                            ...e,
                            target: { ...e.target, value: usdVal.toString() }
                        });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: '#6b7280' }}
                />
            </div>
            <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">{t('maximumPrice')}</label>
                <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayMaxPrice}
                    onChange={e => {
                        const val = Number(e.target.value);
                        const usdVal = selectedCurrency === 'EUR' ? Math.round(val / USD_TO_EUR) : val;
                        onMaxPriceChange({
                            ...e,
                            target: { ...e.target, value: usdVal.toString() }
                        });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: '#6b7280' }}
                />
                <style>{`
                    input[type='range']::-webkit-slider-thumb {
                        width: 18px;
                        height: 18px;
                        background: #6b7280;
                        border-radius: 50%;
                        box-shadow: 0 0 2px #333;
                        border: 2px solid #fff;
                    }
                    input[type='range']:focus::-webkit-slider-thumb {
                        outline: 2px solid #6b7280;
                    }
                    input[type='range']::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        background: #6b7280;
                        border-radius: 50%;
                        border: 2px solid #fff;
                    }
                    input[type='range']:focus::-moz-range-thumb {
                        outline: 2px solid #6b7280;
                    }
                `}</style>
            </div>
          
        </div>
    </div>
</div>
               

            {/* Availability Filter Section (SOLD FILTER DISABLED) */}
            {false && (
            <div className="mb-6">
                <div
                    className="flex justify-between items-center mb-2 cursor-pointer select-none"
                    onClick={() => setIsAvailabilityExpanded(!isAvailabilityExpanded)}
                >
                    <label className="block text-gray-700 text-sm font-medium">Availability</label>
                    <svg className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isAvailabilityExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAvailabilityExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="status-all"
                                name="soldStatus"
                                value="all"
                                checked={selectedSoldStatus === 'all'}
                                onChange={() => onSoldStatusChange && onSoldStatusChange('all')}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                            />
                            <label htmlFor="status-all" className="ml-2 text-gray-700 text-sm">All</label>
                        </div>
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="status-not-sold"
                                name="soldStatus"
                                value="not-sold"
                                checked={selectedSoldStatus === 'not-sold'}
                                onChange={() => onSoldStatusChange && onSoldStatusChange('not-sold')}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                            />
                            <label htmlFor="status-not-sold" className="ml-2 text-gray-700 text-sm">Available</label>
                        </div>
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="status-sold"
                                name="soldStatus"
                                value="sold"
                                checked={selectedSoldStatus === 'sold'}
                                onChange={() => onSoldStatusChange && onSoldStatusChange('sold')}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                            />
                            <label htmlFor="status-sold" className="ml-2 text-gray-700 text-sm">Sold</label>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Brands Filter Section */}
            <div className="mb-0">
                <div
                    className="flex justify-between items-center mb-2 cursor-pointer select-none"
                    onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                >
                    <label className="block text-gray-700 text-sm font-medium">{t('brandsLabel')}</label>
                    <svg className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isBrandsExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBrandsExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-200 pt-4 custom-scrollbar max-h-40 overflow-y-auto">
                        {availableBrands.length > 0 ? (
                            availableBrands.map(Brand => ( // Use Brand here for mapping and key
                                <div key={Brand} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`Brand-${Brand}`}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                                        value={Brand}
                                        checked={selectedBrands.includes(Brand)}
                                        onChange={onBrandChange}
                                    />
                                    <label htmlFor={`Brand-${Brand}`} className="ml-2 text-gray-700 text-sm">{Brand}</label>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">{t('noBrandsAvailable')}</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

// --- Car Card Component with Slider Logic ---
const CarCard: React.FC<CarCardProps> = ({ car, convertPrice, getCurrencySymbol, t }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [preloadedImages, setPreloadedImages] = useState<{ [key: number]: boolean }>({});
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [expansionTimer, setExpansionTimer] = useState<NodeJS.Timeout | null>(null);
    const handleImageError = () => setImageError(true);
    const [brandLogoError, setBrandLogoError] = useState(false);
    const handleBrandLogoError = () => setBrandLogoError(true);

    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Preload all slider images on mount
    useEffect(() => {
        const loaded: { [key: number]: boolean } = {};
        car.sliderImages.forEach((imgUrl, idx) => {
            const img = new window.Image();
            img.src = imgUrl;
            img.onload = () => {
                loaded[idx] = true;
                setPreloadedImages(prev => ({ ...prev, [idx]: true }));
            };
            img.onerror = () => {
                loaded[idx] = false;
                setPreloadedImages(prev => ({ ...prev, [idx]: false }));
            };
        });
    }, [car.sliderImages]);

    // Reset loading state when image index changes
    useEffect(() => {
        setImageLoading(true);
    }, [currentImageIndex]);

    const handleImageLoad = () => setImageLoading(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current || car.sliderImages.length <= 1) {
            return;
        }
        const containerWidth = imageContainerRef.current.offsetWidth;
        const mouseX = e.nativeEvent.offsetX;
        const segmentWidth = containerWidth / car.sliderImages.length;
        const newIndex = Math.floor(mouseX / segmentWidth);
        if (newIndex !== currentImageIndex && newIndex < car.sliderImages.length && newIndex >= 0) {
            setCurrentImageIndex(newIndex);
        }
    };

    const handleMouseLeave = () => {
        // Clear any pending expansion timer
        if (expansionTimer) {
            clearTimeout(expansionTimer);
            setExpansionTimer(null);
        }
        setCurrentImageIndex(0);
        setIsImageExpanded(false);
    };

    const handleMouseEnter = () => {
        if (car.sliderImages.length > 1 && !expansionTimer) {
            // Start a timer for delayed expansion (1 second delay)
            const timer = setTimeout(() => {
                setIsImageExpanded(true);
                setExpansionTimer(null);
            }, 1000); // 1 second delay
            
            setExpansionTimer(timer);
        }
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (expansionTimer) {
                clearTimeout(expansionTimer);
            }
        };
    }, [expansionTimer]);

    const displayImageUrl = car.sliderImages[currentImageIndex] || car.imageUrl;

    return (
        <Link
            to={`/luxurycars/cardetails/${car.slug}`}
            className={`relative bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-500 ease-in-out w-full border border-gray-200 block h-80 ${isImageExpanded ? 'image-expanded' : ''}`}
        >
            {car.isSold && (
                <div className={`absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full z-20 shadow-lg transition-opacity duration-300 ${isImageExpanded ? 'opacity-0' : 'opacity-100'}`}>{t('soldBadge')}</div>
            )}

            <div
                ref={imageContainerRef}
                className="relative w-full h-full overflow-hidden transition-all duration-500 ease-in-out"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >
                {(imageError || !displayImageUrl) ? (
                    <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-gray-600 text-center p-4">
                        <p className="font-bold text-lg mb-1">{car.model}</p>
                        <p className="text-sm">{t('imageNotAvailable')}</p>
                    </div>
                ) : (
                    <>
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60 z-10">
                                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            </div>
                        )}
                        <img
                            src={displayImageUrl}
                            alt={`${car.model} - ${currentImageIndex + 1}`}
                            className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </>
                )}

                {car.sliderImages.length > 1 && (
                    <div className={`absolute bottom-2 left-0 right-0 flex justify-center space-x-1 transition-opacity duration-300 ${isImageExpanded ? 'opacity-80' : 'opacity-100'}`}>
                        {car.sliderImages.map((_, idx) => (
                            <span
                                key={idx}
                                className={`block w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white shadow-md' : 'bg-gray-400 opacity-75'}`}
                            ></span>
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                <div className="flex items-center mb-0.5">
                    {brandLogoError || !car.brandLogoUrl ? (
                        <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full text-xs bg-white/20 text-white">
                            {car.Brand ? car.Brand.charAt(0) : ''}
                        </div>
                    ) : (
                        <img
                            src={car.brandLogoUrl}
                            alt={`${car.Brand} Logo`} 
                            className="w-6 h-6 mr-2 object-contain"
                            onError={handleBrandLogoError}
                        />
                    )}
                    <h3 className="text-lg font-semibold leading-tight text-white" style={{ fontFamily: "'Ferrari-SansRegular', sans-serif" }}>
                        {car.model}
                    </h3>
                </div>
                <p className="text-lg font-bold text-white">{getCurrencySymbol()}{convertPrice(car.price).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
        </Link>
    );
};

// --- Car Listings Component ---
interface CarListingsProps {
    cars: Car[];
    convertPrice: (price: number) => number;
    getCurrencySymbol: () => string;
    visibleCount: number;
    onLoadMore: () => void;
    t: (key: any) => string;
}

const CarListings: React.FC<CarListingsProps> = ({ cars, convertPrice, getCurrencySymbol, visibleCount, onLoadMore, t }) => {
    const visibleCars = cars.slice(0, visibleCount);
    return (
        <div className="w-full lg:flex-1 flex flex-col items-center">
            <section className="test2 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 min-h-0">
                {visibleCars.length > 0 ? visibleCars.map(car => (
                    <div key={car.id}>
                        <CarCard car={car} convertPrice={convertPrice} getCurrencySymbol={getCurrencySymbol} t={t} />
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10 text-gray-500 text-lg">{t('noCarsFound')}</div>
                )}
            </section>
            {cars.length > visibleCount && (
                <button
                    className="mt-8 px-6 py-2 bg-[#1a362f] text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                    onClick={onLoadMore}
                >
                    {t('loadMore')}
                </button>
            )}
        </div>
    );
};

// --- Main LuxuryCar Page Component ---
const LuxuryCar: React.FC = () => {
    // Use base URL from environment variable
    const strapiBaseUrl = import.meta.env.VITE_API_URL;

    // --- Simple in-memory cache for SPA navigation ---
    let cachedAllCars: Car[] = [];

    // Use cached data if available
    const [allCars, setAllCars] = useState<Car[]>(cachedAllCars);
    const [loading, setLoading] = useState(cachedAllCars.length === 0);
    const [loadingVisible, setLoadingVisible] = useState(cachedAllCars.length === 0);
    const [error, setError] = useState<string | null>(null);
    const { currentLocale, setLocale } = useLanguage();

    const handleLocaleChange = (newLocale: string) => {
        setLocale(newLocale);
    };

    // Translation object for static text
    const translations = {
        en: {
            heroTitle: "Our Cars",
            heroSubtitle: "Explore our exclusive collection of luxury vehicles.",
            filterTitle: "Filter",
            searchPlaceholder: "Search for cars or brand",
            priceLabel: "Price",
            currencyLabel: "Currency",
            minimumPrice: "Minimum Price",
            maximumPrice: "Maximum Price",
            availabilityLabel: "Availability",
            brandsLabel: "Brands",
            allStatus: "All",
            availableStatus: "Available",
            soldStatus: "Sold",
            soldBadge: "Sold",
            imageNotAvailable: "Image not available",
            noCarsFound: "No cars found matching your criteria.",
            loadMore: "Load More",
            errorLoading: "Error loading cars:",
            checkStrapi: "Please check your Strapi server's status, API endpoint, and public permissions for the 'Luxurycars Home' collection.",
            noBrandsAvailable: "No brands available (check hardcoded list)."
        },
        ka: {
            heroTitle: "ჩვენი მანქანები",
            heroSubtitle: "შეისწავლეთ ჩვენი ექსკლუზიური ძვირადღირებული მანქანების კოლექცია.",
            filterTitle: "ფილტრი",
            searchPlaceholder: "მოძებნეთ მანქანები ან ბრენდი",
            priceLabel: "ფასი",
            currencyLabel: "ვალუტა",
            minimumPrice: "მინიმალური ფასი",
            maximumPrice: "მაქსიმალური ფასი",
            availabilityLabel: "ხელმისაწვდომობა",
            brandsLabel: "ბრენდები",
            allStatus: "ყველა",
            availableStatus: "ხელმისაწვდომი",
            soldStatus: "გაყიდული",
            soldBadge: "გაყიდული",
            imageNotAvailable: "სურათი მიუწვდომელია",
            noCarsFound: "თქვენს კრიტერიუმებს შესაბამისი მანქანები ვერ მოიძებნა.",
            loadMore: "მეტის ჩვენება",
            errorLoading: "მანქანების ჩატვირთვისას შეცდომა:",
            checkStrapi: "გთხოვთ, შეამოწმოთ თქვენი Strapi სერვერის სტატუსი, API endpoint და საჯარო ნებართვები 'Luxurycars Home' კოლექციისთვის.",
            noBrandsAvailable: "ბრენდები მიუწვდომელია (შეამოწმეთ ჰარდკოდირებული სია)."
        }
    };

    const t = (key: keyof typeof translations.en): string => {
        return translations[currentLocale as keyof typeof translations]?.[key] || translations.en[key];
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    // const [selectedSoldStatus, setSelectedSoldStatus] = useState<'all' | 'sold' | 'not-sold'>('not-sold'); // SOLD FILTER DISABLED
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');
    // Conversion rate (example, you can update to live rate if needed)
    const USD_TO_EUR = 0.92;
    // Helper to convert price
    const convertPrice = (price: number) => selectedCurrency === 'EUR' ? price * USD_TO_EUR : price;
    const getCurrencySymbol = () => selectedCurrency === 'EUR' ? '€' : '$';

    // --- Logo State ---
    const [logoData, setLogoData] = useState<LuxuryCarAttributes | null>(null);

    // Define your hardcoded list of available brands here
    // IMPORTANT: These names MUST exactly match the brand names you have in Strapi (e.g., "Ferrari", not "ferrari")
    const predefinedAvailableBrands: string[] = [
        "Audi",
        "BMW",
        "Bugatti",
        "Ferrari",
        "Lamborghini",
        "Bentley",
        "Mercedes-Benz",
        "Porsche",
        "Rolls-Royce",
        // Add all other brands you want to show in the filter sidebar
    ].sort(); // Sort them alphabetically for a clean display

    useEffect(() => {
        if (cachedAllCars.length > 0) {
            setAllCars(cachedAllCars);
            // For cached data, show loading for minimum 2 seconds
            setTimeout(() => {
                setLoadingVisible(false);
                setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
            }, 2000); // Minimum 2s for cached data
        }
        
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            const startTime = Date.now(); // Track when loading started
            
            try {
                // Fetch cars
                const carsApiUrl = `${strapiBaseUrl}/api/luxurycars-cars?populate=*`;
                const response = await fetch(carsApiUrl);
                if (!response.ok) {
                    const errorBody = await response.text();
                    if (response.status === 403 || response.status === 401) {
                        throw new Error(`Authentication/Permission Error: Status ${response.status}. Check Strapi roles and permissions for 'Luxurycars Cars' collection.`);
                    } else if (response.status === 404) {
                        throw new Error(`Not Found: Status ${response.status}. The API endpoint '${carsApiUrl}' might be incorrect, or there's no published data.`);
                    }
                    throw new Error(`HTTP error fetching cars! Status: ${response.status}. Response: ${errorBody.substring(0, 100)}...`);
                }
                const responseData = await response.json();
                if (!responseData.data || !Array.isArray(responseData.data) || responseData.data.length === 0) {
                    setAllCars([]);
                    setFilteredCars([]);
                    const loadTime = Date.now() - startTime;
                    const minLoadTime = 2000; // Minimum 2 seconds
                    const remainingTime = Math.max(0, minLoadTime - loadTime);
                    
                    setTimeout(() => {
                        setLoadingVisible(false);
                        setTimeout(() => setLoading(false), 1000); // Wait for fade to complete
                    }, remainingTime);
                    return;
                }
                // --- Showroom-style robust Strapi media extraction ---
                const getStrapiImageUrl = (mediaObj: any, baseUrl: string) => {
                    if (!mediaObj) return '';
                    if (mediaObj.data && mediaObj.data.attributes) {
                        const attr = mediaObj.data.attributes;
                        const formats = attr.formats;
                        let url =
                            (formats && (formats.large?.url || formats.medium?.url || formats.small?.url || formats.thumbnail?.url)) ||
                            attr.url || '';
                        if (url && !url.startsWith('http')) {
                            url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                        }
                        return url;
                    }
                    if (mediaObj.url) {
                        let url = mediaObj.url;
                        if (url && !url.startsWith('http')) {
                            url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                        }
                        return url;
                    }
                    return '';
                };
                const getStrapiMultipleImageUrls = (mediaRelation: any, baseUrl: string) => {
                    if (!mediaRelation) return [];
                    if (mediaRelation.data && Array.isArray(mediaRelation.data)) {
                        return mediaRelation.data.map((item: any) => getStrapiImageUrl(item, baseUrl)).filter(Boolean);
                    }
                    if (Array.isArray(mediaRelation)) {
                        return mediaRelation.map((item: any) => getStrapiImageUrl(item, baseUrl)).filter(Boolean);
                    }
                    return [];
                };
                const loadedCars: Car[] = responseData.data.map((strapiCar: any) => {
                    const Brand = strapiCar.carBrand || strapiCar.Brand || '';
                    const carSlug = strapiCar.slug;
                    if (!carSlug) return null;
                    const priceString = strapiCar.carPrice || '';
                    const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;
                    const imageUrl = getStrapiImageUrl(strapiCar.carPic, strapiBaseUrl);
                    const brandLogoUrl = getStrapiImageUrl(strapiCar.brandLogo, strapiBaseUrl);
                    const sliderImages = getStrapiMultipleImageUrls(strapiCar.carSliderImg, strapiBaseUrl);
                    return {
                        id: strapiCar.id,
                        model: strapiCar.carName,
                        Brand: Brand,
                        price: price,
                        slug: carSlug,
                        imageUrl: imageUrl || `https://placehold.co/600x400/cccccc/ffffff?text=${encodeURIComponent(strapiCar.carName || 'No Image')}`,
                        brandLogoUrl: brandLogoUrl || `https://placehold.co/20x20/cccccc/ffffff?text=${Brand.charAt(0)}`,
                        sliderImages: sliderImages.length > 0 ? sliderImages : [imageUrl],
                        isSold: !!strapiCar.carSold,
                        display: strapiCar.carDisplay ?? true,
                    };
                }).filter(Boolean);
                setAllCars(loadedCars);
                setFilteredCars(loadedCars);
                cachedAllCars = loadedCars;
                if (loadedCars.length > 0) {
                    const maxFetchedPrice = Math.max(...loadedCars.map(car => car.price));
                    setMinPrice(0);
                    setMaxPrice(maxFetchedPrice);
                } else {
                    setMinPrice(0);
                    setMaxPrice(500000);
                }
            } catch (e: any) {
                setError(`Failed to load content: ${e.message}`);
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
        // Fetch logo
        const fetchLogo = async () => {
            try {
                const logoApiUrl = `${strapiBaseUrl}/api/luxurycar?populate=*`;
                const response = await fetch(logoApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error fetching luxury car logo! Status: ${response.status}.`);
                }
                const logoJson: StrapiLuxuryCarResponse = await response.json();
                if (logoJson?.data) {
                    setLogoData(logoJson.data);
                }
            } catch (e) {
                // Optionally handle logo error
            }
        };
        fetchAllData();
        fetchLogo();
    }, [strapiBaseUrl]);

    useEffect(() => {
        let temp = [...allCars];

        if (searchTerm) {
            temp = temp.filter(c =>
                c.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.Brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        temp = temp.filter(c => c.price >= minPrice && c.price <= maxPrice);

        if (selectedBrands.length > 0) {
            temp = temp.filter(c => selectedBrands.map(s => s.trim()).includes(c.Brand.trim()));
        }

        // --- SOLD FILTER DISABLED: Only show not-sold cars ---
        temp = temp.filter(c => !c.isSold);
        // if (selectedSoldStatus === 'sold') {
        //     temp = temp.filter(c => c.isSold);
        // } else if (selectedSoldStatus === 'not-sold') {
        //     temp = temp.filter(c => !c.isSold);
        // }

        temp = temp.filter(c => c.display === true);

        // Shuffle the array to randomize display order
        for (let i = temp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [temp[i], temp[j]] = [temp[j], temp[i]];
        }

        setFilteredCars(temp);
        setVisibleCount(6); // Reset visible count when filters change
        console.log(`Filters applied. Showing ${temp.length} cars.`);
    }, [searchTerm, minPrice, maxPrice, selectedBrands, /*selectedSoldStatus,*/ allCars]);

    const availableBrands = predefinedAvailableBrands;

    // Derive logo URL
    const logoUrl = logoData?.logo?.url ? getMediaUrl(logoData.logo) : undefined;

    return (
        <div
            className="text-gray-800 bg-gray-100 min-h-screen flex flex-col"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            {/* Custom scrollbar styling and browser compatibility fixes */}
            <style>{`
                /* Browser compatibility reset */
                * {
                    box-sizing: border-box;
                }
                
                /* Custom scrollbar styling */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #e0e0e0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                    border-radius: 10px;
                }
                
                /* Ensure navbar is always visible */
                body {
                    overflow-x: hidden !important;
                    margin: 0;
                    padding: 0;
                }
                
                /* Browser-specific grid fixes */
                .test2 {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
                    gap: 2rem !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                @media (min-width: 640px) {
                    .test2 {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 2rem !important;
                    }
                }
                
                @media (min-width: 1024px) {
                    .test2 {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 2.5rem !important;
                    }
                }
                
                @media (min-width: 1280px) {
                    .test2 {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 2.5rem !important;
                    }
                }
                
                /* Ensure consistent card sizing across browsers */
                .test2 > div {
                    width: 100% !important;
                    min-width: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                
                /* Car card image expansion animation */
                .image-expanded {
                    z-index: 5 !important;
                }
                
                .image-expanded .relative {
                    border-radius: 0.5rem !important;
                }
                
                /* Smooth transitions for all card elements */
                .test2 > div > a {
                    position: relative;
                    overflow: hidden;
                }
                
                .test2 > div > a:hover {
                    transform: scale(1.02) !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                
                /* Fix Edge/IE flexbox issues */
                @supports (-ms-ime-align: auto) {
                    .test2 {
                        display: -ms-grid !important;
                        -ms-grid-columns: 1fr 2.5rem 1fr !important;
                        gap: 2.5rem !important;
                    }
                }
                
                /* Firefox-specific fixes */
                @-moz-document url-prefix() {
                    .test2 {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 2.5rem !important;
                    }
                }
                
                /* Safari-specific fixes */
                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    .test2 {
                        display: grid !important;
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 2.5rem !important;
                    }
                }
                
                /* Ensure proper spacing for fixed navbar */
                .cars-page-content {
                    padding-top: 0;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                /* Fix container spacing consistency - Remove max-width for full width */
                .container {
                    max-width: none !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                    width: 100% !important;
                }
                
                /* Add padding to match navbar menu position */
                main {
                    padding-left: 2rem !important;
                    padding-right: 2rem !important;
                }
                
                @media (min-width: 1024px) {
                    main {
                        padding-left: 4rem !important;
                        padding-right: 4rem !important;
                    }
                }
            `}</style>
            {/* Navbar component with logo */}
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
            
            <div className="cars-page-content">
                <HeroSection t={t} />
                <main className="w-full py-8 px-4 flex flex-col lg:flex-row gap-8 flex-grow" style={{ maxWidth: 'none', margin: '0 auto' }}>
                {error ? (
                    <div className="w-full text-center py-20 text-red-600 text-xl">
                        {t('errorLoading')} {error}
                        <p className="text-base text-gray-700 mt-4">
                            {t('checkStrapi')}
                        </p>
                    </div>
                ) : (
                    <>
                        <FilterSidebar
                            searchTerm={searchTerm}
                            onSearchChange={e => setSearchTerm(e.target.value)}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onMinPriceChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                            onMaxPriceChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                            availableBrands={availableBrands}
                            selectedBrands={selectedBrands}
                            onBrandChange={e => {
                                const Brand = e.target.value;
                                if (e.target.checked) setSelectedBrands([...selectedBrands, Brand]);
                                else setSelectedBrands(selectedBrands.filter(b => b !== Brand));
                            }}
                            // selectedSoldStatus={selectedSoldStatus} // SOLD FILTER DISABLED
                            // onSoldStatusChange={setSelectedSoldStatus} // SOLD FILTER DISABLED
                            selectedCurrency={selectedCurrency}
                            onCurrencyChange={setSelectedCurrency}
                            t={t}
                        />
                        <CarListings
                            cars={filteredCars}
                            convertPrice={convertPrice}
                            getCurrencySymbol={getCurrencySymbol}
                            visibleCount={visibleCount}
                            onLoadMore={() => setVisibleCount(v => v + 6)}
                            t={t}
                        />
                    </>
                )}
            </main>
            </div>
            <Footer logoUrl={logoUrl || ""} />
        </div>
    );
};

export default LuxuryCar;