import React, { useEffect, useState } from 'react';
import Breadcrumb from './components/Breadcrumb';
import axios from 'axios';

interface MilestoneType {
  year: string;
  title: string;
  description: string;
}

interface ValueType {
  title: string;
  description: string;
}

const AboutPage: React.FC = () => {
  const [milestones, setMilestones] = useState<MilestoneType[]>([]);
  const [values, setValues] = useState<ValueType[]>([]);

  useEffect(() => {
    axios.get('/api/about-milestones').then(res => setMilestones(res.data));
    axios.get('/api/about-values').then(res => setValues(res.data));
  }, []);

  const teamMembers = [
    {
      name: 'Ahmet Yıldız',
      role: 'Nike Ürünleri Direktörü',
      imagePlaceholder: 'Yönetici Fotoğrafı'
    },
    {
      name: 'Zeynep Demir',
      role: 'Pazarlama Müdürü',
      imagePlaceholder: 'Yönetici Fotoğrafı'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Spor Danışmanı',
      imagePlaceholder: 'Yönetici Fotoğrafı'
    },
    {
      name: 'Elif Yalçın',
      role: 'Perakende Operasyonları',
      imagePlaceholder: 'Yönetici Fotoğrafı'
    },
  ];

  return (
    <div
      className="w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-primary/10 to-primary/20 text-text"
      style={{ overflowY: 'visible', overflowX: 'hidden' }}
      role="main"
      aria-labelledby="page-title"
    >
      {/* Breadcrumb navigasyonu - erişilebilirlik için semantik yapı */}
      <nav aria-label="Sayfa navigasyonu">
        <Breadcrumb
          items={[
            { label: 'Anasayfa', path: '/nike' },
            { label: 'Hakkımızda', path: '/nike/about', active: true }
          ]}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mt-16 sm:mt-20"
        />
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-heading mb-4">Hakkımızda</h1>
          <p className="text-xl text-text max-w-3xl mx-auto">
            Lusso ve Nike işbirliğiyle oluşan benzersiz deneyim
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Hikayemiz</h2>
          <div className="bg-primary/10 rounded-xl p-8">
            <p className="text-text mb-6 text-lg">
              Lusso Group, 2005 yılında lüks moda ve yaşam tarzı ürünleri sunmak amacıyla kurulmuştur. 2010 yılında Nike ile başlayan stratejik ortaklığımız, spor ve lüks yaşamı bir araya getiren benzersiz bir deneyim sunmamızı sağladı.
            </p>
            <p className="text-text mb-6 text-lg">
              Dünya çapında tanınan Nike markasının yenilikçi ürünlerini, Lusso'nun kusursuz müşteri hizmetleri ve lüks perakende deneyimiyle birleştirerek, sporseverlere premium bir alışveriş deneyimi sunuyoruz.
            </p>
            <p className="text-text text-lg">
              Bugün, Türkiye'nin önde gelen Nike Premium Retailer'ı olarak, en yeni ve özel Nike koleksiyonlarını müşterilerimizle buluşturuyor, aynı zamanda Nike sponsorluğunda çeşitli spor etkinlikleri düzenliyoruz.
            </p>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Kilometre Taşlarımız</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
            
            {/* Timeline items */}
            <div className="space-y-16 relative">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  <div className="md:w-1/2 mb-6 md:mb-0 md:px-8">
                    <div className="bg-primary/10 rounded-xl p-6 hover:bg-primary/15 transition-colors">
                      <div className="font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-heading mb-2">{milestone.title}</h3>
                      <p className="text-text">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 relative flex justify-center">
                    <div className="h-10 w-10 rounded-full bg-primary border-4 border-primary/30 flex items-center justify-center z-10">
                      <span className="text-heading font-bold">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-primary/10 rounded-xl p-6 hover:bg-primary/15 transition-colors">
                <h3 className="text-xl font-semibold text-heading mb-3">{value.title}</h3>
                <p className="text-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div>
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Ekibimiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-primary/10 rounded-xl overflow-hidden text-center hover:bg-primary/15 transition-colors">
                <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
                  <span className="text-primary font-semibold">{member.imagePlaceholder}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-heading">{member.name}</h3>
                  <p className="text-text/80">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
