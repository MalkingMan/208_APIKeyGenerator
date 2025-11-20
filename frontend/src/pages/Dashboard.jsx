import { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/apikeys', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setKeys(data.data);
      } else {
        console.error("Gagal mengambil data:", data.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-700">Laporan Pengguna API</h2>
            <button onClick={() => fetchData(localStorage.getItem('token'))} className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-blue-600 transition-all">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">API Key</th>
                  <th className="px-6 py-4">Status & Expired</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keys.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {/* Kolom 1: First Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {item.firstname ? item.firstname.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium text-slate-900">
                          {item.firstname} {item.lastname}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 2: User ID (Database ID) */}
                    <td className="px-6 py-4 font-mono text-slate-500">
                      #{item.user_id}
                    </td>

                    {/* Kolom 3: API Key */}
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-600 select-all">
                        {item.api_key}
                      </code>
                    </td>

                    {/* Kolom 4: Expired */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        {new Date(item.out_of_date) < new Date() ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">Expired</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                        )}
                        <span className="text-xs text-slate-400">
                          {new Date(item.out_of_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* State Kosong */}
            {keys.length === 0 && !loading && (
              <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                <User className="w-10 h-10 mb-3 opacity-20" />
                <p>Belum ada data. Silakan generate key dari halaman depan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}