import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface SlideType {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgImage: string;
  bgOverlay: string;
  image: string;
}

const EnhancedHero: React.FC = () => {
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sliders?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Slider verileri alınamadı');
        return res.json();
      })
      .then((result) => {
        const data = (result.data || []).map((item: any) => {
          console.log('Slider item:', item);
          let imageUrl = '';
          const baseUrl = 'https://api.lussogroupgeo.com';
          if (item.image && item.image.url) {
            imageUrl = item.image.url.startsWith('http') ? item.image.url : baseUrl + item.image.url;
          }
          console.log('Slider görseli:', imageUrl);
          return {
            id: item.id,
            image: imageUrl,
            title: item.title,
            description: item.description,
            link: item.link,
          };
        });
        setSlides(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (loading) return <div>Slider yükleniyor...</div>;
  if (error) return <div>Slider alınamadı: {error}</div>;
  if (slides.length === 0) return <div>Slider verisi bulunamadı.</div>;

  return (
    <div className="w-screen h-[420px] md:h-[520px] lg:h-[600px] relative overflow-hidden flex flex-col justify-center items-center p-0 m-0">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Text Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgOverlay} to-transparent`} />
          
          {/* WFC Background Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-primary text-9xl font-bold opacity-10">WFC</div>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="bg-black/60 py-8 px-6 rounded-b-xl w-full max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                style={{ transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)', opacity: index === currentSlide ? 1 : 0 }}>
                {slide.title}
              </h1>
              <p className="text-xl text-white"
                style={{ transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)', opacity: index === currentSlide ? 1 : 0 }}>
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
        onClick={prevSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
        onClick={nextSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedHero;
