import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-3 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-primary/10">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center space-x-2 text-sm ${className}`}>
          <Link 
            to="/" 
            className="text-primary hover:text-secondary transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfa
          </Link>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <span className="text-text/50 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              {index === items.length - 1 || item.active ? (
                <span className="text-secondary font-medium bg-primary/5 px-2 py-1 rounded-md">{item.label}</span>
              ) : (
                <Link 
                  to={item.path} 
                  className="text-primary hover:text-secondary transition-colors hover:bg-primary/5 px-2 py-1 rounded-md"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
