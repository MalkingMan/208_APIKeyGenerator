import { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Search, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchKeys(token);
  }, [navigate]);

  const fetchKeys = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/apikeys', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) setKeys(data.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filter pencarian (opsional, tapi berguna)
  const filteredKeys = keys.filter(item => 
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Pantau penggunaan API Key user Anda.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Toolbar Tabel */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama atau email..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => fetchKeys(localStorage.getItem('token'))} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-blue-600 transition-all" title="Refresh Data">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User Profile</th>
                  <th className="px-6 py-4">API Key</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expired Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredKeys.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Kolom 1: Identitas User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {item.firstname.charAt(0)}{item.lastname.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.firstname} {item.lastname}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="w-3 h-3" /> {item.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: API Key */}
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-600">
                        {item.api_key}
                      </code>
                    </td>

                    {/* Kolom 3: Status */}
                    <td className="px-6 py-4">
                      {new Date(item.out_of_date) < new Date() ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Kolom 4: Tanggal */}
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(item.out_of_date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredKeys.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                <p>Tidak ada data user ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}