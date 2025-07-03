import { Link } from 'react-router-dom';
import WfcNikeLussoLayout from './WfcNikeLussoLayout';

interface NewsArchivePageProps {}

export default function NewsArchivePage({}: NewsArchivePageProps) {
  return (
    <WfcNikeLussoLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Haber Arşivi</h1>
        
        <div className="bg-[#2a7d52] p-4 rounded-lg mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="bg-[#1a5c3a] text-white px-4 py-2 rounded-lg">
              <option>Yıl Seçin</option>
              <option>2023</option>
              <option>2022</option>
            </select>
            <select className="bg-[#1a5c3a] text-white px-4 py-2 rounded-lg">
              <option>Ay Seçin</option>
              <option>Ocak</option>
              <option>Şubat</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4,5,6].map(news => (
            <Link 
              key={news} 
              to={`/nike/news/${news}`}
              className="bg-[#2a7d52] rounded-lg overflow-hidden shadow-lg hover:bg-[#1a5c3a] transition-colors"
            >
              <div className="h-48 bg-gray-300 animate-pulse"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">Haber Başlığı {news}</h3>
                <p className="text-gray-200 mt-2">15 Haziran 2023</p>
                <p className="text-gray-200 mt-2 line-clamp-2">Haber özeti burada yer alacak...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </WfcNikeLussoLayout>
  );
}
