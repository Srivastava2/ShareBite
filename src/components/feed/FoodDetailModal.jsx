import { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Package, 
  ShieldCheck, 
  Utensils, 
  User, 
  Building, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getFoodImage } from '../../utils/foodAssets';
import api from '../../services/api';

export default function FoodDetailModal({ food, isOpen, onClose, onClaimSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const [claiming, setClaiming] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !food) return null;

  const foodType = food.foodType || food.type || 'Veg';
  const isVeg = foodType === 'Veg';
  const location = food.pickupLocation || food.location || 'Campus Center';
  const posterName = food.postedBy?.name || 'Campus Student';
  const posterHostel = food.postedBy?.hostel || 'Hostel 3';
  const posterCollegeId = food.postedBy?.collegeId || 'CS-2024';

  const isOwner = user && food.postedBy && (
    (typeof food.postedBy === 'object' && (food.postedBy._id === user.id || food.postedBy._id === user._id)) ||
    food.postedBy === user.id ||
    food.postedBy === user._id
  );

  // Calculate shelf-life percentage and remaining time
  const getShelfLifeStats = () => {
    if (!food.bestBefore) return { percent: 50, text: 'Soon', color: 'bg-emerald-500' };
    const expiry = new Date(food.bestBefore).getTime();
    const created = food.createdAt ? new Date(food.createdAt).getTime() : expiry - 4 * 60 * 60 * 1000;
    const now = Date.now();

    const totalDuration = Math.max(expiry - created, 1);
    const remaining = expiry - now;

    if (remaining <= 0) return { percent: 0, text: 'Expired', color: 'bg-red-500' };

    const percent = Math.min(Math.max(Math.round((remaining / totalDuration) * 100), 5), 100);
    const diffMins = Math.floor(remaining / (1000 * 60));
    
    let text = `${diffMins}m left`;
    if (diffMins >= 60) {
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      text = `${h}h ${m > 0 ? `${m}m` : ''} left`;
    }

    let color = 'bg-emerald-500';
    if (percent < 30) color = 'bg-red-500';
    else if (percent < 60) color = 'bg-amber-500';

    return { percent, text, color };
  };

  const shelfLife = getShelfLifeStats();

  const handleClaim = async () => {
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
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not claim meal.');
    } finally {
      setClaiming(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Surplus Food: ${food.title}`,
        text: `Free ${food.title} available at ${location} on ShareBite!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${food.title} available at ${location} on ShareBite!`);
      toast.success('Pickup details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200/90 z-10 my-6 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Hero Image Container */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={getFoodImage(food)}
            alt={food.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Floating Category Pills */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                isVeg ? 'bg-emerald-600/90 text-white' : 'bg-amber-600/90 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {isVeg ? '🌱 Vegetarian' : '🍗 Non-Veg'}
            </span>

            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-black/60 text-white backdrop-blur-md">
              {food.quantity} Available
            </span>
          </div>

          {/* Title & Location Banner */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {food.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1">
              <MapPin size={15} className="text-emerald-400 shrink-0" />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* 1. Shelf-Life Progress Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-600" />
                <span>Estimated Shelf-Life</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-white ${shelfLife.color}`}>
                {shelfLife.text}
              </span>
            </div>
            
            {/* Progress track */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${shelfLife.color}`}
                style={{ width: `${shelfLife.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Pick up before expiration to guarantee maximum taste and fresh campus mess quality.
            </p>
          </div>

          {/* 2. Donor Profile & Trust Card */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {posterName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{posterName}</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={11} /> 4.9 Trust Score
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {posterHostel} • Student ID: {posterCollegeId}
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              title="Share listing"
              className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* 3. Description & Detailed Pickup Instructions */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Pickup Instructions & Description
            </h4>
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/90 text-xs sm:text-sm text-slate-700 space-y-2">
              <p className="leading-relaxed">
                {food.description || "Freshly packed meals prepared with high hygiene standards. Leftover from dorm dinner, untouched and stored warm."}
              </p>
              <div className="pt-2 border-t border-emerald-200/50 text-[11px] text-emerald-900 flex items-start gap-1.5 font-medium">
                <MapPin size={13} className="shrink-0 mt-0.5 text-emerald-700" />
                <span><strong>Exact Spot:</strong> {location}. Head over directly or coordinate with donor after claiming.</span>
              </div>
            </div>
          </div>

          {/* 4. Safety & Allergen Notice */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Campus Food Safety Notice</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Always inspect food upon arrival. Bring your own clean container or tiffin to support zero-waste campus living.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          {isOwner ? (
            <div className="px-6 py-2.5 bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm rounded-xl">
              This is Your Post
            </div>
          ) : food.status === 'CLAIMED' ? (
            <div className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm rounded-xl border border-amber-300">
              <CheckCircle2 size={16} /> Already Claimed
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="flex items-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
            >
              {claiming ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Utensils size={15} />
                  <span>Claim Meal Now</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
