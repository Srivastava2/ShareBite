import { Search } from 'lucide-react';

export default function FilterBar() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between border border-gray-100">
      
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by location or food..." 
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filter Badges */}
      <div className="flex gap-2 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 font-medium transition-colors">All</button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 font-medium transition-colors">Veg</button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 font-medium transition-colors">Non-Veg</button>
      </div>
      
    </div>
  );
}