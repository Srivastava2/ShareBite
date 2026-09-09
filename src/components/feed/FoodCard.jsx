import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Clock, Package, User, CheckCircle, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function FoodCard({ food, onClaimSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);

  const foodType = food.foodType || food.type || 'Veg';
  const isVeg = foodType === 'Veg';
  const location = food.pickupLocation || food.location || 'Campus';
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
    if (diffMins < 60) return `Expires in ${diffMins} min${diffMins === 1 ? '' : 's'}`;
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `Expires in ${diffHours}h ${remMins > 0 ? `${remMins}m` : ''}`;
  };

  const handleClaim = async () => {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-stone-200 overflow-hidden transition-all flex flex-col justify-between">
      <div className="p-5 space-y-4">
        
        {/* Title & Veg/Non-Veg Badge */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-stone-900 leading-snug">
            {food.title}
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1 ${
              isVeg
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            {foodType}
          </span>
        </div>

        {/* Description if present */}
        {food.description && (
          <p className="text-xs text-stone-500 line-clamp-2 italic">
            "{food.description}"
          </p>
        )}
        
        {/* Details Grid */}
        <div className="space-y-2 text-sm text-stone-600 pt-1">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-stone-400 flex-shrink-0" />
            <span className="font-medium text-stone-800">{food.quantity}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-stone-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2 text-amber-700 font-medium">
            <Clock size={16} className="flex-shrink-0 text-amber-600" />
            <span>{formatTimeRemaining(food.bestBefore)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 pt-1 border-t border-stone-100">
            <User size={14} className="flex-shrink-0" />
            <span>
              Shared by <strong className="text-stone-600">{posterName}</strong>
              {posterHostel ? ` (${posterHostel})` : ''}
            </span>
          </div>
        </div>

      </div>
      
      {/* Action Button */}
      <div className="p-4 bg-stone-50/80 border-t border-stone-100">
        {isOwner ? (
          <div className="w-full text-center py-2 px-4 bg-stone-200/70 text-stone-600 font-semibold text-sm rounded-xl">
            Your Listing
          </div>
        ) : food.status === 'CLAIMED' ? (
          <div className="w-full text-center py-2 px-4 bg-amber-100 text-amber-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5">
            <CheckCircle size={16} /> Claimed
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {claiming ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Utensils size={16} />
                Claim Meal
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}