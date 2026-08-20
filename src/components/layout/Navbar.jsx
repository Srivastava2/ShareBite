import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Utensils, LogIn, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-2xl">
            <Utensils size={28} />
            <span>ShareBite</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-green-600 transition-colors">Feed</Link>

            {user ? (
              // Show these if logged in
              <>
                <Link to="/post-food" className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <PlusCircle size={18} /> Post Food
                </Link>
                <Link to="/dashboard" className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <LayoutDashboard size={18} /> My Claims
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              // Show these if logged out
              <>
                <Link to="/login" className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}