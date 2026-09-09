import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Utensils, LogIn, LogOut, PlusCircle, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-lg text-sm font-semibold ${
      isActive
        ? 'text-emerald-800 bg-emerald-50'
        : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
    }`;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <Link to={user ? "/feed" : "/"} className="flex items-center gap-2 text-emerald-800 font-extrabold text-2xl tracking-tight">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Utensils size={22} />
            </span>
            <span>ShareBite</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink to="/feed" className={navLinkClass}>
              Campus Feed
            </NavLink>

            {user ? (
              // Show these if logged in
              <>
                <NavLink to="/post-food" className={navLinkClass}>
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">Post Food</span>
                </NavLink>

                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">My Activity</span>
                </NavLink>

                {/* User avatar pill */}
                <div className="hidden md:flex items-center gap-1.5 py-1 px-2.5 bg-stone-100 rounded-full text-xs font-semibold text-stone-700">
                  <User size={13} className="text-emerald-700" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-stone-100 text-stone-600 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ml-1"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              // Show these if logged out
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-1 text-stone-600 hover:text-emerald-700 px-3 py-2 text-sm font-semibold transition-colors"
                >
                  <LogIn size={16} /> Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-700/20"
                >
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