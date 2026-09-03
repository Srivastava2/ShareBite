import { MapPin, Clock, Package } from 'lucide-react';

export default function FoodCard({ food }) {
  const isVeg = food.type === 'Veg';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1 space-y-4">
        
        {/* Title & Badge */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">{food.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {food.type}
          </span>
        </div>
        
        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Package size={16} /> <span>{food.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> <span>{food.location}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-600 font-medium">
            <Clock size={16} /> <span>Expires soon (Timer pending)</span>
          </div>
        </div>

      </div>
      
      {/* Action Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors">
          Claim Meal
        </button>
      </div>
    </div>
  );
}