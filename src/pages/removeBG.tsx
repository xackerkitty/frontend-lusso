import { useState, useRef, useEffect } from 'react';
// Import the background removal library - Try different import syntax
import { removeBackground } from '@imgly/background-removal';
import { motion } from "framer-motion";

// Main App component
const RemoveBGApp = () => {
  // State to hold the selected file object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to hold the URL of the uploaded image for display
  const [imageSrc, setImageSrc] = useState<string>('');
  // State to hold the URL of the processed image (with shadow) for download
  const [processedImageSrc, setProcessedImageSrc] = useState<string>('');
  // State to manage loading indicator during background removal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Shadow properties (can be made configurable with state if desired)
  const shadowConfig = {
    blur: 20,
    color: 'rgba(0, 0, 0, 0.5)', // Black with 50% opacity
    offsetX: 10,
    offsetY: 10,
  };

  // Ground shadow properties for realistic floor shadow
  const groundShadowConfig = {
    blur: 15,
    color: 'rgba(0, 0, 0, 0.5)', // Darker shadow for ground - increased from 0.3 to 0.5
    scaleX: 1.2, // Make shadow wider than the object - increased from 0.8 to 1.2
    scaleY: 0.3, // Make shadow much shorter (flattened)
    offsetY: -5, // Distance below the object - moved to overlap slightly with car bottom
  };

  /**
   * Handles the file input change event.
   * Reads the selected file and sets its URL to imageSrc.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // Set original image source
        setProcessedImageSrc(''); // Clear previous processed image
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImageSrc('');
      setProcessedImageSrc('');
      console.error("Please upload a valid image file.");
    }
  };

  /**
   * Processes the image: removes background using client-side library and then draws with shadow.
   * This effect runs whenever imageSrc changes.
   */
  useEffect(() => {
    const processImage = async () => {
      if (!imageSrc) {
        setProcessedImageSrc('');
        return;
      }

      console.log("Starting image processing...");
      setIsLoading(true); // Start loading indicator

      try {
        // Step 1: Remove background using the client-side library
        // The removeBackground function from @imgly/background-removal expects a Blob, URL, or ImageData.
        // We'll convert the Data URL to a Blob for this.
        console.log("Converting image to blob...");
        const response = await fetch(imageSrc);
        const imageBlob = await response.blob();
        console.log("Image blob created, size:", imageBlob.size);

        // Call the actual background removal function
        console.log("Calling removeBackground function...");
        console.log("Available methods:", typeof removeBackground);
        const transparentImageBlob = await removeBackground(imageBlob); // This is where the magic happens
        console.log("Background removal completed, creating URL...");

        // Create a URL for the transparent image blob
        const transparentImageSrcUrl = URL.createObjectURL(transparentImageBlob);

        const canvas = canvasRef.current;
        if (!canvas) {
          console.error("Canvas reference is null");
          setIsLoading(false);
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error("Could not get 2d context from canvas");
          setIsLoading(false);
          return;
        }
        
        console.log("Creating image element and loading...");
        const img = new Image();
        img.src = transparentImageSrcUrl; // Use the transparent image URL

        img.onload = () => {
          console.log("Image loaded successfully, dimensions:", img.width, "x", img.height);
          
          // First, draw the image to a temporary canvas to analyze the car bounds
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          tempCtx!.drawImage(img, 0, 0);
          
          // Get image data to find the actual car bounds
          const imageData = tempCtx!.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          
          // Find the bounding box of non-transparent pixels (the car)
          let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
          let hasContent = false;
          
          for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
              const alpha = data[(y * img.width + x) * 4 + 3]; // Alpha channel
              if (alpha > 0) { // Non-transparent pixel
                hasContent = true;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
              }
            }
          }
          
          // If no content found, fall back to full image
          if (!hasContent) {
            minX = 0; maxX = img.width; minY = 0; maxY = img.height;
          }
          
          const carWidth = maxX - minX;
          const carHeight = maxY - minY;
          const carCenterX = minX + carWidth / 2;
          const carBottomY = maxY;
          
          console.log("Car bounds detected:", { minX, maxX, minY, maxY, carWidth, carHeight, carCenterX, carBottomY });
          
          // Calculate canvas dimensions with shadow padding and ground shadow space
          const canvasWidth = img.width + shadowConfig.blur * 2 + Math.abs(shadowConfig.offsetX) * 2;
          const canvasHeight = img.height + shadowConfig.blur * 2 + Math.abs(shadowConfig.offsetY) * 2 + 30;
          
          // Set canvas dimensions
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          console.log("Canvas dimensions set to:", canvasWidth, "x", canvasHeight);

          // Clear the canvas to ensure a fresh drawing with transparent background
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate positioning
          const drawX = shadowConfig.blur + Math.max(0, -shadowConfig.offsetX);
          const drawY = shadowConfig.blur + Math.max(0, -shadowConfig.offsetY);

          // Step 1: Draw the ground shadow first (behind the object)
          ctx.save(); // Save the current context state
          
          // Position for ground shadow (directly under the car)
          const groundShadowCenterX = drawX + carCenterX;
          const groundShadowY = drawY + carBottomY + groundShadowConfig.offsetY;
          const shadowWidth = carWidth * groundShadowConfig.scaleX;
          const shadowHeight = carHeight * groundShadowConfig.scaleY;
          
          // Create an elliptical shadow positioned under the actual car
          ctx.translate(groundShadowCenterX, groundShadowY);
          ctx.scale(1, 1);
          
          // Draw elliptical shadow
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, shadowWidth / 2);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)'); // Darker center
          gradient.addColorStop(0.4, groundShadowConfig.color); // Mid tone
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent edge
          
          ctx.fillStyle = gradient;
          ctx.filter = `blur(${groundShadowConfig.blur}px)`;
          
          // Draw oval shadow
          ctx.beginPath();
          ctx.ellipse(0, 0, shadowWidth / 2, shadowHeight / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.restore(); // Restore the context state

          // Step 2: Draw the main object with drop shadow
          ctx.shadowBlur = shadowConfig.blur;
          ctx.shadowColor = shadowConfig.color;
          ctx.shadowOffsetX = shadowConfig.offsetX;
          ctx.shadowOffsetY = shadowConfig.offsetY;
          
          console.log("Drawing image at position:", drawX, "x", drawY);
          ctx.drawImage(img, drawX, drawY, img.width, img.height);

          // Reset shadow properties to avoid affecting subsequent drawings
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.filter = 'none';

          // Get the processed image as a Data URL for download
          // Use 'image/png' for transparency support
          console.log("Canvas processing complete, generating download URL...");
          setProcessedImageSrc(canvas.toDataURL('image/png'));
          setIsLoading(false); // End loading indicator
          console.log("Processing complete!");

          // Clean up the object URL to free up memory
          URL.revokeObjectURL(transparentImageSrcUrl);
        };

        img.onerror = (error) => {
          console.error("Failed to load image after background removal:", error);
          setProcessedImageSrc('');
          setIsLoading(false); // End loading indicator
          URL.revokeObjectURL(transparentImageSrcUrl); // Clean up on error too
        };
      } catch (error) {
        console.error("Error during image processing:", error);
        setProcessedImageSrc('');
        setIsLoading(false); // End loading indicator
      }
    };

    processImage();
  }, [imageSrc]); // Dependency array: re-run effect when imageSrc changes

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/car/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      {/* Diagonal green accent stripes */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-primary to-transparent z-20" />
      <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-green-primary to-transparent z-20" />
      
      {/* Side accent panels */}
      <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-green-primary z-20" />
      <div className="absolute right-0 top-1/4 w-1 h-1/2 bg-green-primary z-20" />
      
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-green-primary"></div>
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #81C784, #4CAF50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: "'Ferrari Sans', sans-serif",
                textTransform: 'uppercase'
              }}
            >
              REMOVE
            </h1>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-wide text-white ml-16"
              style={{
                fontFamily: "'Ferrari Sans', sans-serif",
                textTransform: 'uppercase'
              }}
            >
              BACKGROUND
            </h1>
            <div className="w-12 h-1 bg-green-primary"></div>
          </div>
          {/* <p className="text-xl text-gray-300 ml-20 max-w-2xl" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
            Professional AI-powered background removal with intelligent shadow placement
          </p> */}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column - Upload & Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Upload Area */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-full h-full border-2 border-green-primary/30 rounded-lg"></div>
              <div className="relative bg-black/80 backdrop-blur-sm border border-green-primary/50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-green-primary rounded-full"></div>
                  <h3 className="text-xl font-semibold uppercase tracking-wide" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                    Upload Image
                  </h3>
                </div>
                
                <label
                  htmlFor="file-upload"
                  className="group relative block w-full h-32 border-2 border-dashed border-green-primary/40 rounded-lg cursor-pointer transition-all duration-300 hover:border-green-primary/70 hover:bg-green-primary/5"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <svg className="w-8 h-8 text-green-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-green-200 font-medium" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                      Drop your image here or click to browse
                    </span>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Status Panel */}
            {(isLoading || processedImageSrc) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="absolute -top-2 -right-2 w-full h-full border-2 border-green-primary/30 rounded-lg"></div>
                <div className="relative bg-black/80 backdrop-blur-sm border border-green-primary/50 rounded-lg p-6">
                  {isLoading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-2 border-green-primary border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <h4 className="font-semibold text-green-200" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>Processing...</h4>
                        <p className="text-sm text-gray-400">AI model working its magic</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-primary rounded-full animate-pulse"></div>
                        <span className="text-green-200 font-semibold" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>Ready for download</span>
                      </div>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={processedImageSrc}
                        download="lusso-bg-removed.png"
                        className="px-6 py-2 bg-green-primary/20 border border-green-primary/50 rounded-full text-sm font-medium hover:bg-green-primary/30 transition-all duration-300"
                        style={{ fontFamily: "'Ferrari Sans', sans-serif" }}
                      >
                        DOWNLOAD
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            {imageSrc ? (
              <>
                {/* Before/After Comparison */}
                <div className="relative">
                  <div className="absolute -top-3 -right-3 w-full h-full border-2 border-green-primary/20 rounded-xl"></div>
                  <div className="relative bg-black/80 backdrop-blur-sm border border-green-primary/40 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-primary rounded-full"></div>
                          <h3 className="text-xl font-semibold uppercase tracking-wide" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                            Preview
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-primary rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gray-500"></div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                              Original
                            </span>
                          </div>
                          <div className="aspect-square bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300">
                            <img
                              src={imageSrc}
                              alt="Original"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        
                        {/* Processed */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-green-primary"></div>
                            <span className="text-sm font-medium text-green-200 uppercase tracking-widest" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                              Enhanced
                            </span>
                          </div>
                          <div className="aspect-square bg-gray-900/50 rounded-lg border border-green-primary/30 overflow-hidden group hover:border-green-primary/50 transition-all duration-300 relative">
                            <canvas 
                              ref={canvasRef} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            {isLoading && (
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="relative">
                                    <div className="w-12 h-12 border-4 border-green-primary/30 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-green-primary rounded-full animate-spin"></div>
                                  </div>
                                  <span className="text-sm text-green-200" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                                    AI Processing...
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Placeholder */
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-full h-full border-2 border-gray-600/20 rounded-xl"></div>
                <div className="relative bg-black/60 backdrop-blur-sm border border-gray-600/40 rounded-xl p-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-400 mb-2" style={{ fontFamily: "'Ferrari Sans', sans-serif" }}>
                        Preview Area
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upload an image to see the magic happen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBGApp;
