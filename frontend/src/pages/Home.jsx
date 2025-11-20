import { useState } from 'react';
import { Calendar, User, Plus, CheckCircle } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({ user_id: '', out_of_date: '' });
  const [generatedKey, setGeneratedKey] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.out_of_date) return alert("Isi semua data!");

    try {
      // Asumsi endpoint API Key Generator Anda
      const response = await fetch('http://localhost:3000/api/apikeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setGeneratedKey(result.apiKey);
        alert("API Key Berhasil Dibuat!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-600" /> Generator API Key
      </h2>
      
      <form onSubmit={handleGenerate} className="space-y-5">
        {/* Input User ID (Tanpa App Name) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">User ID / Client ID</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={formData.user_id}
              onChange={(e) => setFormData({...formData, user_id: e.target.value})}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: client_001"
            />
          </div>
        </div>

        {/* Input Tanggal Expired */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Berlaku Hingga</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="date"
              value={formData.out_of_date}
              onChange={(e) => setFormData({...formData, out_of_date: e.target.value})}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
          Generate Key
        </button>
      </form>

      {generatedKey && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up">
          <p className="text-green-800 font-medium flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5" /> Kunci Anda:
          </p>
          <code className="block bg-white p-3 rounded border border-green-200 font-mono text-green-700 break-all select-all">
            {generatedKey}
          </code>
        </div>
      )}
    </div>
  );
}