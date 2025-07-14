import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../scr/css/aboutus.css';

// --- Type Definitions for new API ---
interface Value {
    id: number;
    valueTitle: string | null;
    valueDesc: string | null;
}

interface WhyUsItem {
    id: number;
    whyUsTitle: string | null;
    whyUsDesc: string | null;
}

interface Media {
    url: string;
    formats?: {
        large?: { url: string };
        medium?: { url: string };
        small?: { url: string };
        thumbnail?: { url: string };
    };
}

interface AboutUsData {
    id: number;
    documentId: string;
    mainTitle: string;
    mainDesc: string;
    buttonTxt: string;
    JourneyTitleTxt: string;
    JourneyDesc: string;
    CTA_title: string;
    CTA_Desc: string;
    CTA_buttonTxt: string;
    ourValues?: Value[];
    whyUs?: WhyUsItem[];
    whyUsImg?: Media | null;
    JourneyIMG?: Media | null;
    mainBGImg?: Media | null; // Optional, as it may not be available in the new API
    // Add image fields here if/when available, e.g. heroImage, journeyImage, etc.
}

const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${STRAPI_BASE_URL}/api/luxurycars-aboutus?populate=*`;

// Helper for images (future-proof)
const getMediaUrl = (media: any): string => {
    if (!media) return '';
    if (typeof media === 'string') return media;
    if (media.url) return media.url.startsWith('http') ? media.url : `${STRAPI_BASE_URL}${media.url}`;
    if (media.data && media.data.attributes && media.data.attributes.url) {
        const url = media.data.attributes.url;
        return url.startsWith('http') ? url : `${STRAPI_BASE_URL}${url}`;
    }
    return '';
};

const Aboutus: React.FC = () => {
    const [data, setData] = useState<AboutUsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', () => setScrollY(window.scrollY));
        return () => window.removeEventListener('scroll', () => setScrollY(window.scrollY));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(json => setData(json.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // --- Fetch logo from API (like Shoowroom.tsx) ---
    const [logoData, setLogoData] = useState<any | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;
                const luxuryCarApiUrl = `${STRAPI_BASE_URL}/api/luxurycar?populate=*`;
                const luxuryCarResponse = await fetch(luxuryCarApiUrl);
                if (!luxuryCarResponse.ok) throw new Error('Failed to fetch logo');
                const luxuryCarJson = await luxuryCarResponse.json();
                setLogoData(luxuryCarJson?.data || null);
            } catch (e) {
                setLogoData(null);
            }
        };
        fetchLogo();
    }, []);

    // Get logo URL using getMediaUrl
    const logoUrl = logoData?.logo?.url ? getMediaUrl(logoData.logo) : '';

    if (loading) return <div className="text-center p-8 text-gray-700">Loading showroom data...</div>;
    if (error) return <div className="text-center p-8 text-red-600 font-bold">Error: {error}</div>;
    if (!data) return <div className="text-center p-8 text-gray-700">No data found.</div>;

    // Parallax effect for hero text/button
    const parallaxOffset = scrollY * 0.2;
    const titleWords = (data.mainTitle || '').split(' ');

    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#1a202c] overflow-x-hidden font-inter antialiased">
            <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />
            {/* Hero Section */}
            <section
                className="relative min-h-screen flex items-center justify-center text-white overflow-hidden hero-background-container py-24 sm:py-32 lg:py-48"
                aria-label="About Us Hero Section"
            >
                {/* Dynamic Background Image from mainBGImg */}
                {data.mainBGImg ? (
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center hero-background-media"
                        style={{
                            backgroundImage: `url('${getMediaUrl(data.mainBGImg.formats?.large?.url || data.mainBGImg.url)}')`,
                        }}
                    ></div>
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-background-media bg-[#1e3a24] opacity-80"></div>
                )}
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a24cc] via-[#1e3a24b3] to-transparent backdrop-blur-md" aria-hidden="true"></div>
                {/* Floating blurred logo/watermark */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 select-none">
                    <span className="text-[15vw] font-extrabold tracking-widest" style={{textShadow:'0 8px 32px #000'}}>LUSSO</span>
                </div>
                {/* Main Content */}
                <div
                    className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center hero-content-wrapper"
                    style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight text-white hero-title animate-fade-in-up drop-shadow-[0_4px_32px_rgba(30,58,36,0.5)]">
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
                        {data.mainDesc}
                    </p>
                    <a
                        href="#"
                        className="inline-block bg-emerald-600 text-white font-bold py-4 px-12 sm:py-5 sm:px-16 rounded-full shadow-xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 animate-button-slide-up hero-button"
                        aria-label={data.buttonTxt}
                    >
                        {data.buttonTxt}
                    </a>
                </div>
                {/* Animated scroll-down indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
                    <span className="block w-2 h-2 rounded-full bg-white mb-1"></span>
                    <span className="block w-1 h-8 rounded-full bg-gradient-to-b from-white/80 to-transparent"></span>
                </div>
            </section>
            {/* Our Story Section */}
            <section className="aboutUsSec bg-white min-h-screen flex items-center py-16 sm:py-24" aria-labelledby="our-story-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <h2 id="our-story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] mb-4 sm:mb-6">
                            {data.JourneyTitleTxt}
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 text-gray-700">
                            {data.JourneyDesc?.split("\n\n")[0]}
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                            {data.JourneyDesc?.split("\n\n")[1]}
                        </p>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center">
                        {data.JourneyIMG && (
                            <img
                                src={getMediaUrl(data.JourneyIMG.formats?.large?.url || data.JourneyIMG.url)}
                                alt="Our Journey image"
                                className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                                loading="lazy"
                            />
                        )}
                    </div>
                </div>
            </section>
            {/* Our Values Section - Placeholder, as new API does not provide values */}
            <section className="ourValues bg-[#1e3a24] text-white min-h-screen flex items-center relative overflow-hidden py-20 sm:py-32" aria-labelledby="our-values-heading">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="lusso-blurry-text">LUSSO</span>
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10 w-full">
                    <h2 id="our-values-heading" className="text-4xl sm:text-5xl font-extrabold mb-16 text-white">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {Array.isArray(data.ourValues) && data.ourValues.filter(v => v.valueTitle && v.valueDesc).length > 0 ? (
                            data.ourValues.filter(v => v.valueTitle && v.valueDesc).map((value) => (
                                <div key={value.id} className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 group border border-gray-200">
                                    <h3 className="text-2xl font-bold mb-3 text-[#1e3a24] group-hover:text-emerald-700 transition-colors duration-300">{value.valueTitle}</h3>
                                    <p className="text-base text-gray-700 leading-relaxed">{value.valueDesc}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-gray-300">No values found.</div>
                        )}
                    </div>
                </div>
            </section>
            {/* Why Choose Us Section */}
            <section className="aboutUsSec bg-white min-h-screen flex items-center py-16 sm:py-24" aria-labelledby="why-choose-us-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <h2 id="why-choose-us-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1e3a24] text-center mb-8 sm:mb-12">
                        Why Choose Lusso?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="flex justify-center">
                            {data.whyUsImg && (
                                <img
                                    src={getMediaUrl(data.whyUsImg.formats?.large?.url || data.whyUsImg.url)}
                                    alt="Why Choose Us image"
                                    className="rounded-xl shadow-xl w-full max-w-lg object-cover h-auto"
                                    loading="lazy"
                                />
                            )}
                        </div>
                        <div>
                            <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700">
                                {Array.isArray(data.whyUs) && data.whyUs.filter(w => w.whyUsTitle && w.whyUsDesc).length > 0 ? (
                                    data.whyUs.filter(w => w.whyUsTitle && w.whyUsDesc).map((item) => (
                                        <li key={item.id} className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div>
                                                <h3 className="font-semibold text-lg sm:text-xl text-[#1e3a24] mb-1">{item.whyUsTitle}</h3>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.whyUsDesc}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-300">No reasons found.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="size-50vh beforeFooter bg-[#1e3a24] text-white  flex items-center text-center py-16 sm:py-24" aria-label="Call to action to contact specialists">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <h2 className="beforefooter_text text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
                        {data.CTA_title}
                    </h2>
                    <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90 text-gray">
                        {data.CTA_Desc}
                    </p>
                    <a
                        href="/luxurycars/contact"
                        className="inline-block bg-white text-[#1e3a24] font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        aria-label={data.CTA_buttonTxt}
                    >
                        {data.CTA_buttonTxt}
                    </a>
                </div>
            </section>
            <Footer logoUrl={logoUrl} />
        </div>
    );
};

export default Aboutus;