import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  PlusCircle, 
  Utensils, 
  User, 
  Building,
  TrendingUp,
  Leaf,
  HeartHandshake,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { getFoodImage } from '../utils/foodAssets';
import PickupCoordinationModal from '../components/coordination/PickupCoordinationModal';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [postedListings, setPostedListings] = useState([]);
  const [claimedListings, setClaimedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [coordinatingItem, setCoordinatingItem] = useState(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await api.get('/food/my-activity');
      setPostedListings(res.data.postedListings || []);
      setClaimedListings(res.data.claimedListings || []);
    } catch (err) {
      toast.error('Failed to load activity details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const handleDeleteListing = async (foodId) => {
    if (!window.confirm('Are you sure you want to cancel this food listing?')) return;

    try {
      setDeletingId(foodId);
      await api.delete(`/food/${foodId}`);
      toast.success('Listing removed successfully');
      setPostedListings((prev) => prev.filter((item) => item._id !== foodId));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const totalMealsSaved = claimedListings.length + postedListings.length;
  const co2Prevented = (totalMealsSaved * 2.1).toFixed(1); // kg CO2 estimate
  const localDonations = postedListings.length;

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* ================= USER PROFILE HEADER ================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md shadow-emerald-600/20 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                  {user?.name || 'Campus Student'}
                </h1>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Campus Food Hero
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalMealsSaved} meals shared & saved this semester
              </p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <User size={12} className="text-emerald-600" /> {user?.collegeId || 'Student ID Verified'}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Building size={12} className="text-emerald-600" /> {user?.hostel || 'Main Campus'}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/post-food"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-xs text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <PlusCircle size={16} /> Share Surplus Food
          </Link>
        </div>

        {/* ================= MY IMPACT CARDS (WAVE GRAPHICS) ================= */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            My Environmental & Community Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 1: Total Meals Saved (Emerald) */}
            <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div>
                <p className="text-xs font-bold text-emerald-800">Total Meals Saved</p>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {totalMealsSaved || 0}
                </p>
              </div>

              {/* Decorative SVG Wave Graph */}
              <div className="mt-4 pt-2 -mx-5 -mb-5 opacity-80">
                <svg viewBox="0 0 200 40" className="w-full h-10 stroke-emerald-600 fill-emerald-600/10 stroke-2">
                  <path d="M 0 30 Q 50 10 100 25 T 200 15 L 200 40 L 0 40 Z" />
                </svg>
              </div>
            </div>

            {/* Card 2: CO2 Emissions Prevented (Teal) */}
            <div className="bg-teal-50/70 border border-teal-100/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div>
                <p className="text-xs font-bold text-teal-800">CO2 Emissions Prevented</p>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {co2Prevented > 0 ? co2Prevented : '0.0'} <span className="text-base sm:text-lg font-bold text-slate-600">kg</span>
                </p>
              </div>

              {/* Decorative SVG Wave Graph */}
              <div className="mt-4 pt-2 -mx-5 -mb-5 opacity-80">
                <svg viewBox="0 0 200 40" className="w-full h-10 stroke-teal-600 fill-teal-600/10 stroke-2">
                  <path d="M 0 25 Q 50 5 100 18 T 200 28 L 200 40 L 0 40 Z" />
                </svg>
              </div>
            </div>

            {/* Card 3: Local Donations Created (Amber) */}
            <div className="bg-amber-50/70 border border-amber-100/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div>
                <p className="text-xs font-bold text-amber-800">Campus Donations Created</p>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  {localDonations || 0}
                </p>
              </div>

              {/* Decorative SVG Wave Graph */}
              <div className="mt-4 pt-2 -mx-5 -mb-5 opacity-80">
                <svg viewBox="0 0 200 40" className="w-full h-10 stroke-amber-500 fill-amber-500/10 stroke-2">
                  <path d="M 0 15 Q 50 35 100 20 T 200 10 L 200 40 L 0 40 Z" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* ================= DUAL COLUMN: RECENT CLAIMS VS CURRENT LISTINGS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* COLUMN 1: MY RECENT CLAIMS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>My Claimed Meals</span>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {claimedListings.length}
                </span>
              </h3>
              <Link to="/feed" className="text-xs font-semibold text-emerald-700 hover:underline">
                Explore Feed &rarr;
              </Link>
            </div>

            {claimedListings.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <p className="font-semibold text-slate-600 text-sm">No claimed meals yet</p>
                <p className="mt-1 text-slate-400 max-w-xs mx-auto text-xs">
                  Browse the campus noticeboard to discover surplus food ready for immediate pickup.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {claimedListings.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={getFoodImage(item)}
                        alt={item.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                            Claimed
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Pickup: {item.pickupLocation}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={11} /> Claimed on {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Coordinate Pickup Button */}
                    <button
                      onClick={() => setCoordinatingItem(item)}
                      className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>Coordinate Pickup</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: MY CURRENT LISTINGS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>My Food Listings</span>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {postedListings.length}
                </span>
              </h3>
              <Link to="/post-food" className="text-xs font-semibold text-emerald-700 hover:underline">
                + Post Food
              </Link>
            </div>

            {postedListings.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <p className="font-semibold text-slate-600 text-sm">No food posted yet</p>
                <p className="mt-1 text-slate-400 max-w-xs mx-auto text-xs">
                  Have leftover food from your dorm or club? Post it in 30 seconds!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {postedListings.map((item) => {
                  const isClaimed = item.status === 'CLAIMED';
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors"
                    >
                      <img
                        src={getFoodImage(item)}
                        alt={item.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                              isClaimed
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {isClaimed ? 'Claimed' : 'Available'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.quantity} • {item.pickupLocation}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1 text-[10px]">
                          <span className="text-slate-400">
                            Posted {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {isClaimed && (
                              <button
                                onClick={() => setCoordinatingItem(item)}
                                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <MessageSquare size={11} /> Chat
                              </button>
                            )}
                            {!isClaimed && (
                              <button
                                onClick={() => handleDeleteListing(item._id)}
                                disabled={deletingId === item._id}
                                className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={11} /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Pickup Coordination & Chat Modal */}
      <PickupCoordinationModal
        item={coordinatingItem}
        isOpen={Boolean(coordinatingItem)}
        onClose={() => setCoordinatingItem(null)}
      />
    </AppShell>
  );
}
