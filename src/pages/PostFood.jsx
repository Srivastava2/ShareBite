import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Utensils, MapPin, Clock, Package, AlignLeft, Sparkles } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import api from '../services/api';

export default function PostFood() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('Veg');
  const [quantity, setQuantity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [description, setDescription] = useState('');
  const [expiryPreset, setExpiryPreset] = useState('2'); // hours
  const [customExpiry, setCustomExpiry] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quick preset helper
  const getExpiryDate = () => {
    if (expiryPreset === 'custom' && customExpiry) {
      return new Date(customExpiry).toISOString();
    }
    const hours = parseFloat(expiryPreset) || 2;
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a meal title.');
      return;
    }
    if (!quantity.trim()) {
      toast.error('Please enter the available quantity.');
      return;
    }
    if (!pickupLocation.trim()) {
      toast.error('Please specify where students can pick up the food.');
      return;
    }

    const bestBefore = getExpiryDate();
    if (new Date(bestBefore) <= new Date()) {
      toast.error('Best before time must be in the future.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/food', {
        title: title.trim(),
        foodType,
        quantity: quantity.trim(),
        pickupLocation: pickupLocation.trim(),
        bestBefore,
        description: description.trim(),
      });

      toast.success('Meal listed successfully! Thank you for sharing 🍲');
      navigate('/feed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to list food. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-2">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 sm:px-7 py-6 text-white">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white/10 rounded-xl">
                <Utensils size={22} className="text-white" />
              </span>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight">Share Surplus Food</h1>
                <p className="text-emerald-100 text-xs mt-0.5">
                  Post leftover meals from clubs, dining halls, or dorm kitchens in seconds.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5">
            {/* Meal Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-700 mb-1.5">
                Meal / Dish Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Catered Veg Pulao & Paneer, 4 Fresh Sandwiches"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-xs sm:text-sm transition-all"
              />
            </div>

            {/* Food Type (Veg / Non-Veg) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dietary Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFoodType('Veg')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                    foodType === 'Veg'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  🌱 Vegetarian
                </button>

                <button
                  type="button"
                  onClick={() => setFoodType('Non-Veg')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                    foodType === 'Non-Veg'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  🍗 Non-Vegetarian
                </button>
              </div>
            </div>

            {/* Quantity and Pickup Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Package size={14} className="text-slate-400" />
                  Quantity Available <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="text"
                  required
                  placeholder="e.g. 5 boxes, 1 large tray, 3 plates"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-xs sm:text-sm transition-all"
                />
              </div>

              <div>
                <label htmlFor="pickupLocation" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" />
                  Campus Landmark / Room <span className="text-red-500">*</span>
                </label>
                <input
                  id="pickupLocation"
                  type="text"
                  required
                  placeholder="e.g. CS Block Room 204, Library Cafe"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-xs sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Expiry Window */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Available Window <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {[
                  { label: '1 Hour', val: '1' },
                  { label: '2 Hours', val: '2' },
                  { label: '4 Hours', val: '4' },
                  { label: 'Custom', val: 'custom' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setExpiryPreset(item.val)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      expiryPreset === item.val
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {expiryPreset === 'custom' && (
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    value={customExpiry}
                    onChange={(e) => setCustomExpiry(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                  />
                </div>
              )}
            </div>

            {/* Description / Dietary notes */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlignLeft size={14} className="text-slate-400" />
                Dietary & Pickup Notes <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="e.g. Leftover from CS workshop. Untouched, packed warm in clean foil boxes. Contains dairy."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-xs sm:text-sm transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-emerald-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    Post Food on Campus Board
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
