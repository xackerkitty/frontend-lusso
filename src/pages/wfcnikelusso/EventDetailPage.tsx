import React, { useState, useEffect } from 'react';
import LussoNavbar from '../../components/LussoNavbar';
import { useParams } from 'react-router-dom';

// Etkinlik tipi tanımlaması
interface EventType {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  isUpcoming: boolean;
  organizer?: string;
}

const EventDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Etkinlik verisini API'den çek
  useEffect(() => {
    setLoading(true);
    fetch(`/api/fixtures?populate=*`)
      .then((res) => res.json())
      .then((result) => {
        const allEvents = result.data || [];
        const found = allEvents.find((item: any) => item.documentId === documentId);
        if (!found) {
          setEvent(null);
          setLoading(false);
          return;
        }
        const attrs = found.attributes || found;
        let imageUrl = '';
        if (attrs.image && attrs.image.url) {
          imageUrl = attrs.image.url.startsWith('http') ? attrs.image.url : 'https://api.lussogroupgeo.com' + attrs.image.url;
        }
        setEvent({
          _id: found.id,
          title: attrs.title || '',
          date: attrs.date || '',
          time: attrs.time || '',
          location: attrs.location || '',
          category: attrs.category || '',
          description: attrs.description || '',
          image: imageUrl,
          isUpcoming: attrs.isUpcoming || false,
          organizer: attrs.organizer || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setEvent(null);
        setLoading(false);
      });
  }, [documentId]);

  // Katılma işlemi simülasyonu
  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <>
      <LussoNavbar />
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-text">
      
      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // İskelet yükleyici
            <div className="animate-pulse">
              <div className="h-10 bg-primary/10 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-primary/10 rounded w-1/2 mb-8"></div>
              <div className="h-80 bg-primary/10 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-primary/10 rounded w-full"></div>
                <div className="h-4 bg-primary/10 rounded w-full"></div>
                <div className="h-4 bg-primary/10 rounded w-4/5"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Ana içerik */}
              <div className="lg:w-2/3">
                {event && (
                  <article className="bg-primary/10 rounded-xl overflow-hidden shadow-lg">
                    {/* Banner görseli */}
                    <div className="relative w-full h-80 overflow-hidden">
                      <img 
                        src={event.image || '/uploads/placeholder.jpg'} 
                        alt={event.title} 
                        className="w-full h-full object-cover" 
                        onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} 
                      />
                      {event.isUpcoming && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-medium">
                          Yaklaşan Etkinlik
                        </div>
                      )}
                    </div>
                    
                    {/* Etkinlik içeriği */}
                    <div className="p-8">
                      <h1 className="text-4xl font-bold text-heading mb-4">{event.title}</h1>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.date}</span>
                        </div>
                        <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                        <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{event.category}</span>
                        </div>
                      </div>
                      
                      <div className="prose prose-lg max-w-none text-text mb-8">
                        <p>{event.description}</p>
                      </div>
                      
                      {/* Katılım butonları */}
                      {event.isUpcoming && (
                        <div className="mt-8">
                          {isRegistered ? (
                            <div className="bg-primary/10 p-6 rounded-lg text-center">
                              <div className="text-primary text-2xl mb-2">✓</div>
                              <h3 className="font-bold text-heading mb-2">Kaydınız Alındı</h3>
                              <p className="text-text">Etkinliğe katılımınız onaylanmıştır. Etkinlik günü hatırlatma e-postası alacaksınız.</p>
                            </div>
                          ) : (
                            <button
                              onClick={handleRegister}
                              className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-lg transition-colors duration-300 font-bold text-lg flex items-center justify-center"
                            >
                              Etkinliğe Katıl
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                )}
              </div>
              
              {/* Sağ yan bar */}
              <div className="lg:w-1/3">
                {/* Organizatör bilgileri */}
                {event?.organizer && (
                  <div className="bg-primary/10 rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 border-b border-primary/10">
                      <h2 className="text-xl font-bold text-heading">Organizatör</h2>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="bg-primary/20 p-3 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-heading">{event.organizer}</p>
                          <p className="text-sm text-text/70">Resmi Organizatör</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Paylaş bölümü */}
                <div className="bg-primary/10 rounded-xl shadow-lg overflow-hidden mb-8">
                  <div className="p-6 border-b border-primary/10">
                    <h2 className="text-xl font-bold text-heading">Paylaş</h2>
                  </div>
                  <div className="p-6 grid grid-cols-4 gap-4">
                    <button className="bg-[#3b5998] text-white h-12 w-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button className="bg-[#1DA1F2] text-white h-12 w-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button className="bg-[#25d366] text-white h-12 w-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                      <i className="fab fa-whatsapp"></i>
                    </button>
                    <button className="bg-[#0e76a8] text-white h-12 w-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                      <i className="fab fa-linkedin-in"></i>
                    </button>
                  </div>
                </div>
                
                {/* Hatırlatma bölümü */}
                <div className="bg-primary/10 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-heading mb-4">Hatırlatıcı Ekle</h2>
                  <p className="text-text mb-5">Etkinlik tarihi yaklaştığında hatırlatma almak ister misiniz?</p>
                  <button className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors font-medium mb-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Takvime Ekle
                  </button>
                  <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-lg transition-colors font-medium flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    E-posta Hatırlatıcısı
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetailPage;
