import React, { useState, useEffect } from 'react';

interface NewsItemProps {
  _id?: string;
  title?: string;
  date?: string;
  category?: string;
  summary?: string;
  image?: string;
  imageUrl?: string;
  featured?: boolean;
  views?: number;
  readTime?: string;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?populate=*')
      .then(res => res.json())
      .then(result => {
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
          } else if (attrs.image && attrs.image.formats && attrs.image.formats.small && attrs.image.formats.small.url) {
            imageUrl = attrs.image.formats.small.url.startsWith('http')
              ? attrs.image.formats.small.url
              : 'https://api.lussogroupgeo.com' + attrs.image.formats.small.url;
          } else if (attrs.imageUrl) {
            imageUrl = attrs.imageUrl;
          } else if (typeof attrs.image === 'string') {
            imageUrl = attrs.image;
          }
          return {
            _id: item.id,
            title: attrs.title,
            date: attrs.date,
            category: attrs.category,
            summary: attrs.summary,
            image: imageUrl,
            featured: attrs.featured,
            views: attrs.views,
            readTime: attrs.readTime,
          };
        });
        setNews(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <>
      {/* <Suspense fallback={<div className="text-center py-4">Loading navbar...</div>}>
        <LussoNavbar />
      </Suspense> */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">News</h1>
          {isLoading ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Hiç haber bulunamadı.</div>
          ) : (
            <>
              {/* En üstte iki büyük kart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {news.slice(0, 2).map((item, idx) => (
                  <a
                    key={item._id || idx}
                    href={`/wfcnikelusso/news/detail/${item._id}`}
                    className="group bg-white rounded-2xl shadow hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative w-full h-80 md:h-96 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')}
                      />
                      {item.category && (
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col p-7">
                      <h2 className="text-2xl md:text-3xl font-extrabold mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h2>
                      <p className="text-gray-500 text-base mb-3">{item.date}</p>
                      <p className="text-gray-700 text-lg line-clamp-4 flex-1">{item.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
              {/* Diğer haberler grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(2).map((item, idx) => (
                  <a
                    key={item._id || idx}
                    href={`/wfcnikelusso/news/detail/${item._id}`}
                    className="group bg-white rounded-xl shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')}
                      />
                      {item.category && (
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col p-5">
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
                      <p className="text-gray-500 text-sm mb-2">{item.date}</p>
                      <p className="text-gray-700 line-clamp-3 flex-1">{item.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
