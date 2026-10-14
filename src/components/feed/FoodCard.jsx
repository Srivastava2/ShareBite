import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Clock, CheckCircle2, Utensils, ShieldCheck, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFoodImage } from '../../utils/foodAssets';
import FoodDetailModal from './FoodDetailModal';
import api from '../../services/api';

export default function FoodCard({ food, onClaimSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const foodType = food.foodType || food.type || 'Veg';
  const isVeg = foodType === 'Veg';
  const location = food.pickupLocation || food.location || 'Campus Center';
  const posterName = food.postedBy?.name || 'Fellow Student';
  const posterHostel = food.postedBy?.hostel;

  const isOwner = user && food.postedBy && (
    (typeof food.postedBy === 'object' && (food.postedBy._id === user.id || food.postedBy._id === user._id)) ||
    food.postedBy === user.id ||
    food.postedBy === user._id
  );

  const formatTimeRemaining = (dateStr) => {
    if (!dateStr) return 'Soon';
    const expiry = new Date(dateStr);
    const now = new Date();
    const diffMs = expiry - now;

    if (diffMs <= 0) return 'Expired';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins}m left`;
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `${diffHours}h ${remMins > 0 ? `${remMins}m` : ''} left`;
  };

  const handleClaim = async (e) => {
    if (e) e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please log in to claim meals', { icon: '🔑' });
      navigate('/login');
      return;
    }

    if (isOwner) {
      toast.error('You cannot claim your own food post.');
      return;
    }

    setClaiming(true);
    try {
      const res = await api.patch(`/food/${food._id}/claim`);
      toast.success(res.data.message || 'Meal claimed successfully! 🎉');
      if (onClaimSuccess) {
        onClaimSuccess(food._id, res.data.food);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not claim meal.');
    } finally {
      setClaiming(false);
    }
  };

  const imageUrl = getFoodImage(food);

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
      >
        
        {/* Top Media Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={food.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Quick Inspect Hover Overlay Icon */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <Eye size={14} /> Quick Inspect
            </span>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md shadow-xs flex items-center gap-1 ${
                isVeg
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-amber-600/90 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {isVeg ? 'Vegetarian' : 'Non-Veg'}
            </span>

            {food.title.toLowerCase().includes('cater') || food.title.toLowerCase().includes('event') ? (
              <span className="px-2 py-1 text-[11px] font-bold rounded-lg bg-teal-700/90 text-white shadow-xs backdrop-blur-md">
                Catered Event
              </span>
            ) : (
              <span className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-black/60 text-white text-[10px] backdrop-blur-md">
                {food.quantity}
              </span>
            )}
          </div>

          {/* Expiry Pill */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-amber-300 font-semibold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Clock size={12} />
            <span>{formatTimeRemaining(food.bestBefore)}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {food.title}
            </h3>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {food.description || `Available now for student pickup. Prepared fresh and ready to be claimed.`}
            </p>
          </div>

          {/* Campus & Landmark Pickup Tags */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5 truncate max-w-[200px]" title={location}>
                <MapPin size={14} className="text-emerald-600 shrink-0" />
                <strong className="text-slate-700 truncate">{location}</strong>
              </span>
              <span className="text-[11px] text-slate-400 shrink-0">
                {posterHostel ? `${posterHostel}` : 'Campus'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" /> Student Verified
              </span>
              <span>• By {posterName}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
          {isOwner ? (
            <div className="w-full text-center py-2 px-3 bg-slate-100 text-slate-600 font-semibold text-xs rounded-xl">
              Your Active Post
            </div>
          ) : food.status === 'CLAIMED' ? (
            <div className="w-full text-center py-2 px-3 bg-amber-50 text-amber-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-amber-200">
              <CheckCircle2 size={15} /> Claimed
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {claiming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Utensils size={15} />
                  Claim Food
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Deep-Dive Inspection Modal */}
      <FoodDetailModal
        food={food}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onClaimSuccess={onClaimSuccess}
      />
    </>
  );
}