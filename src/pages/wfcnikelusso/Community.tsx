import { useEffect, useState } from 'react';
import axios from 'axios';

interface CommunityProjectType {
  id: string;
  title: string;
  image: string;
  description: string;
}

const Community = () => {
  // Geçici veriler
  const communityStories = [
    {
      id: 1,
      title: "İstanbul Maratonu'nda Nike Topluluğu",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
      date: "15 Mart 2024",
      description: "İstanbul Maratonu'nda Nike koşucuları bir araya geldi. Topluluğumuzun gücünü gösterdik."
    },
    {
      id: 2,
      title: "Kadınlar Günü Koşusu",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
      date: "8 Mart 2024",
      description: "Kadınlar Günü'nde Nike Women topluluğu ile birlikte koştuk ve güçlü mesajlar verdik."
    },
    {
      id: 3,
      title: "Genç Sporcular Kampı",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
      date: "1 Mart 2024",
      description: "Genç sporcularımızla birlikte düzenlediğimiz kış kampında unutulmaz anlar yaşadık."
    }
  ];

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  useEffect(() => {
    axios.get('/api/events').then(res => setUpcomingEvents(res.data));
  }, []);

  const [communityProjects, setCommunityProjects] = useState<CommunityProjectType[]>([]);
  useEffect(() => {
    axios.get('/api/community-projects').then(res => setCommunityProjects(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-text">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Nike Topluluğu</h1>
            <p className="text-xl text-text max-w-2xl mx-auto">
              Spor tutkusunu paylaşan, birbirini destekleyen ve birlikte büyüyen bir topluluk
            </p>
          </div>
        </div>
      </div>

      {/* Community Stories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Topluluk Hikayeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityStories.map((story) => (
              <div key={story.id} className="bg-primary/5 rounded-lg overflow-hidden">
                <img src={story.image} alt={story.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-primary text-sm mb-2">{story.date}</p>
                  <h3 className="text-xl font-semibold mb-3">{story.title}</h3>
                  <p className="text-text/70">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Yaklaşan Etkinlikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-primary/10 rounded-lg overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-primary mb-1">{event.date}</p>
                  <p className="text-text/70">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Topluluk Projeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityProjects.map((project) => (
              <div key={project.id} className="bg-primary/5 rounded-lg overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-text/70">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community; 