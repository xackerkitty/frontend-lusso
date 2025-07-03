import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProductType {
  id: string;
  name: string;
  category: string;
  releaseDate: string;
  price: string;
  image: string;
  description: string;
}

interface CollectionType {
  id: string;
  name: string;
  releaseDate: string;
  image: string;
  description: string;
}

const Upcoming = () => {
  const [upcomingProducts, setUpcomingProducts] = useState<ProductType[]>([]);
  const [upcomingCollections, setUpcomingCollections] = useState<CollectionType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/products').then(res => setUpcomingProducts(res.data));
    axios.get('/api/collections').then(res => setUpcomingCollections(res.data));
    axios.get('/api/events').then(res => setUpcomingEvents(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 text-text">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Yakında</h1>
            <p className="text-xl text-text max-w-2xl mx-auto">
              Yeni ürünler, koleksiyonlar ve etkinlikler
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Yakında Çıkacak Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingProducts.map((product) => (
              <div key={product.id} className="bg-primary/5 rounded-lg overflow-hidden">
                <img src={product.image || '/uploads/placeholder.jpg'} alt={product.name} className="w-full h-64 object-cover" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
                <div className="p-6">
                  <p className="text-primary text-sm mb-2">{product.category}</p>
                  <h3 className="text-xl font-semibold mb-2 text-heading">{product.name}</h3>
                  <p className="text-text/70 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold">{product.price}</p>
                    <p className="text-text/70 text-sm">{product.releaseDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Collections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Yakında Çıkacak Koleksiyonlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingCollections.map((collection) => (
              <div key={collection.id} className="bg-primary/20 rounded-lg overflow-hidden">
                <img src={collection.image || '/uploads/placeholder.jpg'} alt={collection.name} className="w-full h-64 object-cover" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-heading">{collection.name}</h3>
                  <p className="text-text/70 mb-3">{collection.description}</p>
                  <p className="text-primary">{collection.releaseDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Yaklaşan Etkinlikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-primary/5 rounded-lg overflow-hidden">
                <img src={event.image || '/uploads/placeholder.jpg'} alt={event.title} className="w-full h-48 object-cover" onError={e => (e.currentTarget.src = '/uploads/placeholder.jpg')} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-heading">{event.title}</h3>
                  <p className="text-primary mb-1">{event.date}</p>
                  <p className="text-text/70 mb-2">{event.location}</p>
                  <p className="text-text text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Upcoming; 