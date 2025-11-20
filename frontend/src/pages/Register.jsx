import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // UBAH: State sekarang menggunakan 'email' bukan 'username'
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) // Mengirim { email: '...', password: '...' }
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert("Registrasi Berhasil! Silakan Login.");
        navigate('/login');
      } else {
        alert("Gagal: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Daftar Admin Baru</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* INPUT EMAIL */}
          <input
            type="email"
            placeholder="Email Admin (contoh: admin@test.com)"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
          
          {/* INPUT PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          
          <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
            Daftar Sekarang
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}