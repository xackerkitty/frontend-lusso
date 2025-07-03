// src/components/Footer.tsx
import React from 'react';

interface FooterProps {
  /**
   * The URL for the company logo displayed in the footer.
   */
  logoUrl: string;
  /**
   * Optional CSS classes to apply to the top-level footer element.
   */
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ logoUrl, className }) => {
  return (
    <footer className={`footer bg-[#1a362f] text-gray-300 py-8 ${className || ''}`}>
      <div className="container mx-auto px-4">
        {/* Top Section: Contact Info */}
        <div className="flex flex-wrap justify-between items-start text-sm pb-8 mb-8 border-b border-gray-600">
          {/* Find us */}
          <div className="w-full md:w-1/3 p-4 flex items-start space-x-3"> {/* Removed rounded-lg here as it might be applied to inner elements */}
            {/* Ensure Font Awesome is linked in your public/index.html or imported */}
            <i className="fas fa-map-marker-alt text-2xl text-teal-400"></i>
            <div>
              <h4 className="font-semibold text-lg text-white mb-1">
                Find us
              </h4>
              <p>274 Agmashenebeli Alley, Tbilisi 0159, Georgia.</p>
            </div>
          </div>
          {/* Call us */}
          <div className="w-full md:w-1/3 p-4 flex items-start space-x-3 mt-4 md:mt-0">
            <i className="fas fa-phone-alt text-2xl text-teal-400"></i>
            <div>
              <h4 className="font-semibold text-lg text-white mb-1">
                Call us
              </h4>
              <p>+995 555188888</p>
            </div>
          </div>
          {/* Mail us */}
          <div className="w-full md:w-1/3 p-4 flex items-start space-x-3 mt-4 md:mt-0">
            <i className="fas fa-envelope text-2xl text-teal-400"></i>
            <div>
              <h4 className="font-semibold text-lg text-white mb-1">
                Mail us
              </h4>
              <p>info@lussoluxurycar.com</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Company Info, Useful Links, Open Hours */}
        <div className="flex flex-wrap justify-between items-start text-sm pb-8 mb-8 border-b border-gray-600">
          {/* Company Logo & Description */}
          <div className="w-full lg:w-2/5 p-4">
            <div className="flex items-center mb-4">
              <img
                src={logoUrl} // Using the prop directly
                alt="Lusso Logo"
                className="h-10 w-auto mr-2 rounded-lg"
              />
            </div>
            <p className="mb-4 leading-relaxed">
              At Lusso, we redefine luxury with exceptional craftsmanship,
              innovative technology, and timeless design. Our curated
              high-performance vehicles and personalized service ensure
              every journey is extraordinary.
            </p>
            <h5 className="font-semibold text-lg text-white mb-3">
              Follow us
            </h5>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition duration-300"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition duration-300"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 transition duration-300"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 mt-8 lg:mt-0">
            <h5 className="font-semibold text-lg text-white mb-3">
              Useful links
            </h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="/luxurycars"
                  className="hover:text-white transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/luxurycars/aboutus"
                  className="hover:text-white transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/luxurycars/cars"
                  className="hover:text-white transition duration-300"
                >
                  Cars
                </a>
              </li>
            </ul>
          </div>

          {/* Our Open hours */}
          <div className="w-full md:w-1/2 lg:w-1/4 p-4 mt-8 lg:mt-0">
            <h5 className="font-semibold text-lg text-white mb-3">
              Our Open hours
            </h5>
            <p className="text-gray-400 text-xs">
              Absent index miss out on our lately news, make sure to
              follow us. {/* Consider replacing this with actual open hours. */}
            </p>
            {/* You can add actual open hours here, perhaps passed as props too */}
          </div>
        </div>

        {/* Bottom Section: Copyright and Bottom Links */}
        {/* KEY FIX: Removed -mb-8 and -mx-4 */}
        <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 bg-[#142a24] rounded-lg py-4 px-6">
          <div className="w-full md:w-auto text-center md:text-left mb-2 md:mb-0">
            Copyright &copy; {new Date().getFullYear()}, All Right Reserved{" "} {/* Use current year dynamically */}
            <span className="text-teal-400">Lusso</span>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4">
            <a
              href="/luxurycars"
              className="hover:text-white transition duration-300"
            >
              Home
            </a>
            <a
              href="/luxurycars/contact"
              className="hover:text-white transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;