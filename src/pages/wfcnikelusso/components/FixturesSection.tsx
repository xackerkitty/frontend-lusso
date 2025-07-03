import React, { useEffect, useState } from 'react';
import MatchFixtureTimeline from './MatchFixtureTimeline';

const FixturesSection: React.FC = () => {
  const [fixturesData, setFixturesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/fixtures?populate=*')
      .then((res) => {
        if (!res.ok) throw new Error('Fikstür verileri alınamadı');
        return res.json();
      })
      .then((result) => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            date: attrs.date || item.date || '',
            time: attrs.time || item.time || '',
            competition: attrs.competition || item.competition || '',
            home: attrs.homeTeam || item.homeTeam || '',
            away: attrs.awayTeam || item.awayTeam || '',
            venue: attrs.venue || attrs.location || item.venue || item.location || '',
            status: attrs.status || item.status || '',
            isHomeTeam: attrs.isHomeTeam || item.isHomeTeam || false,
            competitionLogo: (attrs.competitionLogo && attrs.competitionLogo.url)
              ? (attrs.competitionLogo.url.startsWith('http')
                  ? attrs.competitionLogo.url
                  : '/uploads' + attrs.competitionLogo.url)
              : '',
            result: attrs.result || item.result || '',
          };
        });
        setFixturesData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Fikstür yükleniyor...</div>;
  if (error) return <div>Fikstür alınamadı: {error}</div>;

  return (
    <MatchFixtureTimeline 
      title="Maç Fikstürü" 
      fixtures={fixturesData} 
      viewAllLink="/wfcnikelusso/fixtures" 
    />
  );
};

export default FixturesSection;
