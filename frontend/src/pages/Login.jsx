import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  // UBAH: State pakai email
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || "Login Gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Admin"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
            Masuk Dashboard
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar disini</Link>
        </p>
      </div>
    </div>
  );
}