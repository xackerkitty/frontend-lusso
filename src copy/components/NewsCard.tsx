import React from 'react';
import { Link } from 'react-router-dom';

export interface NewsItemProps {
  documentId?: string;
  title?: string;
  date?: string;
  category?: string;
  summary?: string;
  image?: string;
  featured?: boolean;
  views?: number;
  readTime?: string;
}

const NewsCard: React.FC<NewsItemProps> = ({
  documentId = '', title = '', date = '', category = '', summary = '', image = '', featured = false, views, readTime
}) => (
  documentId ? (
    <Link to={`/wfcnikelusso/news/detail/${documentId}`} className={`block bg-white rounded-lg shadow ${featured ? 'md:col-span-2' : ''}`}>      
    <div className="relative">
      <img loading="lazy" src={image} alt={title} className={`w-full object-cover ${featured ? 'h-80' : 'h-48'}`} />
      <span className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm">{category?.toUpperCase()}</span>
    </div>
    <div className="p-4">
      <div className="flex justify-between text-gray-500 text-sm mb-2 space-x-4">
        <span>{date}</span>
        <span className="flex items-center space-x-2">
          {views != null && <><i className="fas fa-eye"></i><span>{views}</span></>}
          {readTime && <><i className="fas fa-clock"></i><span>{readTime}</span></>}
        </span>
      </div>
      <h3 className="font-bold text-xl mb-2 hover:text-secondary transition-colors text-primary">{title}</h3>
      <p className="text-gray-700 line-clamp-3 mb-4">{summary}</p>
    </div>
    </Link>
  ) : null
);

export default NewsCard;
