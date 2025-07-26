import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// --- Interface for Contact Us Page Data ---
// This interface directly maps to the fields inside the 'data' object of your provided JSON response.
interface ContactUsPageAttributes {
  id: number;
  documentId: string;
  contactUsTitle: string | null;
  contactUsDesc: string | null;
  addressTitle: string | null;
  AddressDesc: string | null; // Retain capitalization as in your JSON response
  phoneTitle: string | null;
  phoneDesc: string | null;
  emailTitle: string | null;
  emailDesc: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Define the full response structure for that specific contact endpoint
interface ContactUsApiResponse {
  data: ContactUsPageAttributes | null;
  meta: {};
}

interface MediaAttributes {
  url: string;
}
interface MediaDataItem {
  id: number;
  attributes: MediaAttributes;
}

// This getMediaUrl will be primarily for *future* use if you fetch media from strapiapp.com
// It will now use the base API URL to construct image URLs if they are relative.
const getMediaUrl = (
  mediaDataContent:
    | MediaDataItem
    | string
    | null
    | undefined
): string => {
  let url: string | undefined;

  if (typeof mediaDataContent === "string") {
    url = mediaDataContent;
  } else if (mediaDataContent && mediaDataContent.attributes?.url) {
    url = mediaDataContent.attributes.url;
  } else {
    console.warn("getMediaUrl: No valid mediaDataContent provided.");
    return "";
  }

  // Use the VITE_STRAPI_API_URL base for constructing full image URLs
  // This assumes your base URL for images is the same as your API base,
  // or that your images always return absolute URLs from strapiapp.com.
  const STRAPI_BASE_URL = import.meta.env.VITE_API_URL; // Using VITE_API_URL for consistency
  if (!STRAPI_BASE_URL) {
      console.error("VITE_API_URL is not defined.");
      return "";
  }

  // Remove the '/api' part from the base URL if it's meant for assets
  const ASSET_BASE_URL = STRAPI_BASE_URL.endsWith('/api') ? STRAPI_BASE_URL.slice(0, -4) : STRAPI_BASE_URL;

  // If the URL from Strapi is already absolute, use it. Otherwise, prepend the asset base URL.
  return url.startsWith('http://') || url.startsWith('https://') ? url : `${ASSET_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// --- Simple in-memory cache for SPA navigation ---
let cachedContactData: ContactUsPageAttributes | null = null;
let cachedLogoData: any | null = null;

const ContactPage = () => {
  // Use cached data if available
  const [contactData, setContactData] = useState<ContactUsPageAttributes | null>(cachedContactData);
  const [loading, setLoading] = useState<boolean>(!cachedContactData);
  const [error, setError] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<any | null>(cachedLogoData);

  // Access the base Strapi API URL from environment variables
  const STRAPI_BASE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (cachedContactData) {
      setContactData(cachedContactData);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!STRAPI_BASE_API_URL) {
          throw new Error("VITE_API_URL is not defined in environment variables. Please check your .env file.");
        }
        const contactApiUrl = `${STRAPI_BASE_API_URL}/api/luxurycars-contactus`;
        const contactResponse = await fetch(contactApiUrl);
        if (!contactResponse.ok) {
          throw new Error(`HTTP error fetching contact data! Status: ${contactResponse.status} from ${contactApiUrl}`);
        }
        const contactJson: ContactUsApiResponse = await contactResponse.json();
        if (contactJson?.data) {
          setContactData(contactJson.data);
          cachedContactData = contactJson.data;
        } else {
          console.warn("API returned no data for Contact Us Page.");
        }
      } catch (err: any) {
        setError(`Failed to load content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [STRAPI_BASE_API_URL]);

  // Fetch logo in a separate useEffect (like aboutUs.tsx)
  useEffect(() => {
    if (cachedLogoData) {
      setLogoData(cachedLogoData);
      return;
    }
    const fetchLogo = async () => {
      try {
        const STRAPI_BASE_URL = import.meta.env.VITE_API_URL;
        const luxuryCarApiUrl = `${STRAPI_BASE_URL}/api/luxurycar?populate=*`;
        const luxuryCarResponse = await fetch(luxuryCarApiUrl);
        if (!luxuryCarResponse.ok) throw new Error('Failed to fetch logo');
        const luxuryCarJson = await luxuryCarResponse.json();
        setLogoData(luxuryCarJson?.data || null);
        cachedLogoData = luxuryCarJson?.data || null;
      } catch (e) {
        setLogoData(null);
      }
    };
    fetchLogo();
  }, []);

  // Robust logo URL extraction (check formats and fallback to url)
  let logoUrl = "";
  if (logoData?.logo) {
    const logo = logoData.logo;
    if (logo.formats?.large?.url) logoUrl = getMediaUrl(logo.formats.large.url);
    else if (logo.formats?.medium?.url) logoUrl = getMediaUrl(logo.formats.medium.url);
    else if (logo.formats?.small?.url) logoUrl = getMediaUrl(logo.formats.small.url);
    else if (logo.formats?.thumbnail?.url) logoUrl = getMediaUrl(logo.formats.thumbnail.url);
    else if (logo.url) logoUrl = getMediaUrl(logo.url);
  }


  if (loading) {
    return <LoadingScreen isVisible={true} />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#013220] font-sans overflow-hidden">
      <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} alwaysShowBackground={true} />

      <div
        className="max-w-6xl mx-auto px-6 py-20"
        style={{ marginTop: "55px" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#013220]"
        >
          {contactData?.contactUsTitle || "Contact Lusso Luxury Cars"}
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form (static) */}
          <motion.form
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 bg-[#f8f8f8] p-6 rounded-xl shadow-xl hover:shadow-2xl transition"
          >
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013220]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013220]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea
                rows={5}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013220]"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-[#013220] text-white py-3 rounded-lg hover:bg-green-900 transition"
            >
              Send Message
            </motion.button>
          </motion.form>

          {/* Contact Info (Populated by Strapiapp.com Data) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">
                {contactData?.contactUsTitle || "Get in Touch"}
            </h2>
            <p className="text-gray-700">
                {contactData?.contactUsDesc || "Whether you're exploring our exclusive models or need help with a purchase, our dedicated support team is ready to assist you."}
            </p>

            <div>
              <h3 className="text-lg font-medium">{contactData?.addressTitle || "Address"}</h3>
              <p className="text-gray-700">
                {contactData?.AddressDesc || "274 Agmashenebeli Alley, Tbilisi 0159, Georgia."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">{contactData?.phoneTitle || "Phone"}</h3>
              <p className="text-gray-700">{contactData?.phoneDesc || "+995 555188888"}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">{contactData?.emailTitle || "Email"}</h3>
              <p className="text-gray-700">{contactData?.emailDesc || "info@lussoluxurycar.com"}</p>
            </div>

            <div className="flex gap-4 mt-6">
              <a
                href="https://www.tiktok.com/@lusso.georgia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:scale-110 transition duration-300"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} className="text-xl" />
              </a>
              <a
                href="https://www.instagram.com/lusso_georgia/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:scale-110 transition duration-300"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a
                href="https://wa.me/995555188888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:scale-110 transition duration-300"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer logoUrl={logoUrl} />
    </div>
  );
};

export default ContactPage;