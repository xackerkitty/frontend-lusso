import React, { useEffect, useState } from 'react';
import ContentCardGrid from './ContentCardGrid';

const TeamHighlightsSection: React.FC = () => {
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team-members?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Takım verileri alınamadı');
        return res.json();
      })
      .then((result) => {
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
            documentId: item.documentId,
            title: attrs.name,
            summary: attrs.bio || '',
            date: '',
            image: imageUrl,
            category: attrs.position || '',
            link: item.documentId ? `/wfcnikelusso/team/${item.documentId}` : undefined,
          };
        });
        setPlayerData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Takım verileri alınamadı: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Oyuncular yükleniyor...</div>;
  if (error) return <div>Oyuncular alınamadı: {error}</div>;

  return (
    <ContentCardGrid 
      title="Oyuncularımız" 
      viewAllLink="/wfcnikelusso/team" 
      viewAllText="Tüm Takım" 
      cards={playerData} 
      layout="default" 
    />
  );
};

export default TeamHighlightsSection;
