// Helper to provide realistic campus food imagery based on title or type
export const getFoodImage = (food) => {
  if (food?.imageUrl) return food.imageUrl;

  const title = (food?.title || '').toLowerCase();
  const desc = (food?.description || '').toLowerCase();
  const text = `${title} ${desc}`;

  if (text.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('bakery') || text.includes('bread') || text.includes('croissant') || text.includes('pastry') || text.includes('bun')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('biryani') || text.includes('rice') || text.includes('pulao')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('sandwich') || text.includes('burger') || text.includes('wrap')) {
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('samosa') || text.includes('snack') || text.includes('finger')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('pasta') || text.includes('noodle')) {
    return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=700&q=80&auto=format&fit=crop';
  }
  if (text.includes('cater') || text.includes('platter') || text.includes('conference') || text.includes('buffet') || text.includes('event')) {
    return 'https://images.unsplash.com/photo-1555244162-803834f70033?w=700&q=80&auto=format&fit=crop';
  }
  if (food?.foodType === 'Veg' || food?.type === 'Veg') {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=80&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80&auto=format&fit=crop';
};

export const MOCK_LEADERBOARD = [
  { id: '1', name: 'Alexander K.', rank: 1, mealsShared: 365, hostel: 'Oak Hall', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80&auto=format&fit=crop' },
  { id: '2', name: 'Priya Patel', rank: 2, mealsShared: 216, hostel: 'Maple Hall', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop' },
  { id: '3', name: 'Marcus Chen', rank: 3, mealsShared: 135, hostel: 'Engineering Block', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop' },
  { id: '4', name: 'Aarav Sharma', rank: 4, mealsShared: 90, hostel: 'Hostel 4', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop' },
  { id: '5', name: 'Sarah Miller', rank: 5, mealsShared: 70, hostel: 'West Wing', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop' },
];

export const FEATURED_DONOR = {
  name: 'Alexander K.',
  title: 'Featured Campus Donor of the Week',
  description: 'Alexander rescued over 45 catered platters from the CS hackathon and redistributed them to students studying for finals. He turned potential waste into nutritious meals for his peers.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80&auto=format&fit=crop',
  impact: '45 meals shared this week'
};
