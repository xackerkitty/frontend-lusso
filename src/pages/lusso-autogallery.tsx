import React from 'react';

// Main App component
const App = () => {
  const imageUrl = "./public/images/car/main.jpg"; // Placeholder image for demonstration

  const handleGoToPage = () => {
    alert('Navigating to another page! (This is a placeholder action)');
    // In a real application, you would use React Router or similar for navigation:
    // history.push('/another-page');
  };

  return (
    // Overall page background is a dark green
    <div className="min-h-screen bg-[#0A260A] text-gray-100 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-10 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Changed site name to 'BLU Holding' */}
          <div className="text-2xl font-bold text-white rounded-md">BLU <span className="text-green-400">Holding</span></div>
          <div className="flex space-x-6">
            <a href="#" className="text-white hover:text-green-400 transition duration-300 rounded-md">HOME</a>
            <a href="#" className="text-white hover:text-green-400 transition duration-300 rounded-md">ABOUT US</a>
            <a href="#" className="text-white hover:text-green-400 transition duration-300 rounded-md">PROJECTS</a>
            <a href="#" className="text-white hover:text-green-400 transition duration-300 rounded-md">CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <main className="flex flex-col md:flex-row min-h-screen md:min-h-[120vh] pt-16"> {/* pt-16 to offset fixed navbar */}
        {/* Left Half - Text Content with dark green background */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#0A260A] bg-opacity-90 rounded-md">
          <div className="max-w-xl text-left">
            <h1 className="text-5xl font-bold mb-6 text-white rounded-md">Exquisite Automobiles</h1>
            <p className="text-lg leading-relaxed mb-8 text-gray-300 rounded-md">
              BLU Holding proudly presents a curated collection of the world's most luxurious and high-performance automobiles. We specialize in bringing discerning clients an unparalleled selection of bespoke vehicles, combining cutting-edge engineering with timeless design. Experience automotive excellence redefined with BLU Holding.
            </p>

            {/* Added "Go to Page" button */}
            <button
              onClick={handleGoToPage}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-8"
            >
              Discover Our Website
            </button>


            <h2 className="text-3xl font-semibold mb-4 text-white rounded-md">Contact</h2>
            <div className="space-y-3 text-gray-300">
              {/* Updated contact information */}
              <p className="flex items-center rounded-md">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                274 Agmashenebeli Alley, Tbilisi, 0159, Georgia.
              </p>
              <p className="flex items-center rounded-md">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +995 555 188888
              </p>
              <p className="flex items-center rounded-md">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@lussoluxurycar.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Half - Image, takes up more space by reducing padding */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-800 rounded-md">
          <img
            src={imageUrl}
            alt="Luxury Car Brand"
            className="w-full h-full object-cover rounded-lg shadow-lg"
            // Fallback for image loading errors
            onError={(e) => {
              // Cast e.target to HTMLImageElement to access its properties safely
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = "https://placehold.co/800x600/6b7280/ffffff?text=Image+Not+Found";
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
