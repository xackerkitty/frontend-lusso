import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Takım', menu: 'team' },
  { label: 'Haberler', menu: 'news' },
  { label: 'Fikstür', menu: 'fixtures' },
  { label: 'Galeri', menu: 'gallery' },
  { label: 'Hakkımızda' },
  { label: 'İletişim' }
];

const LussoNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuData, setMenuData] = useState<Record<string, any[]>>({ team: [], news: [], fixtures: [], gallery: [] });
  const [loading, setLoading] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout>();

  // Menü açılırken hemen göster ve dinamik veri çek
  const handleMenuEnter = async (menu: string) => {
    clearTimeout(closeTimeout.current);
    setActiveMenu(menu);
    setMenuVisible(true);
    // Eğer veri daha önce çekilmediyse fetch et
    if (menuData[menu] && menuData[menu].length === 0) {
      setLoading(true);
      try {
        let data = [];
        if (menu === 'gallery') {
          const res = await fetch('/api/galleries?populate=*');
          const result = await res.json();
          data = (result.data || []).map((item: any) => {
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
            }
            return {
              _id: item.id,
              category: attrs.category,
              title: attrs.title,
              imageUrl: imageUrl,
              description: attrs.description,
              image: imageUrl,
            };
          });
        } else if (menu === 'team') {
          const res = await fetch('/api/team-members?populate=*');
          const result = await res.json();
          data = (result.data || []).map((item: any) => {
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
            }
            return {
              _id: item.id,
              name: attrs.name || item.name || '-',
              position: attrs.position || item.position || '-',
              imageUrl: imageUrl,
              bio: attrs.bio || item.bio || '',
              number: attrs.number || item.number || '',
              detailPath: `/wfcnikelusso/team/${item.id}`,
            };
          });
        } else if (menu === 'news') {
          const res = await fetch('/api/news?populate=*&sort=createdAt:desc&pagination[limit]=3');
          const result = await res.json();
          data = (result.data || []).map((item: any) => {
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
            return {
              _id: item.id,
              title: attrs.title,
              date: attrs.date,
              category: attrs.category,
              summary: attrs.summary,
              imageUrl: imageUrl,
              featured: attrs.featured,
              views: attrs.views,
              readTime: attrs.readTime,
            };
          });
        } else if (menu === 'fixtures') {
          const res = await fetch('/api/fixtures?populate=*&sort=date:asc&pagination[limit]=3');
          const result = await res.json();
          data = (result.data || []).map((item: any) => {
            const attrs = item.attributes || item;
            return {
              _id: item.id,
              date: attrs.date || item.date || '',
              home: attrs.homeTeam || item.homeTeam || '',
              away: attrs.awayTeam || item.awayTeam || '',
              competition: attrs.competition || item.competition || '',
              venue: attrs.venue || attrs.location || item.venue || item.location || '',
              status: attrs.status || item.status || '',
            };
          });
        } else {
          const res = await fetch(`/api/${menu}?limit=3`);
          data = await res.json();
        }
        setMenuData(prev => ({ ...prev, [menu]: data }));
      } catch (e) {
        setMenuData(prev => ({ ...prev, [menu]: [] }));
      }
      setLoading(false);
    }
  };

  // Menüden çıkınca kısa gecikmeyle kapat
  const handleMenuLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setMenuVisible(false);
      setActiveMenu(null);
    }, 120); // 120ms gecikme
  };

  // Menüye tekrar girilirse timeout'u iptal et
  const handleMenuAreaEnter = () => {
    clearTimeout(closeTimeout.current);
  };

  return (
    <div
      className="relative z-50"
      onMouseLeave={handleMenuLeave}
      onMouseEnter={handleMenuAreaEnter}
      style={{ userSelect: 'none' }}
    >
      {/* Overlay: Sadece menü açıkken ve menü render edilirken, menünün altına (z-40) ekle */}
      {menuVisible && activeMenu && (
        <>
          {/* Shadowed overlay for dropdown */}
          <div
            className="fixed left-0 right-0 top-[56px] bottom-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => {
              setMenuVisible(false);
              setActiveMenu(null);
            }}
            style={{ backdropFilter: 'blur(2px)' }}
          />
        </>
      )}
      <nav className="bg-[#1a5c3a] flex px-8 h-14 items-center">
        <Link to="/wfcnikelusso" className="text-xl font-bold text-white mr-8 hover:underline focus:outline-none" style={{ textDecoration: 'none' }}>
          LUSSO WFC
        </Link>
        <ul className="flex space-x-6">
          {navLinks.map(link => (
            <li
              key={link.label}
              onMouseEnter={() => link.menu && handleMenuEnter(link.menu)}
              className={`cursor-pointer ${activeMenu === link.menu && menuVisible ? 'text-yellow-400' : 'text-white'}`}
            >
              <Link
                to={link.menu ? `/wfcnikelusso/${link.menu}` : `/wfcnikelusso/${link.label?.toLowerCase()}`}
                className="hover:underline focus:outline-none"
                style={{ color: 'inherit', textDecoration: 'none' }}
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  setMenuVisible(false);
                  setActiveMenu(null);
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Dropdown menü */}
      <div
        id="lusso-navbar-dropdown"
        className="absolute left-0 right-0 bg-white shadow-2xl transition-all duration-150 z-50"
        style={{
          top: '56px', // navbar yüksekliği kadar
          minHeight: 0,
          maxHeight: menuVisible && activeMenu ? 500 : 0,
          opacity: menuVisible && activeMenu ? 1 : 0,
          visibility: menuVisible && activeMenu ? 'visible' : 'hidden',
          overflow: 'hidden',
          boxShadow: menuVisible && activeMenu ? '0 8px 32px rgba(0,0,0,0.25)' : undefined
        }}
        onMouseEnter={handleMenuAreaEnter}
        onMouseLeave={handleMenuLeave}
      >
        {activeMenu && menuVisible && (
          <div className="max-w-7xl mx-auto py-12 flex gap-12">
            {loading ? (
              <div>Yükleniyor...</div>
            ) : (
              Array.isArray(menuData[activeMenu]) &&
              menuData[activeMenu].slice(0, 3).map((item: any, i: number) => {
                let detailPath = '#';
                if (activeMenu === 'team') detailPath = `/wfcnikelusso/team/${item._id || item.id}`;
                else if (activeMenu === 'news') detailPath = `/wfcnikelusso/news/${item._id || item.id}`;
                else if (activeMenu === 'gallery') detailPath = `/wfcnikelusso/gallery/${item._id || item.id}`;
                else if (activeMenu === 'fixtures') detailPath = `/wfcnikelusso/fixtures`;

                // Takım için özel render
                if (activeMenu === 'team') {
                  return (
                    <Link
                      key={i}
                      to={detailPath}
                      className="w-[320px] h-[180px] bg-gray-100 rounded-2xl flex overflow-hidden shadow-lg hover:scale-105 transition-transform"
                      style={{ textDecoration: 'none' }}
                      onClick={() => {
                        setMenuVisible(false);
                        setActiveMenu(null);
                      }}
                    >
                      <img src={item.imageUrl || '/uploads/placeholder.jpg'} alt={item.name || '-'} className="w-1/3 object-cover" />
                      <div className="flex-1 flex flex-col justify-center p-4">
                        <span className="text-primary font-bold text-lg mb-1">{item.name || '-'}</span>
                        <span className="text-gray-700 text-base mb-1">{item.position || '-'}</span>
                        <span className="text-gray-500 text-sm">{item.number ? `Forma No: ${item.number}` : ''}</span>
                      </div>
                    </Link>
                  );
                }

                // Haberler için özel render
                if (activeMenu === 'news') {
                  return (
                    <Link
                      key={i}
                      to={detailPath}
                      className="w-[420px] h-[180px] bg-gray-100 rounded-2xl flex overflow-hidden shadow-lg hover:scale-105 transition-transform"
                      style={{ textDecoration: 'none' }}
                      onClick={() => {
                        setMenuVisible(false);
                        setActiveMenu(null);
                      }}
                    >
                      <img src={item.imageUrl || '/uploads/placeholder.jpg'} alt={item.title} className="w-1/3 object-cover" />
                      <div className="flex-1 flex flex-col justify-center p-4">
                        <span className="text-primary font-bold text-lg mb-1">{item.title}</span>
                        <span className="text-gray-700 text-base mb-1">{item.summary}</span>
                        <span className="text-gray-500 text-sm">{item.date ? new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                      </div>
                    </Link>
                  );
                }

                // Galeri için özel render
                if (activeMenu === 'gallery') {
                  return (
                    <Link
                      key={i}
                      to={detailPath}
                      className="w-[320px] h-[180px] bg-gray-100 rounded-2xl flex overflow-hidden shadow-lg hover:scale-105 transition-transform"
                      style={{ textDecoration: 'none' }}
                      onClick={() => {
                        setMenuVisible(false);
                        setActiveMenu(null);
                      }}
                    >
                      <img src={item.imageUrl || '/uploads/placeholder.jpg'} alt={item.title} className="w-1/2 object-cover" />
                      <div className="flex-1 flex flex-col justify-center p-4">
                        <span className="text-primary font-bold text-lg mb-1">{item.title}</span>
                        <span className="text-gray-700 text-base mb-1">{item.category}</span>
                      </div>
                    </Link>
                  );
                }

                // Fikstür için mevcut render
                return (
                  <Link
                    key={i}
                    to={detailPath}
                    className="w-[420px] h-[180px] bg-gray-100 rounded-2xl flex flex-col overflow-hidden shadow-lg hover:scale-105 transition-transform"
                    style={{ textDecoration: 'none' }}
                    onClick={() => {
                      setMenuVisible(false);
                      setActiveMenu(null);
                    }}
                  >
                    <div className="flex-1 flex flex-col justify-center items-center p-6">
                      <span className="text-primary font-bold text-lg mb-2">{item.home} vs {item.away}</span>
                      <span className="text-gray-700 text-base mb-1">{item.competition}</span>
                      <span className="text-gray-500 text-sm">{item.date ? new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                      <span className="text-gray-400 text-xs mt-1">{item.venue}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LussoNavbar;
