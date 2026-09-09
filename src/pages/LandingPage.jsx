import React from 'react';
import { useNavigate } from 'react-router-dom';

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap');

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes drift-in {
  0% { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}
.sb-serif { font-family: 'Fraunces', serif; }
.sb-sans { font-family: 'Inter', sans-serif; }
.sb-hand { font-family: 'Caveat', cursive; }
.sb-ticker-track {
  animation: ticker-scroll 26s linear infinite;
}
.sb-drift {
  animation: drift-in 0.7s ease-out both;
}
.sb-pin {
  box-shadow: 0 10px 20px -8px rgba(36,33,27,0.35);
}
.sb-pin::before {
  content: '';
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: radial-gradient(circle at 35% 30%, #e7c27a, #b5482f 70%);
  box-shadow: 0 3px 4px rgba(0,0,0,0.35);
}
`;

function Pin({ className = '' }) {
  return (
    <span
      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 30%, #e7c27a, #b5482f 70%)',
        boxShadow: '0 3px 4px rgba(0,0,0,0.35)',
      }}
    />
  );
}

function TapeStrip({ className = '' }) {
  return (
    <span
      className={`absolute h-6 w-20 bg-[#f3ead8]/70 border border-white/40 ${className}`}
      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.12)' }}
    />
  );
}

function PinnedPhoto({ src, alt, caption, tag, rotate = '-rotate-2', size = 'aspect-[4/5]' }) {
  return (
    <div className={`relative ${rotate} sb-drift`}>
      <Pin />
      <div className="bg-white p-3 pb-5 rounded-sm sb-pin">
        <div className={`${size} w-full overflow-hidden bg-[#e7ddc6]`}>
          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <p className="sb-hand text-[#3a2f1f] text-xl mt-2 leading-none">{caption}</p>
        {tag && (
          <span className="inline-block mt-2 text-[10px] tracking-wide font-semibold text-[#fdf8ec] bg-[#1f3d2b] px-2 py-1 rounded-sm">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

function StepCard({ number, title, body, src, alt, rotate }) {
  return (
    <div className={`relative ${rotate} sb-drift`}>
      <Pin />
      <div className="bg-white rounded-sm sb-pin p-3 pb-6">
        <div className="aspect-[5/4] w-full overflow-hidden bg-[#e7ddc6] mb-4">
          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex items-start gap-3 px-1">
          <span className="sb-serif text-3xl text-[#b5482f] leading-none pt-1">{number}</span>
          <div>
            <h3 className="sb-serif text-xl font-semibold text-[#1f3d2b] mb-1">{title}</h3>
            <p className="sb-sans text-[#4a4436] text-sm leading-relaxed">{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TICKER_ITEMS = [
  '12,400 meals reclaimed this year',
  '86 campus organizations posting',
  '3 minutes: average time to claim',
  '9 tons of food kept out of the landfill',
];

export default function LandingPage() {
  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf3e4] sb-sans text-[#24211b]">
      <style>{FONT_IMPORT}</style>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#24211b 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="sb-drift">
              <span className="inline-block text-xs font-semibold tracking-wide text-[#1f3d2b] bg-[#d9c98f]/60 border border-[#1f3d2b]/15 rounded-full px-3 py-1 mb-6">
                Built for college campuses
              </span>
              <h1 className="sb-serif text-5xl lg:text-6xl font-semibold text-[#1f3d2b] leading-[1.05] mb-6">
                Extra food finds
                <br />
                a home, not a bin.
              </h1>
              <p className="text-lg text-[#4a4436] mb-9 max-w-md leading-relaxed">
                ShareBite is the noticeboard for leftover meals — from club events, cafeterias,
                and dorm kitchens — that gets posted, claimed, and eaten before it ever hits the trash.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/feed')}
                  className="px-7 py-3.5 bg-[#1f3d2b] hover:bg-[#16301f] text-[#faf3e4] font-semibold rounded-sm transition-colors cursor-pointer"
                >
                  Browse campus feed
                </button>
                <button 
                  onClick={() => navigate('/post-food')}
                  className="px-7 py-3.5 bg-transparent border-2 border-[#1f3d2b] text-[#1f3d2b] hover:bg-[#1f3d2b] hover:text-[#faf3e4] font-semibold rounded-sm transition-colors cursor-pointer"
                >
                  Share surplus food
                </button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end sb-drift" style={{ animationDelay: '0.15s' }}>
              <div className="relative rotate-2 max-w-sm w-full">
                <Pin className="scale-125" />
                <div className="bg-white p-3 pb-6 rounded-sm sb-pin">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#e7ddc6]">
                    <img
                      src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                      alt="A sealed food box being handed off for pickup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="sb-hand text-2xl text-[#3a2f1f] mt-3">sealed up, ready to go</p>
                </div>
                <TapeStrip className="-top-3 left-8 -rotate-6" />
                <TapeStrip className="-bottom-3 right-6 rotate-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-[#1f3d2b] py-4 overflow-hidden border-y-4 border-[#d9a441]">
        <div className="flex whitespace-nowrap sb-ticker-track w-max">
          {tickerLoop.map((item, i) => (
            <span key={i} className="flex items-center text-[#faf3e4] sb-serif text-lg px-8">
              {item}
              <span className="mx-8 w-1.5 h-1.5 rounded-full bg-[#d9a441] inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-[#faf3e4]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16 sb-drift">
            <h2 className="sb-serif text-4xl font-semibold text-[#1f3d2b] mb-4">
              Pin it, claim it, eat it
            </h2>
            <p className="text-[#4a4436] text-lg leading-relaxed">
              Three steps, same as posting a flyer on the board outside the dining hall —
              except this one updates in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 pt-6">
            <StepCard
              number="01"
              title="Snap & post"
              body="Have leftover catered food? Photograph it, note the quantity, and drop a pin at your campus location."
              src="https://images.unsplash.com/photo-1651525669944-00de65d3b8a5?fm=jpg&q=80&w=900&auto=format&fit=crop"
              alt="A crate of apples checked and ready to be packed"
              rotate="-rotate-2"
            />
            <StepCard
              number="02"
              title="Claim instantly"
              body="Nearby students see the live board and can lock in a claim before the window closes."
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?fm=jpg&q=80&w=900&auto=format&fit=crop"
              alt="Packed food boxes staged for delivery"
              rotate="rotate-1"
            />
            <StepCard
              number="03"
              title="Meet & eat"
              body="Swing by, grab your share, and help keep a perfectly good meal out of the landfill."
              src="https://images.unsplash.com/photo-1614018453562-77f6180ce036?fm=jpg&q=80&w=900&auto=format&fit=crop"
              alt="A sealed food box delivered to the door"
              rotate="-rotate-1"
            />
          </div>
        </div>
      </section>

      {/* Corkboard gallery */}
      <section id="board" className="py-24 px-6 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#c9a66b',
            backgroundImage:
              'radial-gradient(rgba(36,33,27,0.14) 1.5px, transparent 1.5px), radial-gradient(rgba(36,33,27,0.08) 1px, transparent 1px)',
            backgroundSize: '26px 26px, 13px 13px',
            backgroundPosition: '0 0, 6px 6px',
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-xl mb-16 sb-drift">
            <h2 className="sb-serif text-4xl font-semibold text-[#fdf8ec] mb-4">
              What's on the board this week
            </h2>
            <p className="text-[#fdf8ec]/85 text-lg leading-relaxed">
              A running snapshot of what students nearby have posted — real portions, real
              pickup windows, gone within the hour.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1449247666642-264389f5f5b1?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="A food box packed and labeled for pickup"
              caption="packed and labeled"
              tag="Ready to go"
              rotate="-rotate-3"
            />
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1593113630400-ea4288922497?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="Boxes loaded up for delivery"
              caption="loaded up for delivery"
              tag="In transit"
              rotate="rotate-2"
            />
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1651525669944-00de65d3b8a5?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="A crate of produce checked for quality before packing"
              caption="quality checked, packed fresh"
              tag="QA passed"
              rotate="-rotate-1"
            />
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="Volunteers sorting a food donation drive"
              caption="donation drive, packed today"
              tag="Donation post"
              rotate="rotate-3"
            />
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1562709902-31c9a3b1ad5c?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="Two people sharing a box of fresh fruit"
              caption="shared with a neighbor"
              tag="Given away"
              rotate="-rotate-2"
            />
            <PinnedPhoto
              src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?fm=jpg&q=80&w=800&auto=format&fit=crop"
              alt="Boxes of donated food ready for pickup"
              caption="packed and ready for pickup"
              tag="Ready for pickup"
              rotate="rotate-1"
            />
          </div>
        </div>
      </section>

      {/* 3. Real Impact Section */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 w-full max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1755599629285-91cc09a185c7?w=900&q=80&auto=format&fit=crop"
              alt="Volunteers packing boxes of food for donation"
              className="rounded-3xl shadow-2xl object-cover w-full h-80 border-4 border-white"
            />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Real food, reaching real people</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0">
              Every listing on ShareBite is surplus food that would otherwise be thrown away — packed up and handed to someone nearby instead of a landfill.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-green-700">12,400+</p>
                <p className="text-gray-500">Meals shared</p>
              </div>
              <div className="h-9 w-px bg-green-200" />
              <div>
                <p className="text-2xl font-bold text-green-700">4,000+</p>
                <p className="text-gray-500">Community members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join hundreds of students already reducing food waste and sharing meals on campus.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-[#d9a441] hover:bg-[#c99530] text-[#1f3d2b] font-bold rounded-sm transition-colors text-lg"
          >
            Create your free account
          </button>
        </div>
      </section>

      <footer className="bg-[#16301f] text-[#fdf8ec]/60 text-sm py-8 px-6 text-center">
        ShareBite &middot; built by students, for students
      </footer>
    </div>
  );
}