import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

// Media interfaces (kept for potential future use if strapiapp.com provides media)
interface MediaAttributes {
  url: string;
}
interface MediaDataItem {
  id: number;
  attributes: MediaAttributes;
}
interface SingleMediaData {
  data: MediaDataItem | null;
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


const ContactPage = () => {
  const [contactData, setContactData] = useState<ContactUsPageAttributes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Access the base Strapi API URL from environment variables
  const STRAPI_BASE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // --- Validate the base API URL ---
        if (!STRAPI_BASE_API_URL) {
            throw new Error("VITE_API_URL is not defined in environment variables. Please check your .env file.");
        }

        // --- Construct the full API endpoint for contact data ---
        // CORRECTED: Added '/api' to the path
        const contactApiUrl = `${STRAPI_BASE_API_URL}/api/luxurycars-contactus`;
        console.log("Fetching Contact Data from:", contactApiUrl);

        const contactResponse = await fetch(contactApiUrl);

        if (!contactResponse.ok) {
          throw new Error(
            `HTTP error fetching contact data! Status: ${contactResponse.status} from ${contactApiUrl}`
          );
        }
        const contactJson: ContactUsApiResponse = await contactResponse.json();
        console.log("Contact Data Raw Response:", contactJson);

        if (contactJson?.data) {
          setContactData(contactJson.data);
          console.log("Contact Data Set:", contactJson.data);
        } else {
          console.warn("API returned no data for Contact Us Page.");
        }

      } catch (err: any) {
        setError(`Failed to load content: ${err.message}`);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Re-run effect if STRAPI_BASE_API_URL changes (unlikely in practice, but good for dependency array)
  }, [STRAPI_BASE_API_URL]);

  // For the logo, if you're not fetching it dynamically, you'll still need a static URL.
  // If your logo is also served by the same strapiapp.com instance and its URL is predictable,
  // you could construct it here, but it's not present in your current contact-us endpoint.
  // For now, retaining a placeholder/empty string.
  const logoUrl = ""; // Or provide a default static public URL for your logo, e.g., "https://your-domain.com/images/logo.png"

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-[#013220]">
        Loading contact information...
      </div>
    );
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
      <Navbar largeLogoSrc={logoUrl} smallLogoSrc={logoUrl} />

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
              <a href="#" className="text-[#013220] hover:scale-110 transition">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-[#013220] hover:scale-110 transition">
                <i className="fab fa-instagram fa-lg"></i>
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