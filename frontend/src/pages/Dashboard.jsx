import { useState, useEffect } from 'react';
import { RefreshCw, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek keamanan sederhana di frontend
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchKeys(token);
  }, [navigate]);

  const fetchKeys = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/apikeys', {
        headers: {
          'Authorization': `Bearer ${token}` // Kirim token jika backend butuh
        }
      });
      const data = await response.json();
      if (data.success) setKeys(data.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Laporan API Key (Admin View)</h2>
          <button onClick={() => fetchKeys(localStorage.getItem('token'))} className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">API Key</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expired</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keys.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.user_id}</td>
                  <td className="px-6 py-4 font-mono text-xs bg-slate-50 rounded border border-slate-100 max-w-xs truncate">
                    {item.api_key}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.out_of_date) < new Date() ? (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Expired</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.out_of_date).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {keys.length === 0 && <p className="p-6 text-center text-slate-400">Belum ada data.</p>}
        </div>
      </div>
    </div>
  );
}