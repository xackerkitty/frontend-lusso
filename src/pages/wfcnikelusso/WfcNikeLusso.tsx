import React, { useEffect, useState } from 'react';
import EnhancedHero from './components/EnhancedHero';
import NewsContentSection from './components/NewsContentSection';
import FixturesSection from './components/FixturesSection';
import MediaTabsSection from './components/MediaTabsSection';
import TeamHighlightsSection from './components/TeamHighlightsSection';

const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sponsors?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Sponsorlar alınamadı');
        return res.json();
      })
      .then((result) => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || {};
          return attrs.name || '';
        });
        setSponsors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Sponsorlar yükleniyor...</div>;
  if (error) return <div>Sponsorlar alınamadı: {error}</div>;

  return (
    <div className="py-10 sm:py-12 md:py-16 bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-8 sm:mb-12 text-center">Ana Sponsorlarımız</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <div 
              key={index} 
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-primary/15 rounded-lg flex items-center justify-center hover:bg-primary/25 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
              aria-label={`${sponsor} sponsoru`}
            >
              <span className="text-primary font-semibold text-center px-2 text-sm sm:text-base">{sponsor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Ana Bileşen - Mobil duyarlı
const WfcNikeLusso: React.FC = () => {
  return (
    <>
      {/* Hero/Slider tam ekran ve container dışı */}
      <EnhancedHero />
      {/* Galeri grid'i hero'nun hemen altında */}
      {/* <Gallery /> */}
      {/* Diğer içerikler container içinde */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsContentSection />
        <FixturesSection />
        <MediaTabsSection />
        <TeamHighlightsSection />
        <Sponsors />
      </div>
    </>
  );
};

export default WfcNikeLusso;
