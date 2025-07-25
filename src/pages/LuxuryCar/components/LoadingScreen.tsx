import React from "react";

interface LoadingScreenProps {
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => (
  <div 
    className={`flex flex-col items-center justify-center h-screen text-white p-4 transition-opacity duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`} 
    style={{backgroundColor: 'rgb(26, 54, 47)'}}
  >
    <style>{`
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .flicker {
        animation: flicker 2.5s ease-in-out infinite;
      }
    `}</style>
    
    <img 
      src="/assets/logov2.png" 
      alt="Lusso Logo" 
      className="flicker w-40 h-40 object-contain"
    />
  </div>
);

export default LoadingScreen;
