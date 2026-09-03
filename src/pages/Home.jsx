import { useState } from 'react';
import FilterBar from '../components/feed/FilterBar';
import FoodCard from '../components/feed/FoodCard';

export default function Home() {
  // Dummy data to visualize the UI before connecting to the Express backend
  const [foods, setFoods] = useState([
    { _id: '1', title: 'Leftover Pizza', type: 'Non-Veg', quantity: '3 slices', location: 'CS Building, Room 101' },
    { _id: '2', title: 'Veg Sandwiches', type: 'Veg', quantity: '5 packs', location: 'Library Cafeteria' },
    { _id: '3', title: 'Catered Pasta', type: 'Veg', quantity: '1 large tray', location: 'Main Student Union' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Header */}
      <header className="text-center py-10 bg-green-50 rounded-2xl border border-green-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Rescue Food on Campus</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Don't let good food go to waste. Find available meals nearby or share your extras with the ShareBite community.
        </p>
      </header>

      {/* Filter and Grid */}
      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
      
    </div>
  );
}