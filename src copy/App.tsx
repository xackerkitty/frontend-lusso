import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Temel sayfalar
import BluControl from './pages/BluControl';
import Construction from './pages/Construction';
import SmartDevelopment from './pages/SmartDevelopment';
import LussoInvest from './pages/LussoInvest';
import LuxuryCar from './pages/LuxuryCar/LuxuryCar';
import WfcNikeLussoLayout from './pages/wfcnikelusso/WfcNikeLussoLayout';
import WfcNikeLusso from './pages/wfcnikelusso/WfcNikeLusso';
import TeamPage from './pages/wfcnikelusso/TeamPage';
import AthleteDetailPage from './pages/wfcnikelusso/AthleteDetailPage';
import NewsPage_new from './pages/wfcnikelusso/NewsPage_new';
import NewsDetailPage_new from './pages/wfcnikelusso/NewsDetailPage_new';
import GalleryPage from './pages/wfcnikelusso/GalleryPage';
import FixturesPage from './pages/wfcnikelusso/FixturesPage';

// Bileşenler
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Router Yardımcı Bileşeni - Nike sayfalarında Header'ı gösterme
const UserRoute = ({ element, path }: { element: React.ReactNode; path: string }) => {
  // Sadece Nike dışındaki sayfalarda kullanılıyor, ek kontrol gerekmez
  return (
    <PageLayout section={path.substring(1) as any}>
      {element}
    </PageLayout>
  );
};

// Ana Sayfa Bileşeni
function LussoMainPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axios.get('/api/projects?populate=*').then(res => {
      if (Array.isArray(res.data.data)) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
      }
    });
  }, []);
  return (
    <div className="bg-white text-gray-800 w-full min-h-screen p-0 m-0 overflow-x-hidden">
      {/* Üst Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Lusso Logo" className="h-10 mr-2" />
            <span className="text-primary font-bold text-2xl font-serif">Lusso</span>
          </div>
          <div className="hidden md:flex items-center">
            <ul className="flex space-x-8">
              <li>
                <a 
                  href="/construction" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  İnşaat
                </a>
              </li>
              <li>
                <a 
                  href="/smartdevelopment" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  Akıllı Ev
                </a>
              </li>
              <li>
                <a 
                  href="/lussoinvest" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  Yatırım
                </a>
              </li>
              <li>
                <a 
                  href="/blucontrol" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  Blu Control
                </a>
              </li>
              <li>
                <a 
                  href="/luxurycars" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  Lüks Araçlar
                </a>
              </li>
              <li>
                <a 
                  href="/wfcnikelusso" 
                  className="px-3 py-2 text-gray-700 hover:text-primary transition-colors hover:border-b-2 hover:border-secondary"
                >
                  WFC Nike Lusso
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-secondary/20 text-[120px] font-bold">LUSSO</div>
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">En Üstün Yaşam Deneyimi</h1>
              <p className="text-xl text-gray-600 mb-8">Lüks, konfor ve teknolojiyi bir araya getiren çözümlerle hayatınızı daha iyi hale getiriyoruz.</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/construction" 
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-semibold transition-all"
                >
                  Keşfedin
                </a>
                <a 
                  href="/contact" 
                  className="bg-transparent hover:bg-gray-100 text-primary border-2 border-primary px-6 py-3 rounded-md font-semibold transition-all"
                >
                  İletişim
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects Section */}
      <div id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Tüm Projelerimiz</h2>
        <div className="w-24 h-1 bg-secondary mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(projects) && projects.map((item: any) => {
            // Strapi v4: doğrudan attributes yok, alanlar üstte
            const title = item.title || '';
            const slug = item.slug || '';
            // Description: ilk paragrafın ilk child'ının text'i
            let descriptionText = '';
            if (Array.isArray(item.description) && item.description.length > 0) {
              const firstBlock = item.description[0];
              if (firstBlock.type === 'paragraph' && Array.isArray(firstBlock.children) && firstBlock.children.length > 0) {
                descriptionText = firstBlock.children[0].text;
              }
            }
            // Görsel: küçük formatı varsa onu, yoksa ana url'yi kullan
            let imageUrl = '';
            if (item.image && item.image.formats && item.image.formats.small && item.image.formats.small.url) {
              imageUrl = item.image.formats.small.url.startsWith('http')
                ? item.image.formats.small.url
                : 'https://api.lussogroupgeo.com' + item.image.formats.small.url;
            } else if (item.image && item.image.url) {
              imageUrl = item.image.url.startsWith('http')
                ? item.image.url
                : 'https://api.lussogroupgeo.com' + item.image.url;
            }
            return (
              <a
                key={item.id}
                href={`/${slug}`}
                className="block bg-white hover:bg-primary/5 rounded-xl p-8 transition-all transform hover:-translate-y-1 border border-primary/10 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ textDecoration: 'none' }}
              >
                <div className="h-48 mb-6 rounded-lg overflow-hidden">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{descriptionText}</p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img src="/logo.png" alt="Lusso Logo" className="h-10 mr-2" />
                <span className="text-primary font-bold text-2xl font-serif">Lusso</span>
              </div>
              <p className="text-gray-600 mt-2">Premium yaşam ve kaliteli hizmet</p>
            </div>
            
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a href="#" className="bg-white p-2 rounded-full text-primary hover:text-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="bg-white p-2 rounded-full text-primary hover:text-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="bg-white p-2 rounded-full text-primary hover:text-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-primary/10 mt-8 pt-8 text-center">
            <p className="text-gray-600">&copy; 2025 Lusso Group. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sayfa türü tipi
type SectionType = 'nike' | 'construction' | 'smart' | 'invest' | 'blu' | 'luxury';

// Nike ve diğer sayfalar için ortak layout bileşeni
function PageLayout({ children, section }: { children: React.ReactNode; section?: SectionType }) {
  // LuxuryCar sayfalarında Header'ı gösterme
  const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const isLuxuryCar = path.startsWith('/luxurycar') || path.startsWith('/luxurycars');
  return (
    <div className="flex flex-col min-h-screen">
      {!isLuxuryCar && <Header section={section} />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Ana uygulama bileşeni
function App() {
  return (
    <Routes>
      {/* Ana Lusso sayfası */}
      <Route path="/" element={<LussoMainPage />} />

      {/* Nike sayfaları için sadece nested route ve layout */}
      <Route path="/wfcnikelusso/*" element={<WfcNikeLussoLayout />}> 
        <Route path="" element={<WfcNikeLusso />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:documentId" element={<AthleteDetailPage />} />
        <Route path="team/detail/:documentId" element={<AthleteDetailPage />} />
        <Route path="news" element={<NewsPage_new />} />
        <Route path="news/detail/:documentId" element={<NewsDetailPage_new />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="gallery/:documentId" element={<GalleryPage />} />
        <Route path="fixtures" element={<FixturesPage />} />
        {/* Diğer alt sayfalar buraya eklenebilir */}
      </Route>

      {/* Diğer sayfalar için UserRoute kullan - Sadece ana sayfa için sekmeler ve hero section olacak */}
      <Route path="/construction" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/construction/*" element={<UserRoute path="/construction" element={<Construction />} />} />
      <Route path="/smartdevelopment" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/smartdevelopment/*" element={<UserRoute path="/smartdevelopment" element={<SmartDevelopment />} />} />
      <Route path="/lussoinvest" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/lussoinvest/*" element={<UserRoute path="/lussoinvest" element={<LussoInvest />} />} />
      <Route path="/blucontrol" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/blucontrol/*" element={<UserRoute path="/blucontrol" element={<BluControl />} />} />
      <Route path="/luxurycar" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycar/*" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycars" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
      <Route path="/luxurycars/*" element={<UserRoute path="/luxurycar" element={<LuxuryCar />} />} />
    </Routes>
  );
}

export default App;
