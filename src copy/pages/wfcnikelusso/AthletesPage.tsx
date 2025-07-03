import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WfcNikeLussoLayout from './WfcNikeLussoLayout';

interface PlayerType {
  _id: string;
  name: string;
  position: string;
  image?: string;
  documentId: string;
}

export default function AthletesPage() {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team')
      .then(res => {
        if (!res.ok) throw new Error('Oyuncular alınamadı');
        return res.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Oyuncular yükleniyor...</div>;
  if (error) return <div>Oyuncular alınamadı: {error}</div>;

  return (
    <WfcNikeLussoLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Takım Oyuncuları</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map(player => (
            player.documentId && (
              <div key={player.documentId} className="bg-[#2a7d52] rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-gray-300">
                  <img src={player.image || '/uploads/placeholder.jpg'} alt={player.name} className="object-cover w-full h-full" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                  <p className="text-gray-200">{player.position}</p>
                  <Link 
                    to={`/wfcnikelusso/team/${player.documentId}`}
                    className="mt-2 inline-block text-[#1a5c3a] bg-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Profili Gör
                  </Link>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </WfcNikeLussoLayout>
  );
}
