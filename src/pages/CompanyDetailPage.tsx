import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt, // For Location/Address
    faPhone,         // For Phone
    faEnvelope       // For Email
} from '@fortawesome/free-solid-svg-icons';
import {
    faInstagram,     // For Instagram
    faFacebookF,    // For Facebook (using faFacebookF for consistency)
    faTiktok        // For TikTok
} from '@fortawesome/free-brands-svg-icons'; // Social media icons are in free-brands-svg-icons

// TypeScript interfaces (unchanged from your previous request)
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

interface MainBanner {
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

// Updated: ContactInfo can now include social media types
interface ContactInfo {
    id: number;
    contact_detail: string;
    contact_type: string; // e.g., "Address", "Phone", "Email", "Instagram", "Facebook", "TikTok"
}

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
    websiteUrl?: string | null;
    mainWebLink?: string | null;
    companyLogo: CompanyLogo | null;
    mainBanner: MainBanner | null;
    contactInfo: ContactInfo[];
}

const CompanyDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
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
                const response = await fetch(`${BASE_API_URL}/api/companies?filters[slug][$eq]=${slug}&populate=*`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    const companyItem = data.data[0];

                    let companyLogo: CompanyLogo | null = null;
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
                            url: logo.url.startsWith('http://') || logo.url.startsWith('https://')
                                ? logo.url
                                : `${BASE_API_URL}${logo.url}`
                        };
                    }

                    let mainBannerImage: MainBanner | null = null;
                    if (companyItem.mainBanner && companyItem.mainBanner.url) {
                        const banner = companyItem.mainBanner;
                        mainBannerImage = {
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
                            url: banner.url.startsWith('http://') || banner.url.startsWith('https://')
                                ? banner.url
                                : `${BASE_API_URL}${banner.url}`
                        };
                    }

                    const processedContactInfo: ContactInfo[] = (companyItem.contactInfo || [])
                        .filter((info: any) => info && info.contact_detail && info.contact_type)
                        .map((info: any) => ({
                            id: info.id || Date.now(),
                            contact_detail: info.contact_detail,
                            contact_type: info.contact_type,
                        }));

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
                        websiteUrl: companyItem.websiteUrl || null,
                        mainWebLink: companyItem.mainWebLink || null,
                        companyLogo: companyLogo,
                        mainBanner: mainBannerImage,
                        contactInfo: processedContactInfo,
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
    }, [slug]);

    const handleDiscoverWebsite = () => {
        if (!company?.mainWebLink || company.mainWebLink === "choose here" || company.mainWebLink === "mainWebLink" || company.mainWebLink.trim() === "") return;
        switch (company.mainWebLink) {
            case "luxurycars":
                navigate("/luxurycars/");
                break;
            // Add more cases as needed
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
      <div className="min-h-screen bg-black text-gray-100 font-sans">
        <nav className="fixed w-full z-10 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-md">
          <div
            className="mx-auto py-4 flex items-center justify-between px-4 sm:px-8 lg:px-20 xl:px-22"
          >
            {/* Logo Container */}
            <div className="flex items-center">
              <img
                src="/assets/logo/logo_blue_holding.png"
                alt="Logo"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </div>
            {/* Go Back Button */}
            <button
              onClick={() => navigate("/")}
              className="text-white hover:text-green-400 transition duration-300 rounded-md px-3 py-1 border border-white hover:border-green-400"
            >
              Go Back
            </button>
          </div>
        </nav>

        <main className="flex flex-col md:flex-row min-h-screen md:min-h-[120vh] pt-16">
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#0A260A] bg-opacity-90 rounded-md">
            <div className="max-w-xl text-left mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white rounded-md">
                {company.mainTitle || company.companyName || "Null"}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8 text-gray-300 rounded-md">
                {company.mainDesc || "Null"}
              </p>

              {/* Show button only if mainWebLink is valid, not a placeholder, and not 'nothing' */}
              {company.mainWebLink &&
                company.mainWebLink !== "choose here" &&
                company.mainWebLink !== "mainWebLink" &&
                company.mainWebLink.trim() !== "" &&
                company.mainWebLink !== "nothing" &&
                company.buttonTxt && (
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
                {company.contactInfo.length > 0 ? (
                  company.contactInfo.map((contact, index) => (
                    <p
                      key={contact.id || index}
                      className="flex items-center rounded-md"
                    >
                      {/* Font Awesome Icons based on contact_type */}
                      {contact.contact_type === "Location" && (
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {contact.contact_type === "Phone" && (
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {contact.contact_type === "Email" && (
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {contact.contact_type === "Instagram" && (
                        <FontAwesomeIcon
                          icon={faInstagram}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {contact.contact_type === "Facebook" && (
                        <FontAwesomeIcon
                          icon={faFacebookF}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {contact.contact_type === "TikTok" && (
                        <FontAwesomeIcon
                          icon={faTiktok}
                          className="w-5 h-5 mr-3 text-green-400"
                        />
                      )}
                      {/* Fallback for other contact types or if no icon matches */}
                      {![
                        "Location",
                        "Phone",
                        "Email",
                        "Instagram",
                        "Facebook",
                        "TikTok",
                      ].includes(contact.contact_type) && (
                        <span className="mr-3">🔗</span>
                      )}
                      {/* Removed the contact.contact_type text here */}
                      {contact.contact_detail}
                    </p>
                  ))
                ) : (
                  <p className="flex items-center rounded-md">
                    No contact information available.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className="w-full md:w-1/2 flex items-center justify-center rounded-md"
            style={{
              backgroundColor: "#1f2937",
              minHeight: "400px",
              minWidth: "400px",
              background: "#1f2937 !important",
            }}
          >
            {company.mainBanner && company.mainBanner.url ? (
              <img
                src={company.mainBanner.url}
                alt={
                  company.mainBanner.alternativeText ||
                  company.companyName + " Main Banner"
                }
                className="w-full h-full object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/800x600/374151/ffffff?text=Main+Banner+Not+Found";
                }}
              />
            ) : company.companyLogo && company.companyLogo.url ? (
              <img
                src={company.companyLogo.url}
                alt={company.companyName || "Company Logo"}
                className="w-[80%] h-[80%] object-contain rounded-lg shadow-lg"
                style={{
                  backgroundColor: "#1f2937",
                  background: "#1f2937 !important",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/800x600/6b7280/ffffff?text=Image+Not+Found";
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