import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ImageProps {
  _id: string;
  category: string;
  title: string;
  imageUrl: string;
  description?: string;
  image?: string;
  documentId?: string;
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalImage, setModalImage] = useState<ImageProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { documentId } = useParams<{ documentId?: string }>();

  useEffect(() => {
    fetch('/api/galleries?populate=*')
      .then(res => res.json())
      .then(result => {
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
        setImages(data);
        setLoading(false);
        // Eğer documentId varsa, ilgili görseli modal olarak aç
        if (documentId) {
          const found = data.find((img: any) => img.documentId === documentId);
          if (found) setModalImage(found);
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [documentId]);

  if (loading) return <div>Galeri yükleniyor...</div>;
  if (error) return <div>Galeri alınamadı: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-heading mb-6">Galeri</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(image => (
          image.documentId && (
            <a
              key={image.documentId}
              href={`/wfcnikelusso/gallery/${image.documentId}`}
              className="relative cursor-pointer block"
              onClick={e => {
                e.preventDefault();
                setModalImage(image);
              }}
            >
              <img src={image.image || image.imageUrl || '/uploads/placeholder.jpg'} alt={image.title} className="w-full h-48 object-cover rounded-lg shadow" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center rounded-b-lg">
                {image.title}
              </div>
            </a>
          )
        ))}
      </div>
      {modalImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <img src={modalImage.image || modalImage.imageUrl || '/uploads/placeholder.jpg'} alt={modalImage.title} className="w-full h-80 object-cover rounded mb-4" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
            <h2 className="text-xl font-bold mb-2">{modalImage.title}</h2>
            <p className="text-gray-700 mb-2">{modalImage.description}</p>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalImage(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
