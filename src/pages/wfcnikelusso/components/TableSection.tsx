import React, { useEffect, useState } from 'react';

const TableSection: React.FC = () => {
  const [table, setTable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tables?populate=*')
      .then(res => res.json())
      .then(result => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            team: attrs.team,
            played: attrs.played,
            won: attrs.won,
            drawn: attrs.drawn,
            lost: attrs.lost,
            goalsFor: attrs.goals_for,
            goalsAgainst: attrs.goals_against,
            goalDifference: attrs.goal_difference,
            points: attrs.points,
            position: attrs.position,
          };
        });
        setTable(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Puan tablosu yükleniyor...</div>;
  if (error) return <div>Puan tablosu alınamadı: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Puan Tablosu</h2>
      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2">P</th>
            <th className="border px-2">Takım</th>
            <th className="border px-2">O</th>
            <th className="border px-2">G</th>
            <th className="border px-2">B</th>
            <th className="border px-2">M</th>
            <th className="border px-2">A</th>
            <th className="border px-2">Y</th>
            <th className="border px-2">AV</th>
            <th className="border px-2">Puan</th>
          </tr>
        </thead>
        <tbody>
          {table.sort((a, b) => a.position - b.position).map(row => (
            <tr key={row.id}>
              <td className="border px-2">{row.position}</td>
              <td className="border px-2">{row.team}</td>
              <td className="border px-2">{row.played}</td>
              <td className="border px-2">{row.won}</td>
              <td className="border px-2">{row.drawn}</td>
              <td className="border px-2">{row.lost}</td>
              <td className="border px-2">{row.goalsFor}</td>
              <td className="border px-2">{row.goalsAgainst}</td>
              <td className="border px-2">{row.goalDifference}</td>
              <td className="border px-2">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection; 