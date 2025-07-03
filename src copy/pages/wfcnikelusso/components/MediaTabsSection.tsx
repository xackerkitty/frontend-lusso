import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TabContentBlock from './TabContentBlock';

// Videolar (şimdilik statik)
const videos = [
  { id: 1, title: 'Sezon Açılış Videosu', thumbnail: '/images/video1.jpg', duration: '3:24', link: '/wfcnikelusso/videos/1', date: '10 Mayıs 2025' },
  { id: 2, title: 'Son Maç Özeti', thumbnail: '/images/video2.jpg', duration: '5:12', link: '/wfcnikelusso/videos/2', date: '8 Mayıs 2025' },
  { id: 3, title: 'Kaptan ile Röportaj', thumbnail: '/images/video3.jpg', duration: '7:39', link: '/wfcnikelusso/videos/3', date: '5 Mayıs 2025' },
  { id: 4, title: 'Yeni Transfer Aylin Yıldız ile Tanışın', thumbnail: '/images/video4.jpg', duration: '4:16', link: '/wfcnikelusso/videos/4', date: '2 Mayıs 2025' },
];

// Fotoğraf Galerisi Bileşeni (dinamik)
const PhotoGallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/galleries?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Galeri verileri alınamadı');
        return res.json();
      })
      .then((result) => {
        console.log('PHOTO TAB API RESULT:', result);
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || {};
          let imageUrl = '';
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
            _id: item.id,
            documentId: item.documentId,
            category: attrs.category,
            title: attrs.title,
            imageUrl: imageUrl,
            description: attrs.description,
            image: imageUrl,
          };
        });
        setGalleryImages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Galeri alınamadı: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Galeri yükleniyor...</div>;
  if (error) return <div>Galeri alınamadı: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {galleryImages.map((item: any) => (
        item.documentId && (
          <Link to={`/wfcnikelusso/gallery/${item.documentId}`} key={item.documentId} className="block">
            <div className="aspect-square bg-primary/15 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer shadow-md hover:shadow-lg relative group">
              <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <img 
                  src={item.image || item.imageUrl || '/uploads/placeholder.jpg'} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')}
                />
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  {item.title}
                </span>
              </div>
            </div>
          </Link>
        )
      ))}
      <Link to="/wfcnikelusso/gallery" className="col-span-full flex items-center justify-center py-6 mt-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200">
        <span className="text-primary font-semibold mr-2">Tüm Fotoğrafları Gör</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
};

// Video Galerisi Bileşeni (statik)
const VideoGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video) => (
        <Link to={video.link} key={video.id} className="block">
          <div className="bg-primary/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-heading mb-2">{video.title}</h3>
              <div className="text-gray-500 text-sm">{video.date}</div>
            </div>
          </div>
        </Link>
      ))}
      <Link to="/wfcnikelusso/videos" className="col-span-full flex items-center justify-center py-6 mt-2 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200">
        <span className="text-primary font-semibold mr-2">Tüm Videoları Gör</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
};

// Ana Bileşen
const MediaTabsSection: React.FC = () => {
  const tabs = [
    { 
      id: 'photos', 
      label: 'Fotoğraf Galerisi', 
      content: <PhotoGallery />
    },
    { 
      id: 'videos', 
      label: 'Videolar', 
      content: <VideoGallery />
    }
  ];
  
  return (
    <TabContentBlock 
      title="Galeri ve Medya" 
      tabs={tabs} 
      defaultTab="photos"
      className="bg-primary/5"  
    />
  );
};

export default MediaTabsSection;
