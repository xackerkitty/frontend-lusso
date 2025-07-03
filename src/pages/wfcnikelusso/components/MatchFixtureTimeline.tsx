import React from 'react';
import { Link } from 'react-router-dom';

interface MatchFixtureType {
  id: number;
  date: string;
  time: string;
  competition: string;
  home: string;
  away: string;
  venue: string;
  result?: string; // Eu011fer sonuu00e7landu0131ysa
  status: 'upcoming' | 'live' | 'completed';
  isHomeTeam: boolean;
  competitionLogo?: string;
}

interface MatchFixtureTimelineProps {
  title: string;
  fixtures: MatchFixtureType[];
  viewAllLink?: string;
}

const MatchFixtureTimeline: React.FC<MatchFixtureTimelineProps> = ({ 
  title, 
  fixtures,
  viewAllLink
}) => {
  // Fikstu00fcr tarihini paru00e7ala ve gu00fcn, ay olarak gu00f6ster
  const extractDateParts = (dateString: string) => {
    const date = new Date(dateString);
    // Gu00fcn ve ayu0131 almak iu00e7in
    const day = date.getDate();
    const monthNames = ['Oca', 'u015eub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Au011fu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const month = monthNames[date.getMonth()];
    
    return { day, month };
  };

  // Sonuu00e7 rengini belirle
  const getResultColor = (result: string | undefined, isHomeTeam: boolean) => {
    if (!result || result === 'vs') return 'bg-gray-200 text-gray-800'; // Henu00fcz oynanmadu0131
    
    const [homeGoals, awayGoals] = result.split('-').map(g => parseInt(g.trim()));
    
    if (homeGoals === awayGoals) return 'bg-yellow-500 text-white'; // Beraberlik
    
    // Ev sahibi mi yoksa deplasman mu0131 olduu011fumuza gu00f6re kazanu0131p kaybettiu011fimizi belirle
    if (isHomeTeam) {
      return homeGoals > awayGoals ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    } else {
      return awayGoals > homeGoals ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    }
  };

  // Sonuu00e7 iu00e7in ku0131sa metin
  const getResultText = (result: string | undefined, status: string) => {
    if (status === 'live') return 'CANLI';
    if (!result || result === 'vs') return 'vs';
    return result;
  };
  
  return (
    <div className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-heading">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-primary hover:text-secondary transition-colors flex items-center">
              Tu00fcm Mau00e7lar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        
        <div className="space-y-6">
          {fixtures.map((fixture, index) => {
            if (!fixture || !fixture.date) return null;
            const { day, month } = extractDateParts(fixture.date);
            const resultColor = getResultColor(fixture.result, fixture.isHomeTeam);
            const resultText = getResultText(fixture.result, fixture.status);
            
            return (
              <div key={fixture.id || index} className="bg-lusso-bg-slate/80 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Tarih bu00f6lu00fcmu00fc */}
                  <div className="w-full md:w-24 bg-primary flex flex-col items-center justify-center text-white px-4 py-4 md:py-0">
                    <div className="text-3xl font-bold">{day}</div>
                    <div className="text-xl">{month}</div>
                  </div>
                  
                  {/* Mau00e7 bilgileri */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                      {/* Turnuva logosu */}
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-0 md:mr-4 mb-2 md:mb-0">
                        {fixture.competitionLogo ? (
                          <img src={fixture.competitionLogo} alt={fixture.competition} className="w-8 h-8" />
                        ) : (
                          <span className="text-primary font-bold text-sm">{fixture.competition ? fixture.competition.substring(0, 3) : ''}</span>
                        )}
                      </div>
                      
                      {/* Taku0131mlar ve skor */}
                      <div className="text-center md:text-left">
                        <div className="text-sm text-primary mb-1">{fixture.competition}</div>
                        <div className="flex items-center justify-center md:justify-start font-bold text-lg mb-1">
                          <span className={fixture.isHomeTeam ? 'font-extrabold text-primary' : ''}>{fixture.home}</span>
                          <span className={`mx-2 px-3 py-1 rounded ${resultColor}`}>{resultText}</span>
                          <span className={!fixture.isHomeTeam ? 'font-extrabold text-primary' : ''}>{fixture.away}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {fixture.venue}
                        </div>
                      </div>
                    </div>
                    
                    {/* Saat ve buton */}
                    <div className="flex flex-col items-center md:items-end">
                      <div className="text-lg font-medium mb-3">{fixture.time}</div>
                      <Link 
                        to={`/nike/fixtures/${fixture.id}`}
                        className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded transition-colors duration-200 text-sm inline-flex items-center"
                      >
                        {fixture.status === 'completed' ? 'Mau00e7 u00d6zeti' : 'Detaylar'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchFixtureTimeline;
