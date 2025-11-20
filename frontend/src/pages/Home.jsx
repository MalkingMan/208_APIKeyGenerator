import { useState } from 'react';
import { Calendar, User, Mail, Key, Copy, CheckCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    out_of_date: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedKey(null);

    try {
      const response = await fetch('http://localhost:3000/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedKey(result.apiKey);
        // Opsional: Reset form jika ingin
        // setFormData({ firstname: '', lastname: '', email: '', out_of_date: '' });
      } else {
        alert(result.message || "Gagal membuat key");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server backend");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      alert("API Key berhasil disalin!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
          <Key className="w-12 h-12 mx-auto mb-4 text-blue-200 opacity-80" />
          <h1 className="text-3xl font-bold tracking-tight">Developer API Portal</h1>
          <p className="text-blue-100 mt-2 text-sm opacity-90">
            Lengkapi identitas Anda untuk mendapatkan akses API Key.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Baris 1: Nama Depan & Belakang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="firstname"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John"
                    onChange={handleInputChange}
                    value={formData.firstname}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="lastname"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Doe"
                    onChange={handleInputChange}
                    value={formData.lastname}
                  />
                </div>
              </div>
            </div>

            {/* Baris 2: Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="john.doe@company.com"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>
            </div>

            {/* Baris 3: Tanggal Expired */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  name="out_of_date"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onChange={handleInputChange}
                  value={formData.out_of_date}
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                </>
              ) : (
                "Generate API Key Sekarang"
              )}
            </button>
          </form>

          {/* Hasil Generate Key (Muncul di Bawah) */}
          {generatedKey && (
            <div className="mt-8 animate-fade-in-up">
              <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3 text-green-800 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  API Key Anda Siap:
                </div>
                
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white p-3 rounded-lg border border-green-200 font-mono text-slate-700 break-all text-sm shadow-sm">
                    {generatedKey}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-white border border-green-200 rounded-lg hover:bg-green-100 text-green-700 transition-colors"
                    title="Salin Key"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-2 ml-1">
                  *Simpan kunci ini dengan aman. Jangan bagikan ke publik.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}