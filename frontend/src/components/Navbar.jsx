import { Link, useNavigate } from 'react-router-dom';
import { Key, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Cek apakah sudah login

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <Key className="w-6 h-6" />
              <span>API Manager</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
                <User className="w-4 h-4" /> Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}