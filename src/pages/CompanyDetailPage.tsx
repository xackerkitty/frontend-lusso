import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

// TypeScript interface for CompanyLogo
interface CompanyLogo {
    id: number;
    url: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: { url: string; };
        small?: { url: string; };
        medium?: { url: string; };
        thumbnail?: { url: string; };
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Re-using the same structure as CompanyLogo for mainBanner as they are both media assets
interface MainBanner { // Renamed to MainBanner (capital M) for consistency and clarity
    id: number;
    url: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: { url: string; };
        small?: { url: string; };
        medium?: { url: string; };
        thumbnail?: { url: string; };
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// TypeScript interface for ContactInfo
interface ContactInfo {
    id: number;
    contact_detail: string;
    contact_type: string;
}

// TypeScript interface for Company (updated to reflect API response structure and new fields)
interface Company {
    id: number;
    documentId: string;
    slug: string;
    companyName: string;
    mainTitle: string;
    mainDesc: string | null;
    contactTitle: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    buttonTxt: string | null;
    websiteUrl?: string | null; // Optional: If you add a website URL field in Strapi
    companyLogo: CompanyLogo | null;
    mainBanner: MainBanner | null; // Use the renamed interface here
    contactInfo: ContactInfo | null; // Can be null based on your JSON
}

const CompanyDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate(); // Initialize navigate hook
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const BASE_API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!slug) {
            setError("Company slug not provided in URL.");
            setLoading(false);
            return;
        }

        const fetchCompanyDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use populate=* to fetch all relations and components for the single entry
                const response = await fetch(`${BASE_API_URL}/api/companies?filters[slug][$eq]=${slug}&populate=*`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    const companyItem = data.data[0]; // Get the first (and likely only) item

                    let companyLogo: CompanyLogo | null = null;
                    // Check if companyLogo exists and its URL is present directly on companyItem
                    if (companyItem.companyLogo && companyItem.companyLogo.url) {
                        const logo = companyItem.companyLogo;
                        companyLogo = {
                            id: logo.id,
                            name: logo.name,
                            alternativeText: logo.alternativeText,
                            caption: logo.caption,
                            width: logo.width,
                            height: logo.height,
                            formats: logo.formats || null,
                            hash: logo.hash,
                            ext: logo.ext,
                            mime: logo.mime,
                            size: logo.size,
                            previewUrl: logo.previewUrl,
                            provider: logo.provider,
                            provider_metadata: logo.provider_metadata,
                            createdAt: logo.createdAt,
                            updatedAt: logo.updatedAt,
                            publishedAt: logo.publishedAt,
                            // Ensure the URL is absolute
                            url: logo.url.startsWith('http://') || logo.url.startsWith('https://')
                                ? logo.url
                                : `${BASE_API_URL}${logo.url}`
                        };
                    }

                    // Corrected: Declare a variable for mainBanner
                    let mainBannerImage: MainBanner | null = null; // Changed variable name to avoid conflict with interface
                    if (companyItem.mainBanner && companyItem.mainBanner.url) {
                        const banner = companyItem.mainBanner; // Use 'banner' for clarity
                        mainBannerImage = { // Assign to the variable
                            id: banner.id,
                            name: banner.name,
                            alternativeText: banner.alternativeText,
                            caption: banner.caption,
                            width: banner.width,
                            height: banner.height,
                            formats: banner.formats || null,
                            hash: banner.hash,
                            ext: banner.ext,
                            mime: banner.mime,
                            size: banner.size,
                            previewUrl: banner.previewUrl,
                            provider: banner.provider,
                            provider_metadata: banner.provider_metadata,
                            createdAt: banner.createdAt,
                            updatedAt: banner.updatedAt,
                            publishedAt: banner.publishedAt,
                            // Ensure the URL is absolute
                            url: banner.url.startsWith('http://') || banner.url.startsWith('https://')
                                ? banner.url
                                : `${BASE_API_URL}${banner.url}`
                        };
                    }

                    let contactInfo: ContactInfo | null = null;
                    // Check if contactInfo exists and has required properties directly on companyItem
                    if (companyItem.contactInfo && companyItem.contactInfo.contact_detail && companyItem.contactInfo.contact_type) {
                        contactInfo = {
                            id: companyItem.contactInfo.id || 0, // Fallback for ID
                            contact_detail: companyItem.contactInfo.contact_detail,
                            contact_type: companyItem.contactInfo.contact_type
                        };
                    }

                    setCompany({
                        id: companyItem.id,
                        documentId: companyItem.documentId || companyItem.slug,
                        slug: companyItem.slug,
                        companyName: companyItem.companyName,
                        mainTitle: companyItem.mainTitle,
                        mainDesc: companyItem.mainDesc,
                        contactTitle: companyItem.contactTitle,
                        createdAt: companyItem.createdAt,
                        updatedAt: companyItem.updatedAt,
                        publishedAt: companyItem.publishedAt,
                        buttonTxt: companyItem.buttonTxt,
                        websiteUrl: companyItem.websiteUrl || null, // Assuming websiteUrl might come directly
                        companyLogo: companyLogo,
                        mainBanner: mainBannerImage, // Assign the variable here
                        contactInfo: contactInfo,
                    });
                } else {
                    setCompany(null);
                    setError("Company not found.");
                }
            } catch (err: any) {
                console.error("Failed to fetch company details:", err);
                setError("Failed to load company details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetail();
    }, [slug]); // Re-run effect if slug changes

    // Function to handle the "Discover Our Website" button click
    const handleDiscoverWebsite = () => {
        if (company?.websiteUrl) {
            window.open(company.websiteUrl, '_blank'); // Open URL in a new tab
        } else {
            // If no specific website URL, navigate back to the main page
            navigate('/');
            console.warn("No specific website URL provided for this company. Navigating back.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-inter bg-[#0A260A] text-gray-100">
                Loading company details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-red-500 font-inter bg-red-50 p-4 rounded-lg shadow-md">
                {error}
                <button
                    onClick={() => navigate('/')}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-inter bg-[#0A260A] text-gray-100">
                Company details could not be loaded.
                <button
                    onClick={() => navigate('/')}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        // Overall page background is a dark green
        <div className="min-h-screen bg-[#0A260A] text-gray-100 font-sans">
            {/* Navbar - Minimal for detail page, with company name and back button */}
            <nav className="fixed w-full z-10 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-md">
  <div className="mx-auto py-4 flex items-center" style={{ paddingLeft: '5.5rem', paddingRight: '5.5rem' }}>
    {/* Company Name in Navbar */}
    <div className="text-2xl font-bold text-white rounded-md">
      BLU <span className="text-green-400">Holding</span>
    </div>
    {/* Back Button - Pushed to the right using ml-auto */}
    <button
      onClick={() => navigate('/')}
      className="text-white hover:text-green-400 transition duration-300 rounded-md px-3 py-1 border border-white hover:border-green-400 ml-auto"
    >
      Go Back
    </button>
  </div>
</nav>


            {/* Main Content Section - Adjusted pt-16 to account for fixed navbar */}
            <main className="flex flex-col md:flex-row min-h-screen md:min-h-[120vh] pt-16">
                {/* Left Half - Text Content with dark green background */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#0A260A] bg-opacity-90 rounded-md">
                    {/* Applying mx-auto for horizontal centering within this flex item */}
                    <div className="max-w-xl text-left mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white rounded-md">
                            {company.mainTitle || company.companyName || "Null"}
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed mb-8 text-gray-300 rounded-md">
                            {company.mainDesc || "Null"}
                        </p>

                        {/* "Discover Our Website" button - conditionally rendered */}
                        {company.buttonTxt && (
                            <button
                                onClick={handleDiscoverWebsite}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-8"
                            >
                                {company.buttonTxt}
                            </button>
                        )}

                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-white rounded-md">
                            {company.contactTitle || ""}
                        </h2>
                        <div className="space-y-3 text-gray-300">
                            {company.contactInfo && company.contactInfo.contact_detail ? (
                                <>
                                    {company.contactInfo.contact_type === 'Address' && (
                                        <p className="flex items-center rounded-md">
                                            <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {company.contactInfo.contact_detail}
                                        </p>
                                    )}
                                    {company.contactInfo.contact_type === 'Phone' && (
                                        <p className="flex items-center rounded-md">
                                            <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            {company.contactInfo.contact_detail}
                                        </p>
                                    )}
                                    {company.contactInfo.contact_type === 'Email' && (
                                        <p className="flex items-center rounded-md">
                                            <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            {company.contactInfo.contact_detail}
                                        </p>
                                    )}
                                    {/* Fallback for other contact types or if type is missing */}
                                    {(!company.contactInfo.contact_type || (company.contactInfo.contact_type !== 'Address' && company.contactInfo.contact_type !== 'Phone' && company.contactInfo.contact_type !== 'Email')) && (
                                        <p className="flex items-center rounded-md">
                                            {company.contactInfo.contact_type ? `${company.contactInfo.contact_type}: ` : ''}
                                            {company.contactInfo.contact_detail}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="flex items-center rounded-md">
                                    Contact Info: Null
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Half - Image (Main Banner or Company Logo) */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-800 rounded-md">
                    {company.mainBanner && company.mainBanner.url ? (
                        <img
                            src={company.mainBanner.url}
                            alt={company.mainBanner.alternativeText || company.companyName + " Main Banner"}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://placehold.co/800x600/374151/ffffff?text=Main+Banner+Not+Found";
                            }}
                        />
                    ) : company.companyLogo && company.companyLogo.url ? (
                        <img
                            src={company.companyLogo.url}
                            alt={company.companyName || "Company Logo"}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://placehold.co/800x600/6b7280/ffffff?text=Image+Not+Found";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300 text-xl rounded-lg">
                            No Image Available
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyDetailPage;