import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Award, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Utensils, 
  Menu, 
  X,
  Sparkles,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AppShell({ children, searchTerm = '', onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { name: 'Campus Feed', path: '/feed', icon: Home },
    { name: 'Event Surplus', path: '/events', icon: Calendar },
    { name: 'Pickup Chat', path: '/dashboard', icon: MessageSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Share Food', path: '/post-food', icon: PlusCircle, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans pb-16 lg:pb-0">
      
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
          
          {/* Left: Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open sidebar menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/feed" className="flex items-center gap-2.5">
              <span className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-sm font-black text-lg">
                <Utensils size={18} />
              </span>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:inline">
                Share<span className="text-emerald-600">Bite</span>
              </span>
            </Link>
          </div>

          {/* Center: Global Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange ? onSearchChange(e.target.value) : null}
                placeholder="Search food, catering platter, building, or hall..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right: Actions, Notifications, Profile Dropdown & Quick Logout */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Quick Share Food CTA (Desktop) */}
            <Link
              to="/post-food"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle size={14} /> Post Surplus
            </Link>

            {/* Help / Guidelines Pill */}
            <button
              title="Help & Campus Guidelines"
              onClick={() => toast('ShareBite: Rescuing campus surplus food in real time!', { icon: 'ℹ️' })}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
            >
              <HelpCircle size={18} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 text-xs space-y-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center px-1">
                    <span>Campus Alerts</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl text-slate-700">
                    <p className="font-bold text-emerald-950">Campus Meals Live</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Surplus platters available at CS Block & Dining Hall.</p>
                  </div>
                  <div className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors">
                    <p className="font-semibold text-slate-900">Coordination Chat Available</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Chat with donors to coordinate exact pickup timings.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown with Instant Logout */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-100 shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <p className="font-bold text-slate-800 truncate max-w-[90px]">{user?.name || 'Student'}</p>
                  <p className="text-slate-400 text-[10px] truncate max-w-[90px]">{user?.hostel || 'Campus'}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 text-xs z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                    <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">{user?.hostel || 'Campus'} • ID: {user?.collegeId || 'Student'}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <LayoutDashboard size={15} className="text-slate-400" />
                      <span>My Impact & Claims</span>
                    </Link>

                    <Link
                      to="/post-food"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <PlusCircle size={15} className="text-slate-400" />
                      <span>Post Surplus Food</span>
                    </Link>
                  </div>

                  {/* Prominent Red Logout Button */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Log Out of Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Direct Logout Icon (Desktop / Tablet) */}
            <button
              onClick={handleLogout}
              title="Quick Log Out"
              className="hidden md:flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={17} />
            </button>

          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange ? onSearchChange(e.target.value) : null}
                placeholder="Search food, halls, platters..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* ================= APP BODY (SIDEBAR + MAIN CONTENT) ================= */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
        <aside className="w-60 hidden lg:flex flex-col justify-between py-6 px-4 border-r border-slate-200/80 bg-white/60 shrink-0">
          <div className="space-y-6">
            
            {/* Navigation Group */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Campus Portal
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-emerald-700' : 'text-slate-400'} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Campus Impact Quick Card */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <Sparkles size={14} className="text-emerald-600" />
                <span>Zero Hunger Goal</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Campus has saved <strong className="text-slate-900">500+ meals</strong> this semester.
              </p>
            </div>
          </div>

          {/* Bottom Settings & Logout */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ================= MOBILE SLIDEOUT DRAWER ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold">
                      <Utensils size={16} />
                    </span>
                    <span className="font-extrabold text-lg text-slate-900">ShareBite</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <nav className="mt-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-emerald-700' : 'text-slate-400'} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Drawer Logout */}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 text-xs font-bold text-red-600 py-3 border-t border-slate-100 cursor-pointer"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 h-16 px-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/feed"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={19} />
          <span>Feed</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar size={19} />
          <span>Events</span>
        </NavLink>

        {/* Prominent Center "+ Post" CTA Button */}
        <Link
          to="/post-food"
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
          aria-label="Post food"
        >
          <PlusCircle size={24} />
        </Link>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare size={19} />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard size={19} />
          <span>Impact</span>
        </NavLink>
      </nav>

    </div>
  );
}
