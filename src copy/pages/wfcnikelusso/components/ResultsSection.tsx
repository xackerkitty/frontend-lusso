import React, { useEffect, useState } from 'react';

const ResultsSection: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/results?populate=*')
      .then(res => res.json())
      .then(result => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            date: attrs.date,
            home: attrs.home_team,
            away: attrs.away_team,
            homeScore: attrs.home_score,
            awayScore: attrs.away_score,
            competition: attrs.competition,
            venue: attrs.venue,
          };
        });
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Sonuçlar yükleniyor...</div>;
  if (error) return <div>Sonuçlar alınamadı: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sonuçlar</h2>
      {results.map(result => (
        <div key={result.id} className="mb-2 p-2 border rounded">
          <span>{result.date}</span> - <span>{result.home} {result.homeScore} - {result.awayScore} {result.away}</span>
        </div>
      ))}
    </div>
  );
};

export default ResultsSection; 