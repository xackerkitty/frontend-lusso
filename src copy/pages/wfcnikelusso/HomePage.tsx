import React, { useEffect, useState } from 'react';
import NewsContentSection from './components/NewsContentSection';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20/70 to-transparent z-10"></div>
      <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-primary text-9xl font-bold opacity-10">LUSSO</div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-heading mb-4">
              Nike Koleksiyonu
            </h1>
            <p className="text-xl text-text mb-8">
              En yeni Nike ürünlerini keşfet ve tarzını yansıt.
            </p>
            <button className="bg-primary hover:bg-secondary text-heading px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200">
              Keşfet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamHighlights: React.FC = () => {
  return (
    <div className="py-16 bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-12 text-center">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-primary/10 backdrop-blur-md rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-200">
              <div className="h-48 mb-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">Ürün Görseli</span>
              </div>
              <h3 className="text-xl font-semibold text-heading mb-2">Nike Air Max</h3>
              <p className="text-text mb-4">Performans ve stil bir arada</p>
              <button className="bg-primary hover:bg-secondary text-heading px-4 py-2 rounded transition-colors duration-200">
                İncele
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Fixtures: React.FC = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-12 text-center">Yaklaşan Etkinlikler</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-primary/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-heading">Nike Run Club</h3>
                <p className="text-text">15 Mayıs 2025, 08:00</p>
              </div>
              <div className="flex space-x-4">
                <span className="inline-block py-1 px-3 bg-primary/5 text-primary rounded-full">Koşu</span>
                <button className="bg-primary hover:bg-secondary text-heading px-4 py-1 rounded transition-colors duration-200">
                  Katıl
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/galleries?populate=*')
      .then(res => res.json())
      .then(result => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          let imageUrl = attrs.imageUrl || '';
          if (attrs.image && attrs.image.formats && attrs.image.formats.small && attrs.image.formats.small.url) {
            imageUrl = attrs.image.formats.small.url.startsWith('http')
              ? attrs.image.formats.small.url
              : 'https://api.lussogroupgeo.com' + attrs.image.formats.small.url;
          } else if (attrs.image && attrs.image.url) {
            imageUrl = attrs.image.url.startsWith('http')
              ? attrs.image.url
              : 'https://api.lussogroupgeo.com' + attrs.image.url;
          }
          return {
            documentId: item.documentId,
            title: attrs.title,
            image: imageUrl,
          };
        });
        setImages(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Galeri yükleniyor...</div>;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-12 text-center">Galeri</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            image.documentId && (
              <a
                key={image.documentId}
                href={`/wfcnikelusso/gallery/${image.documentId}`}
                className="aspect-square bg-primary/15 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer block relative"
              >
                <img src={image.image || '/uploads/placeholder.jpg'} alt={image.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                  {image.title}
                </div>
              </a>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const Sponsors: React.FC = () => {
  return (
    <div className="py-16 bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-12 text-center">İş Ortaklarımız</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="w-32 h-32 bg-primary/15 rounded-lg flex items-center justify-center">
              <span className="text-primary">Sponsor {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCards: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.lussogroupgeo.com/api/projects?populate=*')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          setProjects(result.data);
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-16 text-center">Projeler yükleniyor...</div>;
  if (error) return <div className="py-16 text-center text-red-500">Projeler alınamadı: {error}</div>;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-12 text-center">Tüm Projelerimiz</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(projects) && projects.map((item, idx) => {
            const attrs = item.attributes || {};
            let imageUrl = '';
            if (attrs.image && attrs.image.data && attrs.image.data.attributes && attrs.image.data.attributes.url) {
              imageUrl = attrs.image.data.attributes.url.startsWith('http')
                ? attrs.image.data.attributes.url
                : 'https://api.lussogroupgeo.com' + attrs.image.data.attributes.url;
            }
            return (
              <div key={idx} className="bg-primary/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 flex flex-col">
                <div className="h-48 w-full overflow-hidden">
                  <img src={imageUrl} alt={attrs.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-heading mb-2">{attrs.title}</h3>
                  <p className="text-text mb-4 flex-1">{attrs.description}</p>
                  <a href={`/${attrs.slug}`} className="inline-block mt-auto bg-primary hover:bg-secondary text-heading px-4 py-2 rounded transition-colors duration-200 text-center font-medium">Keşfet</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-text">
      <Hero />
      <ProjectCards />
      <TeamHighlights />
      <Fixtures />
      <NewsContentSection />
      <Gallery />
      <Sponsors />
    </div>
  );
};

export default HomePage;
