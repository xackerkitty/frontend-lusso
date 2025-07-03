import { Link } from 'react-router-dom';
import WfcNikeLussoLayout from './WfcNikeLussoLayout';

interface EventsPageProps {}

export default function EventsPage({}: EventsPageProps) {
  return (
    <WfcNikeLussoLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Etkinlikler</h1>
        
        <div className="space-y-4">
          {[1,2,3].map(event => (
            <Link 
              key={event} 
              to={`/nike/events/${event}`}
              className="block bg-[#2a7d52] rounded-lg p-6 shadow-lg hover:bg-[#1a5c3a] transition-colors"
            >
              <div className="flex items-start">
                <div className="bg-[#1a5c3a] text-white p-3 rounded-lg mr-4 text-center">
                  <div className="text-xl font-bold">15</div>
                  <div className="text-sm">Haz</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Etkinlik Başlığı {event}</h3>
                  <p className="text-gray-200">Stadyum, Şehir</p>
                  <p className="text-gray-200 mt-2">19:00 - 21:00</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </WfcNikeLussoLayout>
  );
}
