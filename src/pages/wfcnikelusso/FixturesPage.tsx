import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ResultsSection from './components/ResultsSection';
import TableSection from './components/TableSection';

interface FixtureType {
  _id: string;
  date: string;
  time: string;
  competition: string;
  home: string;
  away: string;
  venue: string;
  status: string;
  isHomeTeam: boolean;
  competitionLogo?: string;
  result?: string;
}

type GroupedFixtures = {
  [monthYear: string]: FixtureType[];
};

function groupFixturesByMonth(fixtures: FixtureType[]): GroupedFixtures {
  return fixtures.reduce((acc, fixture) => {
    const date = new Date(fixture.date);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(fixture);
    return acc;
  }, {} as GroupedFixtures);
}

const FixturesPage: React.FC = () => {
  const [fixtures, setFixtures] = useState<FixtureType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fixtures' | 'results' | 'tables'>('fixtures');

  useEffect(() => {
    fetch('/api/fixtures?populate=*')
      .then(res => {
        if (!res.ok) throw new Error('Fikstür verileri alınamadı');
        return res.json();
      })
      .then(result => {
        const data = (result.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          return {
            _id: item.id,
            date: attrs.date || item.date || '',
            time: attrs.time || item.time || '',
            competition: attrs.competition || item.competition || '',
            home: attrs.homeTeam || item.homeTeam || '',
            away: attrs.awayTeam || item.awayTeam || '',
            venue: attrs.venue || attrs.location || item.venue || item.location || '',
            status: attrs.status || item.status || '',
            isHomeTeam: attrs.isHomeTeam || item.isHomeTeam || false,
            competitionLogo: attrs.competitionLogo || item.competitionLogo || '',
            result: attrs.result || item.result || '',
          };
        });
        setFixtures(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Fikstür yükleniyor...</div>;
  if (error) return <div>Fikstür alınamadı: {error}</div>;

  // Sekmeye göre filtrele
  const filteredFixtures = fixtures.filter(fixture =>
    activeTab === 'fixtures'
      ? fixture.status !== 'completed'
      : fixture.status === 'completed'
  );

  const grouped = groupFixturesByMonth(filteredFixtures);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Sekmeler */}
        <div className="flex justify-center gap-2 sm:gap-6 mb-8 border-b border-gray-200">
          <button
            className={`px-4 py-2 border-b-4 font-semibold transition-colors duration-200 ${activeTab === 'fixtures' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-gray-600 hover:text-primary'}`}
            onClick={() => setActiveTab('fixtures')}
          >
            Fixtures
          </button>
          <button
            className={`px-4 py-2 border-b-4 font-semibold transition-colors duration-200 ${activeTab === 'results' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-gray-600 hover:text-primary'}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
          <button
            className={`px-4 py-2 border-b-4 font-semibold transition-colors duration-200 ${activeTab === 'tables' ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-gray-600 hover:text-primary'}`}
            onClick={() => setActiveTab('tables')}
          >
            Table
          </button>
        </div>
        {/* İçerik */}
        {activeTab === 'fixtures' ? (
          Object.entries(grouped).length === 0 ? (
            <div className="text-center text-gray-500 py-12">No matches to show in this tab.</div>
          ) : (
            Object.entries(grouped).map(([monthYear, matches]) => (
              <div key={monthYear} className="mb-10">
                <h2 className="text-2xl font-bold text-primary mb-4 border-l-4 border-primary pl-3">{monthYear}</h2>
                <div className="space-y-3">
                  {matches.map(fixture => {
                    const dateObj = new Date(fixture.date);
                    const isValidDate = !isNaN(dateObj.getTime());
                    return (
                      <div key={fixture._id} className="bg-gray-50 hover:bg-white rounded-lg shadow flex flex-col md:flex-row items-center justify-between px-4 py-4 transition-all border border-gray-200">
                        {/* Tarih ve saat */}
                        <div className="flex flex-col items-center min-w-[70px] mr-4">
                          <div className="text-2xl font-bold text-primary">{isValidDate ? dateObj.getDate() : '-'}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">{isValidDate ? dateObj.toLocaleString('default', { month: 'short' }) : ''}</div>
                          <div className="text-xs text-gray-400 mt-1">{fixture.time}</div>
                        </div>
                        {/* Takımlar ve turnuva */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2">
                          <span className="font-bold text-lg text-gray-800">{fixture.home}</span>
                          <span className="text-gray-500 font-semibold">vs</span>
                          <span className="font-bold text-lg text-gray-800">{fixture.away}</span>
                        </div>
                        {/* Turnuva ve stadyum */}
                        <div className="flex flex-col items-center md:items-end min-w-[120px]">
                          <div className="flex items-center gap-2 mb-1">
                            {fixture.competitionLogo && (
                              <img src={fixture.competitionLogo} alt="logo" className="h-6 w-6" />
                            )}
                            <span className="text-xs text-gray-700 font-medium">{fixture.competition}</span>
                          </div>
                          <span className="text-xs text-gray-500">{fixture.venue}</span>
                        </div>
                        {/* Durum ve skor */}
                        <div className="flex flex-col items-end min-w-[100px] ml-4">
                          {fixture.result ? (
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-bold mb-1">{fixture.result}</span>
                          ) : (
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold mb-1 ${
                              fixture.status === 'completed'
                                ? 'bg-green-200 text-green-800'
                                : fixture.status === 'live'
                                ? 'bg-red-200 text-red-800 animate-pulse'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fixture.status === 'completed'
                                ? 'Completed'
                                : fixture.status === 'live'
                                ? 'LIVE'
                                : 'Upcoming'}
                            </span>
                          )}
                          <Link to={`/nike/fixtures/${fixture._id}`} className="text-primary hover:underline text-xs mt-1">Details</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )
        ) : activeTab === 'results' ? (
          <ResultsSection />
        ) : activeTab === 'tables' ? (
          <TableSection />
        ) : null}
      </div>
    </div>
  );
};

export default FixturesPage;
