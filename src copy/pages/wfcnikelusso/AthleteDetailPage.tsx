import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import WfcNikeLussoLayout from './WfcNikeLussoLayout';

// Sporcu verisi için type tanımlaması
interface AthleteType {
  _id: string;
  name: string;
  position: string;
  image?: string;
  number?: string;
  nationality?: string;
  bio?: string;
  stats?: Record<string, string | number>;
  birthDate?: string;
  joinedDate?: string;
}

const AthleteDetailPage: FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [athlete, setAthlete] = useState<AthleteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log('Detay sayfası id:', documentId);
    const url = `/api/team-members?populate=*`;
    console.log('Fetch edilen URL:', url);
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        const allAthletes = result.data || [];
        const found = allAthletes.find((item: any) => item.documentId === documentId);
        if (!found) {
          setAthlete(null);
          setLoading(false);
          return;
        }
        const attrs = found.attributes || found;
        let imageUrl = '/uploads/placeholder.jpg';
        if (attrs.image) {
          if (attrs.image.data) {
            const img = attrs.image.data.attributes;
            if (img.formats && img.formats.small) {
              imageUrl = img.formats.small.url.startsWith('http')
                ? img.formats.small.url
                : 'https://api.lussogroupgeo.com' + img.formats.small.url;
            } else if (img.url) {
              imageUrl = img.url.startsWith('http')
                ? img.url
                : 'https://api.lussogroupgeo.com' + img.url;
            }
          } else if (typeof attrs.image === 'object' && attrs.image.url) {
            imageUrl = attrs.image.url.startsWith('http')
              ? attrs.image.url
              : 'https://api.lussogroupgeo.com' + attrs.image.url;
          } else if (typeof attrs.image === 'string') {
            imageUrl = attrs.image;
          }
        }
        console.log('imageUrl:', imageUrl, 'attrs.image:', attrs.image);
        setAthlete({
          _id: found.id,
          name: attrs.name,
          position: attrs.position,
          image: imageUrl,
          bio: attrs.bio,
          number: attrs.number,
          nationality: attrs.nationality,
          birthDate: attrs.birthDate,
          joinedDate: attrs.joinedDate,
        });
        setLoading(false);
      })
      .catch(() => {
        setAthlete(null);
        setLoading(false);
      });
  }, [documentId]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!athlete) return <div>Oyuncu bulunamadı.</div>;

  // Biyografi kısaltma
  const shortBio = athlete.bio && athlete.bio.length > 180 ? athlete.bio.slice(0, 180) + '...' : athlete.bio;
  const showReadMore = athlete.bio && athlete.bio.length > 180;

  return (
    <div className="min-h-screen bg-primary/5 flex flex-col items-center py-10">
      {/* HEADER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        {/* Sol: İsim ve buton */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">{athlete.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            {athlete.number && (
              <span className="bg-primary text-white rounded-full px-4 py-1 text-xl font-bold shadow">#{athlete.number}</span>
            )}
            <span className="text-lg md:text-2xl font-semibold text-gray-700">{athlete.position}</span>
          </div>
        </div>
        {/* Sağ: Dairesel fotoğraf */}
        <div className="flex-shrink-0">
          <img
            src={athlete.image || '/uploads/placeholder.jpg'}
            alt={athlete.name}
            className="w-44 h-44 md:w-56 md:h-56 object-cover rounded-full border-4 border-primary shadow-lg bg-white"
            onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')}
          />
        </div>
      </div>

      {/* ALT GRID */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Sol: Biyografi */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Biyografi</h2>
          <p className="text-lg text-gray-800 mb-2">{showFullBio ? athlete.bio : shortBio}</p>
          {showReadMore && (
            <button
              className="text-primary font-semibold hover:underline focus:outline-none"
              onClick={() => setShowFullBio(v => !v)}
            >
              {showFullBio ? 'Daha Az Göster' : 'Devamını Oku'}
            </button>
          )}
        </div>
        {/* Sağ: Bilgi Tablosu */}
        <div className="flex flex-col gap-6">
          <InfoRow label="Pozisyon" value={athlete.position} />
          <Divider />
          <InfoRow label="Uyruk" value={athlete.nationality || '-'} />
          <Divider />
          <InfoRow label="Doğum Tarihi" value={athlete.birthDate || '-'} />
          <Divider />
          <InfoRow label="Katılım" value={athlete.joinedDate || '-'} />
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
      <span className="font-bold text-gray-600 uppercase tracking-wide text-sm md:text-base">{label}</span>
      <span className="text-primary text-xl md:text-2xl font-extrabold">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-b border-gray-200 my-2" />;
}

export default AthleteDetailPage;