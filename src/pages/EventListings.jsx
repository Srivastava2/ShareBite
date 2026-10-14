import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Filter, PlusCircle, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import FoodCard from '../components/feed/FoodCard';
import api from '../services/api';

export default function EventListings() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scaleFilter, setScaleFilter] = useState('All');

  useEffect(() => {
    const fetchEventFoods = async () => {
      try {
        setLoading(true);
        const res = await api.get('/food');
        const all = res.data.foodListings || [];
        // Filter catering/events
        const eventItems = all.filter(f => {
          const text = (f.title + ' ' + (f.description || '')).toLowerCase();
          return text.includes('cater') || 
                 text.includes('event') || 
                 text.includes('platter') || 
                 text.includes('tray') || 
                 text.includes('conference') || 
                 text.includes('seminar') ||
                 text.includes('box');
        });
        setFoods(eventItems.length > 0 ? eventItems : all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventFoods();
  }, []);

  const handleClaimSuccess = (claimedId) => {
    setFoods((prev) => prev.filter((item) => item._id !== claimedId));
  };

  return (
    <AppShell searchTerm={search} onSearchChange={setSearch}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span>Event & Catering Surplus</span>
              <span className="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
                Bulk Portions
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Surplus meals from campus conferences, departmental workshops, and dining hall caterings.
            </p>
          </div>

          <Link
            to="/post-food"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle size={15} /> Post Event Surplus
          </Link>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200/80">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-emerald-600 border-t-transparent mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading event surplus...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Inbox size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No active event platters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Host an event on campus with leftover food? Post the platter so students can rescue it!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </AppShell>
  );
}
