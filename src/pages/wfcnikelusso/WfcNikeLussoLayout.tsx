import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import LussoNavbar from '../../components/LussoNavbar';

interface WfcNikeLussoLayoutProps {
  children?: React.ReactNode;
}

/**
 * WfcNikeLussoLayout - Nike sayfaları için ana layout bileşeni
 * İkinci navbar temizleme ve Nike sayfalarını gösterme işlemlerini yapar
 */
const WfcNikeLussoLayout: React.FC<WfcNikeLussoLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  
  // Nike path'inde olup olmadığımızı kontrol edelim
  useEffect(() => {
    console.log('🗺️ WfcNikeLussoLayout - Şu anki yol:', pathname);
    // Body'ye nike-page class'ı ekleyelim - header'ları gizlemek için CSS kullanacağız
    document.body.classList.add('nike-page');
    
    return () => {
      document.body.classList.remove('nike-page');
    };
  }, [pathname]);
  
  // Sadece Font Awesome import
  const headStyles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  `;

  return (
    <div className="nike-route-container w-full relative bg-white">
      <LussoNavbar />
      {/* Inline stil ekleme */}
      <style dangerouslySetInnerHTML={{ __html: headStyles }} />
      <style dangerouslySetInnerHTML={{ __html: `
        #root > div > div > div > div > header { 
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
        }
      ` }} />
      {/* Hero/slider ve ana içerik tam genişlikte */}
      {children}
      <Outlet />
      {/* Diğer içerikler için container kullanılabilir, gerekirse burada eklenebilir */}
      <footer className="bg-gray-100 border-t text-xs text-gray-700">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 py-8 px-4">
          <div>
            <h4 className="font-bold mb-2">About</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Help</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Accessibility</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Social</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Download</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">App</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WfcNikeLussoLayout;
