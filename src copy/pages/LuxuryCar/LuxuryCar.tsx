import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { getLuxuryHero, getCars, getAboutUs, getShowroom, getContact } from '../../services/api';

const NAVBAR_HEIGHT = 96;
const API_BASE = import.meta.env.VITE_API_URL.startsWith('http') ? 'http://api.lussogroupgeo.com' : '';

const LuxuryCar = () => {
  // Hero
  const [hero, setHero] = useState<any>(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [errorHero, setErrorHero] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  // Cars
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errorCars, setErrorCars] = useState<string | null>(null);
  // About Us
  const [about, setAbout] = useState<any>(null);
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [errorAbout, setErrorAbout] = useState<string | null>(null);
  // Showroom
  const [showroom, setShowroom] = useState<any[]>([]);
  const [loadingShowroom, setLoadingShowroom] = useState(true);
  const [errorShowroom, setErrorShowroom] = useState<string | null>(null);
  // Contact
  const [contact, setContact] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(true);
  const [errorContact, setErrorContact] = useState<string | null>(null);

  useEffect(() => {
    getLuxuryHero()
      .then((res) => {
        const data = res.data.data?.[0];
        setHero(data);
        setLoadingHero(false);
      })
      .catch(() => {
        setErrorHero('Failed to load hero section');
        setLoadingHero(false);
      });
    getCars()
      .then((res) => {
        setCars(res.data.data.map((item: any) => item.attributes));
        setLoadingCars(false);
      })
      .catch(() => {
        setErrorCars('Failed to load cars');
        setLoadingCars(false);
      });
    getAboutUs()
      .then((res) => {
        setAbout(res.data.data?.[0]?.attributes);
        setLoadingAbout(false);
      })
      .catch(() => {
        setErrorAbout('Failed to load about us');
        setLoadingAbout(false);
      });
    getShowroom()
      .then((res) => {
        setShowroom(res.data.data.map((item: any) => item.attributes));
        setLoadingShowroom(false);
      })
      .catch(() => {
        setErrorShowroom('Failed to load showroom');
        setLoadingShowroom(false);
      });
    getContact()
      .then((res) => {
        setContact(res.data.data?.[0]?.attributes);
        setLoadingContact(false);
      })
      .catch(() => {
        setErrorContact('Failed to load contact');
        setLoadingContact(false);
      });
  }, []);

  // Video debug logları için ayrı bir useEffect
  useEffect(() => {
    if (hero && hero.videoUrl) {
      console.log('HERO:', hero);
      console.log('VIDEO URL:', hero.videoUrl?.url, getMediaUrl(hero.videoUrl?.url));
    }
  }, [hero]);

  // Ortama göre medya url'si oluştur
  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return 'https://api.lussogroupgeo.com' + url;
    return url;
  };

  return (
    <div className="relative">
      <Navbar />
      <div
        className="overflow-y-auto snap-y snap-mandatory"
        style={{
          height: '100vh',
          paddingTop: `${NAVBAR_HEIGHT}px`,
          scrollPaddingTop: `${NAVBAR_HEIGHT}px`,
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Hero Section */}
        <section
          id="home"
          className="flex items-center justify-center relative bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 h-[calc(100vh-96px)] overflow-hidden"
          style={{ scrollSnapAlign: 'start' }}
        >
          {/* Arka plan video veya görsel */}
          {loadingHero ? null : errorHero ? null : hero && hero.videoUrl ? (
            <>
              {!videoLoaded && (
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/20">
                  <span className="text-heading text-lg animate-pulse">Loading video...</span>
                </div>
              )}
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={hero.videoPoster ? getMediaUrl(hero.videoPoster.url) : undefined}
                className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
                style={{ pointerEvents: 'none', display: videoLoaded ? 'block' : 'none' }}
                onLoadedData={() => setVideoLoaded(true)}
                onError={(e) => { console.error('VIDEO LOAD ERROR:', e, getMediaUrl(hero.videoUrl.url)); }}
              >
                <source src={getMediaUrl(hero.videoUrl.url)} type={hero.videoUrl.mime} />
              </video>
            </>
          ) : (
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1500&q=80"
                alt="Luxury background"
                className="w-full h-full object-cover opacity-40"
              />
            </div>
          )}
          {/* İçerik */}
          <div className="relative z-10 text-center text-heading max-w-2xl mx-auto">
            {loadingHero ? (
              <div className="text-heading text-2xl">Loading...</div>
            ) : errorHero ? (
              <div className="text-red-500 text-xl">{errorHero}</div>
            ) : hero ? (
              <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                  {hero.title ? hero.title : 'Welcome to '}<span className="text-primary">Lu$$o</span>
                </h1>
                <p className="text-2xl md:text-3xl mb-8 drop-shadow">
                  {hero.subtitle ? hero.subtitle : 'Experience the Pinnacle of Luxury'}
                </p>
                {hero.cta && (
                  <button className="bg-primary hover:bg-primary/80 text-heading px-10 py-5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300">
                    {hero.cta}
                  </button>
                )}
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                  Welcome to <span className="text-primary">Lu$$o</span>
                </h1>
                <p className="text-2xl md:text-3xl mb-8 drop-shadow">
                  Experience the Pinnacle of Luxury
                </p>
                <button className="bg-primary hover:bg-primary/80 text-heading px-10 py-5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300">
                  Learn More
                </button>
              </>
            )}
          </div>
        </section>

        {/* Cars Section */}
        <section
          id="cars"
          className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 h-[calc(100vh-96px)]"
          style={{ scrollSnapAlign: 'start' }}
        >
          {loadingCars ? (
            <div className="text-heading text-2xl">Loading...</div>
          ) : errorCars ? (
            <div className="text-red-500 text-xl">{errorCars}</div>
          ) : cars.length > 0 ? (
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {cars.map((car, idx) => (
                <React.Fragment key={idx}>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
                    {car.image && car.image.data && (
                      <img
                        src={getMediaUrl(car.image.data.attributes.url)}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition duration-300" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-heading mb-4">{car.title}</h3>
                    <p className="text-xl text-text mb-8">{car.description}</p>
                    <div className="flex gap-4">
                      {car.button1 && (
                        <button className="bg-primary hover:bg-primary/80 text-heading px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200 shadow">
                          {car.button1}
                        </button>
                      )}
                      {car.button2 && (
                        <button className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200">
                          {car.button2}
                        </button>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </section>

        {/* About Us Section */}
        <section
          id="about"
          className="flex items-center justify-center bg-gradient-to-br from-white via-primary/5 to-white h-[calc(100vh-96px)]"
          style={{ scrollSnapAlign: 'start' }}
        >
          {loadingAbout ? (
            <div className="text-heading text-2xl">Loading...</div>
          ) : errorAbout ? (
            <div className="text-red-500 text-xl">{errorAbout}</div>
          ) : about ? (
            <div className="max-w-3xl mx-auto text-center bg-white/80 rounded-2xl shadow-xl p-12">
              <h2 className="text-4xl font-bold text-heading mb-8">{about.title}</h2>
              <p className="text-lg text-text mb-8">{about.description}</p>
              {about.button && (
                <button className="bg-primary hover:bg-primary/80 text-heading px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 shadow">
                  {about.button}
                </button>
              )}
            </div>
          ) : null}
        </section>

        {/* Showroom Section */}
        <section
          id="showroom"
          className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 h-[calc(100vh-96px)]"
          style={{ scrollSnapAlign: 'start' }}
        >
          {loadingShowroom ? (
            <div className="text-heading text-2xl">Loading...</div>
          ) : errorShowroom ? (
            <div className="text-red-500 text-xl">{errorShowroom}</div>
          ) : showroom.length > 0 ? (
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              {showroom.map((item, idx) => (
                <div key={idx} className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
                  {item.image && item.image.data && (
                    <img
                      src={getMediaUrl(item.image.data.attributes.url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-2xl font-bold text-heading mb-2 text-white">{item.title}</h3>
                      {item.button && (
                        <button className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                          {item.button}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="flex items-center justify-center bg-gradient-to-br from-white via-primary/5 to-white h-[calc(100vh-96px)]"
          style={{ scrollSnapAlign: 'start' }}
        >
          {loadingContact ? (
            <div className="text-heading text-2xl">Loading...</div>
          ) : errorContact ? (
            <div className="text-red-500 text-xl">{errorContact}</div>
          ) : contact ? (
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                <div>
                  <h3 className="text-xl font-bold text-heading mb-4">Find us</h3>
                  <p className="text-text">{contact.address}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-heading mb-4">Call us</h3>
                  <p className="text-text">{contact.phone}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-heading mb-4">Mail us</h3>
                  <p className="text-text">{contact.email}</p>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default LuxuryCar;
