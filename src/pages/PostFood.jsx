import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Utensils, MapPin, Clock, Package, AlignLeft, Sparkles, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#faf7f2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-emerald-700 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-8 py-7 text-white">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-600/50 rounded-xl">
                <Utensils size={24} className="text-emerald-100" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Share Surplus Food</h1>
                <p className="text-emerald-100/80 text-sm mt-0.5">
                  Post leftover meals from clubs, dining halls, or dorm kitchens in under a minute.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Meal Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Meal / Dish Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Catered Veg Pulao & Paneer, 4 Fresh Sandwiches"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white py-2.5 px-4 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-sm"
                />
              </div>
            </div>

            {/* Food Type (Veg / Non-Veg) */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Food Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFoodType('Veg')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    foodType === 'Veg'
                      ? 'bg-green-50 border-green-500 text-green-800 ring-2 ring-green-500/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  🌱 Pure Vegetarian
                </button>

                <button
                  type="button"
                  onClick={() => setFoodType('Non-Veg')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    foodType === 'Non-Veg'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-600/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  🍗 Non-Vegetarian
                </button>
              </div>
            </div>

            {/* Quantity and Pickup Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Package size={15} className="text-stone-400" />
                  Quantity Available <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="text"
                  required
                  placeholder="e.g. 5 boxes, 1 large tray, 3 plates"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white py-2.5 px-3.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-sm"
                />
              </div>

              <div>
                <label htmlFor="pickupLocation" className="block text-sm font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={15} className="text-stone-400" />
                  Pickup Spot <span className="text-red-500">*</span>
                </label>
                <input
                  id="pickupLocation"
                  type="text"
                  required
                  placeholder="e.g. Student Center, Room 204"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white py-2.5 px-3.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-sm"
                />
              </div>
            </div>

            {/* Expiry Window */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                <Clock size={15} className="text-stone-400" />
                Available / Best Before Window <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
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
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      expiryPreset === item.val
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {expiryPreset === 'custom' && (
                <div className="mt-2 animate-fadeIn">
                  <input
                    type="datetime-local"
                    value={customExpiry}
                    onChange={(e) => setCustomExpiry(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                  />
                </div>
              )}
            </div>

            {/* Description / Dietary notes */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <AlignLeft size={15} className="text-stone-400" />
                Dietary & Pickup Notes <span className="text-stone-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="e.g. Leftover from CS workshop. Untouched, packed warm in clean foil boxes. Contains dairy."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white py-2.5 px-3.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-700/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={18} />
                    Post Food on Campus Board
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
