import React from 'react';

const SubscriptionCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">Bültenimize Abone Ol</h2>
      <p className="text-gray-600 mb-4 text-sm">En yeni haberleri ve güncellemeleri doğrudan e-postanıza alın.</p>
      <form className="flex space-x-2">
        <input
          type="email"
          placeholder="E-posta adresiniz"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Abone Ol
        </button>
      </form>
    </div>
  );
};

export default SubscriptionCard;
