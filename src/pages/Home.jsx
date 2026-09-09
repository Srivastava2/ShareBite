import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Utensils, PlusCircle, Sparkles, Inbox } from 'lucide-react';
import FilterBar from '../components/feed/FilterBar';
import FoodCard from '../components/feed/FoodCard';
import api from '../services/api';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType && selectedType !== 'All') {
        params.type = selectedType;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get('/food', { params });
      setFoods(res.data.foodListings || []);
    } catch (err) {
      console.error('Fetch foods error:', err);
      toast.error('Could not load meals. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchFoods]);

  const handleClaimSuccess = (claimedId) => {
    // Remove claimed meal from the live available feed
    setFoods((prev) => prev.filter((item) => item._id !== claimedId));
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#1f3d2b] to-[#152e20] text-white rounded-3xl p-8 sm:p-12 shadow-lg shadow-emerald-950/20">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#d9a441]/20 border border-[#d9a441]/30 text-[#e7c27a] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Sparkles size={14} /> Live Campus Noticeboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Rescue Good Food on Campus
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
              Don’t let catered meals or extra snacks hit the trash. Spot available food near your dorm or department and claim it before time runs out.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/post-food"
                className="inline-flex items-center gap-2 bg-[#d9a441] hover:bg-[#c99530] text-[#1f3d2b] font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-sm"
              >
                <PlusCircle size={18} />
                Share Surplus Food
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm border border-white/20"
              >
                My Activity
              </Link>
            </div>
          </div>

          {/* Subtle graphic accent */}
          <div className="absolute right-4 -bottom-6 opacity-10 hidden sm:block pointer-events-none text-9xl">
            🍲
          </div>
        </header>

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onRefresh={fetchFoods}
          loading={loading}
        />

        {/* Food Listings Grid */}
        {loading && foods.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-emerald-600 border-t-transparent mb-3" />
            <p className="text-stone-500 text-sm">Finding active meals near you...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto my-6 space-y-4">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
              <Inbox size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800">
                {search || selectedType !== 'All' ? 'No meals match your filter' : 'No available food right now'}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                {search || selectedType !== 'All'
                  ? 'Try changing your search terms or resetting the filter.'
                  : 'Check back soon or be the first hero on campus to share extra food!'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/post-food"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-700/20"
              >
                <PlusCircle size={16} /> Post Food Now
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Available Meals ({foods.length})
              </p>
              <span className="text-xs text-stone-400">Updates live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onClaimSuccess={handleClaimSuccess}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}