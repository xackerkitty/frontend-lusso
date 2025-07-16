import React from "react";

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
    
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

export default LoadingScreen;
