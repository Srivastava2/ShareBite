import { Award, Heart } from 'lucide-react';
import { MOCK_LEADERBOARD, FEATURED_DONOR } from '../../utils/foodAssets';

export function FeaturedDonorBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-100/90 via-amber-50/80 to-emerald-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={FEATURED_DONOR.avatar}
            alt={FEATURED_DONOR.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-3 ring-amber-300 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full text-xs shadow-xs">
            ⭐
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {FEATURED_DONOR.name}
            </h4>
            <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Hero of the Week
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            {FEATURED_DONOR.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] text-amber-900 font-semibold">{FEATURED_DONOR.impact}</p>
        </div>
        <span className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
          Recognize
        </span>
      </div>
    </div>
  );
}

export function LeaderboardWidget() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Award size={18} />
          </span>
          <div>
            <h3 className="font-bold text-sm text-slate-900">ShareBite Leaderboard</h3>
            <p className="text-[11px] text-slate-400">Top campus food donors</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          This Semester
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_LEADERBOARD.map((donor) => {
          const rankColors = {
            1: 'bg-amber-400 text-white shadow-xs',
            2: 'bg-slate-300 text-slate-800',
            3: 'bg-amber-700 text-white',
          };

          return (
            <div
              key={donor.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    rankColors[donor.rank] || 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {donor.rank}
                </span>

                <img
                  src={donor.avatar}
                  alt={donor.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                    {donor.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{donor.hostel}</p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-xs font-extrabold text-slate-900">
                  {donor.mealsShared}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">meals</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Heart size={12} className="text-red-500 fill-red-500" /> Powered by students
        </span>
        <span className="font-semibold text-emerald-700 hover:underline cursor-pointer">
          Campus Food Heroes &rarr;
        </span>
      </div>
    </div>
  );
}
