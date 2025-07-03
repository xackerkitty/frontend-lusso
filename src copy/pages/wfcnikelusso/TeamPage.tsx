import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AthleteType {
  _id: string;
  name: string;
  position: string;
  image?: string;
  imageUrl?: string;
  number?: string;
  bio?: string;
  documentId?: string;
}

const TeamPage: React.FC = () => {
  const [players, setPlayers] = useState<AthleteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team-members?populate=*')
      .then(res => res.json())
      .then(result => {
        const data = (result.data || []).filter((item: any) => item && item.id).map((item: any) => {
          const attrs = item.attributes || item;
          let imageUrl = '';
          const API_URL = 'https://api.lussogroupgeo.com';
          if (attrs.image && attrs.image.formats && attrs.image.formats.small && attrs.image.formats.small.url) {
            imageUrl = attrs.image.formats.small.url.startsWith('http')
              ? attrs.image.formats.small.url
              : `${API_URL}${attrs.image.formats.small.url}`;
          } else if (attrs.image && attrs.image.url) {
            imageUrl = attrs.image.url.startsWith('http')
              ? attrs.image.url
              : `${API_URL}${attrs.image.url}`;
          }
          return {
            _id: item.id,
            name: attrs.name,
            position: attrs.position,
            image: imageUrl,
            bio: attrs.bio,
            number: attrs.number,
            documentId: attrs.documentId,
          };
        });
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Oyuncular yükleniyor...</div>;
  if (error) return <div>Oyuncular alınamadı: {error}</div>;

  // Group athletes by position
  const groupedAthletes = players.reduce((acc, athlete) => {
    (acc[athlete.position] = acc[athlete.position] || []).push(athlete);
    return acc;
  }, {} as Record<string, AthleteType[]>);

  const allPositions = Object.keys(groupedAthletes);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {allPositions.map(position => (
        <div key={position} className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">{position}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {groupedAthletes[position].map(player => (
              player.documentId && (
                <Link
                  to={`/wfcnikelusso/team/${player.documentId}`}
                  key={player.documentId}
                  className="block group"
                >
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg relative group">
                    <img
                      src={player.image || '/uploads/placeholder.jpg'}
                      alt={player.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')}
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 flex flex-col items-start">
                      <span className="text-white text-lg font-bold drop-shadow">{player.name}</span>
                      {player.number && (
                        <span className="text-white text-base font-semibold drop-shadow">#{player.number}</span>
                      )}
                    </div>
                  </div>
                  <div className="sr-only">{player.position}</div>
                </Link>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamPage;
