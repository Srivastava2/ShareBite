import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  Utensils, 
  User, 
  Building 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shared'); // 'shared' | 'claimed'
  const [postedListings, setPostedListings] = useState([]);
  const [claimedListings, setClaimedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
    if (!window.confirm('Are you sure you want to remove this food listing?')) return;

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

  const formatExpiry = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d - now;
    if (diffMs <= 0) return 'Expired';
    const diffMins = Math.round(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} mins left`;
    const diffHours = Math.round(diffMins / 60);
    return `${diffHours} hr${diffHours > 1 ? 's' : ''} left`;
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* User Welcome Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-emerald-700/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900">{user?.name || 'Student'}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Active Member
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500 mt-1">
                <span className="flex items-center gap-1">
                  <User size={14} /> {user?.collegeId || 'Campus Student'}
                </span>
                <span className="flex items-center gap-1">
                  <Building size={14} /> {user?.hostel || 'Main Campus'}
                </span>
                <span>• {user?.email}</span>
              </div>
            </div>
          </div>

          <Link
            to="/post-food"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-700/20 text-sm whitespace-nowrap"
          >
            <PlusCircle size={18} />
            Post New Meal
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <Utensils size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Meals Shared</p>
              <p className="text-2xl font-extrabold text-stone-900">{postedListings.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Meals Claimed</p>
              <p className="text-2xl font-extrabold text-stone-900">{claimedListings.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-xl text-teal-700">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Food Waste Avoided</p>
              <p className="text-2xl font-extrabold text-stone-900">
                {((postedListings.length + claimedListings.length) * 0.8).toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-stone-200 flex gap-8">
          <button
            onClick={() => setActiveTab('shared')}
            className={`pb-4 text-base font-semibold transition-all relative ${
              activeTab === 'shared'
                ? 'text-emerald-700'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            My Shared Food ({postedListings.length})
            {activeTab === 'shared' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('claimed')}
            className={`pb-4 text-base font-semibold transition-all relative ${
              activeTab === 'claimed'
                ? 'text-emerald-700'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            My Claimed Meals ({claimedListings.length})
            {activeTab === 'claimed' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent" />
            <p className="text-stone-500 text-sm mt-3">Loading your activity...</p>
          </div>
        ) : activeTab === 'shared' ? (
          /* Shared Tab */
          postedListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">🍲</span>
              <h3 className="text-lg font-bold text-stone-800">You haven't shared any meals yet</h3>
              <p className="text-stone-500 text-sm mt-1 mb-6">
                Have extra food from an event or dorm cooking? Post it to keep it out of the trash.
              </p>
              <Link
                to="/post-food"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
              >
                <PlusCircle size={16} /> Share Surplus Food
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {postedListings.map((item) => {
                const isClaimed = item.status === 'CLAIMED';
                const isExpired = item.status === 'EXPIRED' || new Date(item.bestBefore) <= new Date();

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-stone-900">{item.title}</h3>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                item.foodType === 'Veg'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {item.foodType}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Posted on {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isClaimed
                              ? 'bg-amber-100 text-amber-800'
                              : isExpired
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-stone-400" />
                          <span>Quantity: {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-stone-400" />
                          <span>Pickup: {item.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-stone-400" />
                          <span>Expiry: {formatExpiry(item.bestBefore)}</span>
                        </div>
                      </div>

                      {/* Claimant info if claimed */}
                      {isClaimed && item.claimedBy && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                          <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1">
                            <CheckCircle2 size={14} className="text-amber-700" />
                            Claimed by {item.claimedBy.name}
                          </p>
                          <p className="text-amber-800/80">
                            Hostel: {item.claimedBy.hostel || 'Campus'} • Contact: {item.claimedBy.email}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    {!isClaimed && (
                      <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                        <button
                          onClick={() => handleDeleteListing(item._id)}
                          disabled={deletingId === item._id}
                          className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {deletingId === item._id ? 'Deleting...' : 'Cancel & Remove'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Claimed Tab */
          claimedListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">🍽️</span>
              <h3 className="text-lg font-bold text-stone-800">No claimed meals yet</h3>
              <p className="text-stone-500 text-sm mt-1 mb-6">
                Explore the active campus noticeboard to discover surplus food ready for immediate pickup.
              </p>
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
              >
                Browse Campus Feed
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {claimedListings.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-stone-900">{item.title}</h3>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              item.foodType === 'Veg'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.foodType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Claimed on {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Ready for Pickup
                      </span>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2 text-xs text-stone-700">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin size={15} className="text-emerald-700" />
                        <span>Pickup Location: <strong>{item.pickupLocation}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={15} className="text-emerald-700" />
                        <span>Quantity: {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-emerald-700" />
                        <span>Best Before: {new Date(item.bestBefore).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({formatExpiry(item.bestBefore)})</span>
                      </div>
                      {item.postedBy && (
                        <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[11px] text-stone-500">
                          <span>Posted by: <strong>{item.postedBy.name}</strong> ({item.postedBy.hostel || 'Campus'})</span>
                          <span>Contact: {item.postedBy.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
