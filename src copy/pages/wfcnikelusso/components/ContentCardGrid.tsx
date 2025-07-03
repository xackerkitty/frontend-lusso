import React from 'react';
import { Link } from 'react-router-dom';

// İçerik Kartı veri tipi
interface ContentCardType {
  _id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: string;
  link?: string;
  badge?: string;
}

interface ContentCardGridProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  cards: ContentCardType[];
  layout?: 'default' | 'featured';
}

const ContentCardGrid: React.FC<ContentCardGridProps> = ({
  title,
  viewAllLink,
  viewAllText = 'Tümünü Görüntüle',
  cards,
  layout = 'default'
}) => {
  if (layout === 'featured' && cards.length > 0) {
    // İlk kart büyük, diğerleri küçük gösterilecek
    const [featuredCard, ...otherCards] = cards;
    
    return (
      <div className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-heading">{title}</h2>
            {viewAllLink && (
              <Link to={viewAllLink} className="text-primary hover:text-secondary transition-colors flex items-center">
                {viewAllText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Öne Çıkan Büyük Kart */}
            <div className="md:col-span-2 bg-primary/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link to={featuredCard.link} className="block h-full">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={featuredCard.image} 
                    alt={featuredCard.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  {featuredCard.badge && (
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredCard.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-primary text-sm font-semibold mr-3">{featuredCard.category}</span>
                    <span className="text-gray-500 text-sm">{featuredCard.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-3">{featuredCard.title}</h3>
                  <p className="text-text mb-4">{featuredCard.summary}</p>
                  <span className="text-primary hover:text-secondary font-medium inline-flex items-center transition-colors">
                    Devamını Oku
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Sağ taraftaki küçük kartlar */}
            <div className="md:col-span-1 flex flex-col gap-6">
              {otherCards.slice(0, 2).map(card => (
                <div key={card._id} className="bg-primary/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex-1">
                  <Link to={card.link} className="block h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      {card.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-primary text-xs font-semibold mr-2">{card.category}</span>
                        <span className="text-gray-500 text-xs">{card.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-heading mb-2 line-clamp-2">{card.title}</h3>
                      <span className="text-primary hover:text-secondary text-sm font-medium inline-flex items-center transition-colors">
                        Devamını Oku
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Alt kartlar - 3 sütun */}
          {otherCards.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {otherCards.slice(2, 5).map(card => (
                <div key={card._id} className="bg-primary/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link to={card.link} className="block h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      {card.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-primary text-xs font-semibold mr-2">{card.category}</span>
                        <span className="text-gray-500 text-xs">{card.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-heading mb-2 line-clamp-2">{card.title}</h3>
                      <span className="text-primary hover:text-secondary text-sm font-medium inline-flex items-center transition-colors">
                        Devamını Oku
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Standart Grid Düzeni
  return (
    <div className="py-16 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-heading">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-primary hover:text-secondary transition-colors flex items-center">
              {viewAllText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card._id} className="bg-primary/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link to={card.link} className="block">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  {card.badge && (
                    <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-primary text-sm font-semibold mr-3">{card.category}</span>
                    <span className="text-gray-500 text-sm">{card.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3 line-clamp-2">{card.title}</h3>
                  <p className="text-text mb-4 line-clamp-3">{card.summary}</p>
                  <span className="text-primary hover:text-secondary font-medium inline-flex items-center transition-colors">
                    Devamını Oku
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCardGrid;
