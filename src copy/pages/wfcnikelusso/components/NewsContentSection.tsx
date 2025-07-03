import React, { useEffect, useState } from 'react';
import ContentCardGrid from './ContentCardGrid';

const NewsContentSection: React.FC = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/news?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Haberler alınamadı');
        return res.json();
      })
      .then((result) => {
        console.log('NEWS API RESPONSE:', result);
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          let imageUrl = '';
          if (attrs.image && attrs.image.formats && attrs.image.formats.small && attrs.image.formats.small.url) {
            imageUrl = attrs.image.formats.small.url.startsWith('http')
              ? attrs.image.formats.small.url
              : 'https://api.lussogroupgeo.com' + attrs.image.formats.small.url;
          } else if (attrs.image && attrs.image.url) {
            imageUrl = attrs.image.url.startsWith('http')
              ? attrs.image.url
              : 'https://api.lussogroupgeo.com' + attrs.image.url;
          } else if (attrs.imageUrl) {
            imageUrl = attrs.imageUrl;
          } else if (typeof attrs.image === 'string') {
            imageUrl = attrs.image;
          }
          console.log('imageUrl:', imageUrl, 'for news id:', item.id);
          return {
            _id: item.id,
            documentId: item.documentId,
            title: attrs.title,
            date: attrs.date,
            category: attrs.category,
            summary: attrs.summary,
            image: imageUrl,
            link: `/wfcnikelusso/news/detail/${item.documentId}`,
            featured: attrs.featured,
            views: attrs.views,
            readTime: attrs.readTime,
          };
        });
        setNewsData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Haberler alınamadı: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Haberler yükleniyor...</div>;
  if (error) return <div>Haberler alınamadı: {error}</div>;

  return (
    <ContentCardGrid 
      title="Son Haberler" 
      viewAllLink="/wfcnikelusso/news" 
      viewAllText="Tüm Haberler" 
      cards={newsData} 
      layout="featured"
    />
  );
};

export default NewsContentSection;
