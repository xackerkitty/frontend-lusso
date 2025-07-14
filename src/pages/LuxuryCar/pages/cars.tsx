// src/pages/LuxuryCar/pages/cars.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Assuming Navbar and Footer components are available at these paths
import Navbar from '../components/Navbar';
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
    availableBrands: string[]; // This list is passed to the sidebar
    selectedSoldStatus: 'all' | 'sold' | 'not-sold';
    onSoldStatusChange: (status: 'all' | 'sold' | 'not-sold') => void;
}

interface CarCardProps {
    car: Car;
}

interface CarListingsProps {
    cars: Car[];
}

// --- Helper Functions ---
const getMediaUrl = (
    mediaContent: MediaDataItem | string | null | undefined,
    baseUrl: string
): string => {
    let relativePath: string | undefined;

    // Enhanced check for mediaContent.data for SingleMediaRelation type
    if (mediaContent && typeof mediaContent !== "string" && mediaContent.attributes && mediaContent.attributes.url) {
        relativePath = mediaContent.attributes.url;
    } else if (typeof mediaContent === "string") {
        relativePath = mediaContent;
    } else {
        return ""; // No valid media content
    }

    if (!relativePath) {
        return "";
    }

    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
        return relativePath;
    } else {
        // Ensure leading slash for relative paths
        return `${baseUrl}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
    }
};

// --- Hero Section Component ---
const HeroSection: React.FC = () => (
    <header className="relative bg-gray-900 text-white py-24 md:py-32 overflow-hidden shadow-xl">
        {/* Blue Gradient Background */}
        <div className="absolute inset-0" style={{
            background: "linear-gradient(to right,rgb(45, 58, 46),rgb(0, 27, 6))", marginTop: "3rem" /* Shades of blue */
        }}>
            {/* Blurry "Lusso" Text */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                    fontSize: '10rem', // Adjust font size as needed
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.33)', // Very light white for the blurry effect
                    filter: 'blur(3px)', // Adjust blur amount as needed
                    zIndex: 0, // Ensure it's behind the main content
                }}
            >
                Lusso
            </div>
            <div className="absolute inset-0 bg-black opacity-30"></div> {/* Subtle overlay for depth */}
        </div>
        <div className="container mx-auto relative z-10 text-center px-4" style={{marginTop: "3rem"}}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Our Cars</h1>
            <p className="text-lg md:text-xl opacity-90">Explore our exclusive collection of luxury vehicles.</p>
        </div>
    </header>
);

// --- Filter Sidebar Component ---
const FilterSidebar: React.FC<FilterSidebarProps> = ({
    searchTerm, onSearchChange,
    minPrice, maxPrice, onMinPriceChange, onMaxPriceChange,
    selectedBrands, onBrandChange, availableBrands,
    selectedSoldStatus, onSoldStatusChange
}) => {
    const [isPriceExpanded, setIsPriceExpanded] = useState(true);
    const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
    const [isAvailabilityExpanded, setIsAvailabilityExpanded] = useState(true);

    return (
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-lg h-fit mb-8 lg:mb-0 min-h-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Filter</h2>

            <div className="mb-6">
                <label htmlFor="search-cars" className="block text-gray-700 text-sm font-medium mb-2">Search for cars or brand</label>
                <div className="relative">
                    <input
                        type="text"
                        id="search-cars"
                        placeholder="Search for cars or brand"
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
                    <label className="block text-gray-700 text-sm font-medium">Price</label>
                    <svg className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isPriceExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPriceExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex flex-col flex-1">
                                <label className="block text-gray-600 text-sm font-medium mb-1">Minimum Price</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={maxPrice}
                                    value={minPrice}
                                    onChange={onMinPriceChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right text-gray-800 bg-white"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="block text-gray-600 text-sm font-medium mb-1">Maximum Price</label>
                                <input
                                    type="number"
                                    min={minPrice}
                                    max="500000"
                                    value={maxPrice}
                                    onChange={onMaxPriceChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right text-gray-800 bg-white"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600 text-sm font-medium mb-1">Minimum Price </label>
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                value={minPrice}
                                onChange={onMinPriceChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: '#22c55e' }}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-1">Maximum Price</label>
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                value={maxPrice}
                                onChange={onMaxPriceChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: '#22c55e' }}
                            />
                            <style>{`
                                input[type='range']::-webkit-slider-thumb {
                                    width: 18px;
                                    height: 18px;
                                    background: #22c55e;
                                    border-radius: 50%;
                                    box-shadow: 0 0 2px #333;
                                    border: 2px solid #fff;
                                }
                                input[type='range']:focus::-webkit-slider-thumb {
                                    outline: 2px solid #22c55e;
                                }
                                input[type='range']::-moz-range-thumb {
                                    width: 18px;
                                    height: 18px;
                                    background: #22c55e;
                                    border-radius: 50%;
                                    border: 2px solid #fff;
                                }
                                input[type='range']:focus::-moz-range-thumb {
                                    outline: 2px solid #22c55e;
                                }
                            `}</style>
                        </div>
                        <div className="mt-2 text-center text-green-700 font-bold text-base">
                            Selected Range: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Filter Section */}
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
                                onChange={() => onSoldStatusChange('all')}
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
                                onChange={() => onSoldStatusChange('not-sold')}
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
                                onChange={() => onSoldStatusChange('sold')}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                            />
                            <label htmlFor="status-sold" className="ml-2 text-gray-700 text-sm">Sold</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brands Filter Section */}
            <div className="mb-0">
                <div
                    className="flex justify-between items-center mb-2 cursor-pointer select-none"
                    onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                >
                    <label className="block text-gray-700 text-sm font-medium">Brands</label>
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
                            <p className="text-gray-500 text-sm">No brands available (check hardcoded list).</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

// --- Car Card Component with Slider Logic ---
const CarCard: React.FC<CarCardProps> = ({ car }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => setImageError(true);
    const [brandLogoError, setBrandLogoError] = useState(false);
    const handleBrandLogoError = () => setBrandLogoError(true);

    const imageContainerRef = useRef<HTMLDivElement>(null);

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
        setCurrentImageIndex(0);
    };

    const displayImageUrl = car.sliderImages[currentImageIndex] || car.imageUrl;

    return (
        <Link
            to={`/luxurycars/cardetails/${car.slug}`}
            className="relative bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out w-full border border-gray-200 block"
        >
            {car.isSold && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Sold</div>
            )}

            <div
                ref={imageContainerRef}
                className="relative w-full h-40 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {imageError || !displayImageUrl ? (
                    <div className="w-full h-full bg-gray-300 flex flex-col items-center justify-center text-gray-600 text-center p-4">
                        <p className="font-bold text-lg mb-1">{car.model}</p>
                        <p className="text-sm">Image not available</p>
                    </div>
                ) : (
                    <img
                        src={displayImageUrl}
                        alt={`${car.model} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-100 ease-in-out"
                        onError={handleImageError}
                    />
                )}

                {car.sliderImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        {car.sliderImages.map((_, idx) => (
                            <span
                                key={idx}
                                className={`block w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-gray-400 opacity-75'}`}
                            ></span>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="flex items-center mb-0.5">
                    {brandLogoError || !car.brandLogoUrl ? (
                        <div className="w-6 h-6 mr-2 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-xs">
                            {car.Brand ? car.Brand.charAt(0) : ''} {/* CORRECTED: Access car.Brand */}
                        </div>
                    ) : (
                        <img
                            src={car.brandLogoUrl}
                            alt={`${car.Brand} Logo`} 
                            className="w-6 h-6 mr-2 object-contain"
                            onError={handleBrandLogoError}
                        />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {car.model}
                    </h3>
                </div>
                <p className="text-lg font-bold text-gray-800">${car.price.toLocaleString()}</p>
            </div>
        </Link>
    );
};

// --- Car Listings Component ---
const CarListings: React.FC<CarListingsProps> = ({ cars }) => (
    <section className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 min-h-0">
        {cars.length > 0 ? cars.map(car => (
            <div key={car.id}>
                <CarCard car={car} />
            </div>
        )) : (
            <div className="col-span-full text-center py-10 text-gray-500 text-lg">No cars found matching your criteria.</div>
        )}
    </section>
);

// --- Main LuxuryCar Page Component ---
const LuxuryCar: React.FC = () => {
    // Use base URL from environment variable
    const strapiBaseUrl = import.meta.env.VITE_API_URL;

    const [allCars, setAllCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSoldStatus, setSelectedSoldStatus] = useState<'all' | 'sold' | 'not-sold'>('all');
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);

    // Define your hardcoded list of available brands here
    // IMPORTANT: These names MUST exactly match the brand names you have in Strapi (e.g., "Ferrari", not "ferrari")
    const predefinedAvailableBrands: string[] = [
        "Audi",
        "BMW",
        "Bugatti",
        "Ferrari",
        "Lamborghini",
        "Mercedes-Benz",
        "Porsche",
        "Rolls-Royce",
        // Add all other brands you want to show in the filter sidebar
    ].sort(); // Sort them alphabetically for a clean display

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            console.log("Attempting to fetch car data...");

            try {
                const carsApiUrl = `${strapiBaseUrl}/api/luxurycars-cars?populate=*`;
                console.log("Fetching Cars from:", carsApiUrl);
                const response = await fetch(carsApiUrl);
                console.log("Fetch response received:", response);

                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("HTTP error details:", errorBody);
                    if (response.status === 403 || response.status === 401) {
                        throw new Error(`Authentication/Permission Error: Status ${response.status}. Check Strapi roles and permissions for 'Luxurycars Cars' collection.`);
                    } else if (response.status === 404) {
                        throw new Error(`Not Found: Status ${response.status}. The API endpoint '${carsApiUrl}' might be incorrect, or there's no published data.`);
                    }
                    throw new Error(`HTTP error fetching cars! Status: ${response.status}. Response: ${errorBody.substring(0, 100)}...`);
                }
                const responseData = await response.json();

                console.log("Raw Strapi API Response for Cars (JSON):", responseData);

                if (!responseData.data || !Array.isArray(responseData.data) || responseData.data.length === 0) {
                    console.warn("Strapi /api/luxurycars-cars returned no data or empty array. Displaying 'No cars found'.");
                    setAllCars([]);
                    setFilteredCars([]);
                    setLoading(false);
                    return;
                }

                // Helper to get best image format from Strapi media object
                const getBestImageUrl = (mediaObj: any) => {
                    if (!mediaObj || !mediaObj.formats) return mediaObj?.url || '';
                    return (
                        mediaObj.formats.large?.url ||
                        mediaObj.formats.medium?.url ||
                        mediaObj.formats.small?.url ||
                        mediaObj.formats.thumbnail?.url ||
                        mediaObj.url || ''
                    );
                };

                // Helper for multiple images (slider/gallery)
                const getMultipleImageUrls = (mediaArr: any[]) => {
                    if (!Array.isArray(mediaArr)) return [];
                    return mediaArr.map(item => getBestImageUrl(item)).filter(Boolean);
                };

                const loadedCars: Car[] = responseData.data.map((strapiCar: any) => {
                    // Direct mapping from API response
                    const Brand = strapiCar.carBrand || '';
                    const carSlug = strapiCar.slug;
                    if (!carSlug) return null;
                    // Parse price
                    const priceString = strapiCar.carPrice || '';
                    const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
                    const price = isNaN(parsedPrice) ? 0 : parsedPrice;
                    // Main image
                    const imageUrl = getBestImageUrl(strapiCar.carPic);
                    // Brand logo
                    const brandLogoUrl = getBestImageUrl(strapiCar.brandLogo);
                    // Slider images
                    const sliderImages = getMultipleImageUrls(strapiCar.carSliderImg);
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

                console.log("All cars loaded into state (after processing and filtering for slug):", loadedCars);
                setAllCars(loadedCars);
                setFilteredCars(loadedCars);

                if (loadedCars.length > 0) {
                    const maxFetchedPrice = Math.max(...loadedCars.map(car => car.price));
                    setMinPrice(0);
                    setMaxPrice(maxFetchedPrice);
                    console.log(`Initial max price set to: $${maxFetchedPrice}`);
                } else {
                    setMinPrice(0);
                    setMaxPrice(500000);
                    console.log("No cars loaded, prices reset to default.");
                }

            } catch (e: any) {
                console.error("Failed to fetch car data:", e);
                setError(`Failed to load content: ${e.message}`);
            } finally {
                setLoading(false);
                console.log("Loading state set to false.");
            }
        };

        fetchAllData();
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

        if (selectedSoldStatus === 'sold') {
            temp = temp.filter(c => c.isSold);
        } else if (selectedSoldStatus === 'not-sold') {
            temp = temp.filter(c => !c.isSold);
        }

        temp = temp.filter(c => c.display === true);

        setFilteredCars(temp);
        console.log(`Filters applied. Showing ${temp.length} cars.`);
    }, [searchTerm, minPrice, maxPrice, selectedBrands, selectedSoldStatus, allCars]);

    const availableBrands = predefinedAvailableBrands;

    return (
        <div className="font-sans text-gray-800 bg-gray-100 min-h-screen overflow-x-hidden flex flex-col">
            {/* Custom scrollbar styling */}
            <style>{`
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
            `}</style>
            {/* Navbar component without logo props */}
            <Navbar />
            <HeroSection />
            <main className="container mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 flex-grow">
                {loading ? (
                    <div className="w-full text-center py-20 text-gray-600 text-xl">Loading cars...</div>
                ) : error ? (
                    <div className="w-full text-center py-20 text-red-600 text-xl">
                        Error loading cars: {error}
                        <p className="text-base text-gray-700 mt-4">
                            Please check your Strapi server's status, API endpoint, and public permissions for the 'Luxurycars Home' collection.
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
                            selectedSoldStatus={selectedSoldStatus}
                            onSoldStatusChange={setSelectedSoldStatus}
                        />
                        <CarListings cars={filteredCars} />
                    </>
                )}
            </main>
            <Footer logoUrl="" />
        </div>
    );
};

export default LuxuryCar;