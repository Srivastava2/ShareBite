import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusCircle, Inbox, Sparkles, RefreshCw } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import FoodCard from '../components/feed/FoodCard';
import { FeaturedDonorBanner, LeaderboardWidget } from '../components/feed/Leaderboard';
import api from '../services/api';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedScale, setSelectedScale] = useState('All'); // 'All' | 'Individual' | 'Event'

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
      let list = res.data.foodListings || [];

      // Filter by scale if specified
      if (selectedScale === 'Event') {
        list = list.filter(f => (f.title + ' ' + (f.description || '')).toLowerCase().includes('cater') || 
                                (f.title + ' ' + (f.description || '')).toLowerCase().includes('event') ||
                                (f.title + ' ' + (f.description || '')).toLowerCase().includes('platter') ||
                                (f.title + ' ' + (f.description || '')).toLowerCase().includes('tray'));
      } else if (selectedScale === 'Individual') {
        list = list.filter(f => !(f.title + ' ' + (f.description || '')).toLowerCase().includes('cater') && 
                                !(f.title + ' ' + (f.description || '')).toLowerCase().includes('platter'));
      }

      setFoods(list);
    } catch (err) {
      console.error('Fetch foods error:', err);
      toast.error('Could not load meals. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, selectedScale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchFoods]);

  const handleClaimSuccess = (claimedId) => {
    setFoods((prev) => prev.filter((item) => item._id !== claimedId));
  };

  return (
    <AppShell searchTerm={search} onSearchChange={setSearch}>
      <div className="space-y-6">
        
        {/* ================= HERO SPOTLIGHT: FEATURED DONOR ================= */}
        <FeaturedDonorBanner />

        {/* ================= FILTER / SCALE TABS ================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
          
          {/* Dietary Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
            {['All', 'Veg', 'Non-Veg'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {type === 'Veg' ? '🌱 Vegetarian' : type === 'Non-Veg' ? '🍗 Non-Veg' : 'All Diets'}
              </button>
            ))}
          </div>

          {/* Scale Filter Buttons (Individual vs Catering) */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Scale:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 text-xs font-medium">
              {[
                { id: 'All', label: 'All Portions' },
                { id: 'Individual', label: '🍱 Single / Dorm' },
                { id: 'Event', label: '🎉 Catering' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScale(s.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                    selectedScale === s.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchFoods}
              title="Refresh Feed"
              className="p-2 bg-white text-slate-500 hover:text-emerald-600 border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

        </div>

        {/* ================= 2-COLUMN MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: FEED LISTINGS */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>Campus Food Noticeboard</span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {foods.length} Available
                </span>
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">Live Campus Updates</span>
            </div>

            {loading && foods.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-emerald-600 border-t-transparent mb-3" />
                <p className="text-xs text-slate-500 font-medium">Loading live campus meals...</p>
              </div>
            ) : foods.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 space-y-4">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Inbox size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">No meals match your criteria</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try clearing filters or be the campus hero to post extra food from your dorm or club!
                  </p>
                </div>
                <Link
                  to="/post-food"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle size={15} /> Post Surplus Food
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {foods.map((food) => (
                  <FoodCard
                    key={food._id}
                    food={food}
                    onClaimSuccess={handleClaimSuccess}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: LEADERBOARD & STATS WIDGET */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <LeaderboardWidget />

            {/* Campus Food Safety Tips Widget */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} /> Campus Guidelines
              </div>
              <h4 className="font-extrabold text-sm leading-snug">
                Always pick up meals within the designated window.
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bring your own container or utensil when picking up from student lounges and cafeteria counters.
              </p>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}