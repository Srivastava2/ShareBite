import { Search, RefreshCw } from 'lucide-react';

export default function FilterBar({ 
  search = '', 
  onSearchChange, 
  selectedType = 'All', 
  onTypeChange,
  onRefresh,
  loading = false
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between border border-stone-200">
      
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by food name, location, or hall..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 text-sm transition-all"
        />
      </div>

      {/* Filter Badges & Refresh */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl flex-1 sm:flex-none">
          {['All', 'Veg', 'Non-Veg'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {type === 'Veg' ? '🌱 Veg' : type === 'Non-Veg' ? '🍗 Non-Veg' : 'All Foods'}
            </button>
          ))}
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Feed"
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
      
    </div>
  );
}