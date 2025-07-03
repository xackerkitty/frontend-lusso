import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';

// Haber tipi tanımlaması
interface NewsType {
  _id: string;
  title: string;
  date: string;
  author?: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  featured?: boolean;
  views?: number;
  readTime?: string;
  tags?: string[];
  relatedNews?: NewsType[];
  imageAlt?: string;
  imageCaption?: string;
  projectInfo?: {
    title: string;
    slug: string;
    description: string;
    order: number;
  };
}

// Loading skeleton bileşeni
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-primary/10 rounded-lg w-3/4 mb-6"></div>
    <div className="h-96 bg-primary/10 rounded-xl mb-8"></div>
    <div className="space-y-4">
      <div className="h-4 bg-primary/10 rounded w-full"></div>
      <div className="h-4 bg-primary/10 rounded w-5/6"></div>
      <div className="h-4 bg-primary/10 rounded w-4/6"></div>
    </div>
  </div>
);

// İçerik bölümü
const ContentSection: React.FC<{ content: string }> = ({ content }) => (
  <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />
);

// Kenar çubuğu
interface SidebarProps { tags?: string[]; related?: NewsType[]; }
const SidebarSection: React.FC<SidebarProps> = ({ tags, related }) => (
  <div className="lg:col-span-4 space-y-8 sticky top-24">
    {tags && tags.length > 0 && (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold mb-4">Kategoriler</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Link key={i} to={`/wfcnikelusso/news?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    )}
    {related && related.length > 0 && (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4">İlgili Haberler</h2>
        <div className="divide-y divide-gray-200">
          {related.map(r => (
            <Link key={r._id} to={`/wfcnikelusso/news/${r._id}`} className="block py-4">
              <h3 className="font-semibold hover:text-primary transition-colors">{r.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Abone olma kartı
const SubscriptionCard: React.FC = () => (
  <div className="bg-primary/10 p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-bold mb-4">Bültenimize Abone Olun</h2>
    <form className="space-y-3">
      <input type="email" placeholder="E-posta adresiniz" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" />
      <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">Abone Ol</button>
    </form>
  </div>
);

// Ana bileşen
const NewsDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [news, setNews] = useState<NewsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?populate=*`)
      .then((res) => {
        if (!res.ok) throw new Error('Haber bulunamadı');
        return res.json();
      })
      .then((result) => {
        const allNews = result.data || [];
        console.log('ROUTE documentId:', documentId);
        console.log('API documentIds:', allNews.map((item: any) => item.documentId));
        // URL'den gelen id artık documentId olacak
        const found = allNews.find((item: any) => item.documentId === documentId);
        if (!found) {
          setNews(null);
          setLoading(false);
          return;
        }
        const attrs = found.attributes || found;
        let imageUrl = '';
        let imageAlt = '';
        let imageCaption = '';
        if (attrs.image) {
          const img = attrs.image;
          if (img.formats && img.formats.large && img.formats.large.url) {
            imageUrl = img.formats.large.url.startsWith('http') ? img.formats.large.url : 'https://api.lussogroupgeo.com' + img.formats.large.url;
          } else if (img.url) {
            imageUrl = img.url.startsWith('http') ? img.url : 'https://api.lussogroupgeo.com' + img.url;
          }
          imageAlt = img.alternativeText || attrs.title || '';
          imageCaption = img.caption || '';
        }
        // Content alanı dizi ise HTML'e çevir
        let contentHtml = '';
        if (Array.isArray(attrs.content)) {
          contentHtml = attrs.content.map((block: any) => {
            if (block.type === 'paragraph') {
              return `<p>${block.children?.map((child: any) => child.text).join('') || ''}</p>`;
            }
            // Diğer block tipleri eklenebilir
            return '';
          }).join('');
        } else if (typeof attrs.content === 'string') {
          contentHtml = attrs.content;
        }
        // Tags string ise diziye çevir
        let tagsArr = attrs.tags;
        if (typeof tagsArr === 'string') {
          tagsArr = tagsArr.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        // Project bilgisi
        let projectInfo: { title: string; slug: string; description: string; order: number } | undefined = undefined;
        if (attrs.project) {
          const p = attrs.project;
          let desc = '';
          if (Array.isArray(p.description)) {
            desc = p.description.map((block: any) => block.children?.map((child: any) => child.text).join('') || '').join(' ');
          } else if (typeof p.description === 'string') {
            desc = p.description;
          }
          projectInfo = {
            title: p.title,
            slug: p.slug,
            description: desc,
            order: p.order,
          };
        }
        setNews({
          _id: found.id,
          title: attrs.title || '',
          date: attrs.date || '',
          author: attrs.author || '',
          category: attrs.category || '',
          summary: attrs.summary || '',
          content: contentHtml,
          image: imageUrl,
          featured: attrs.featured,
          views: attrs.views,
          readTime: attrs.readTime,
          tags: tagsArr,
          relatedNews: attrs.relatedNews,
          imageAlt,
          imageCaption,
          projectInfo,
        });
        setLoading(false);
      })
      .catch(() => {
        setNews(null);
        setLoading(false);
      });
  }, [documentId]);

  if (loading) return <LoadingSkeleton />;
  if (!news) return <div>Haber bulunamadı.</div>;

  // Hero Section - portal yok, normal render
  const HeroSection = news && news.image ? (
    <section
      className="hero-full-bleed relative h-[40vh] md:h-[50vh]"
      style={{ marginTop: '-64px' }}
    >
      <img
        loading="lazy"
        src={news.image}
        alt={news.imageAlt || news.title}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 flex flex-col justify-end items-start px-6 pb-10 text-white/90 space-y-4 z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{news.title}</h1>
        <div className="flex flex-wrap text-sm md:text-base space-x-4 text-white/80">
          <span>{news.date && new Date(news.date).toLocaleDateString('tr-TR')}</span>
          {news.author && <span>Yazar: {news.author}</span>}
          <span>{news.category}</span>
          {news.views && <span>Görüntülenme: {news.views}</span>}
          {news.readTime && <span>Okuma: {news.readTime}</span>}
        </div>
        {news.imageCaption && <div className="text-xs italic text-white/70 mt-2">{news.imageCaption}</div>}
      </div>
    </section>
  ) : null;

  return (
    <>
      <Helmet>
        <title>{news.title} | WFC Lusso</title>
        <meta name="description" content={news.summary} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.summary} />
        <meta property="og:image" content={news.image} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      {HeroSection}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            <div className="p-8">
              <ContentSection content={news.content} />
              <div className="mt-8 space-y-2">
                {news.summary && <div><b>Özet:</b> {news.summary}</div>}
                {news.tags && news.tags.length > 0 && <div><b>Etiketler:</b> {news.tags.join(', ')}</div>}
                {news.featured && <div><b>Öne Çıkan:</b> {news.featured ? 'Evet' : 'Hayır'}</div>}
                {news.views && <div><b>Görüntülenme:</b> {news.views}</div>}
                {news.readTime && <div><b>Okuma Süresi:</b> {news.readTime}</div>}
                {news.date && <div><b>Yayın Tarihi:</b> {new Date(news.date).toLocaleString('tr-TR')}</div>}
                {news.author && <div><b>Yazar:</b> {news.author}</div>}
                {news.category && <div><b>Kategori:</b> {news.category}</div>}
                {news.projectInfo && (
                  <div className="mt-4 p-4 bg-primary/10 rounded">
                    <b>Proje:</b> {news.projectInfo.title} <br />
                    <b>Slug:</b> {news.projectInfo.slug} <br />
                    <b>Açıklama:</b> {news.projectInfo.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewsDetailPage;
