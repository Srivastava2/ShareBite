import React from 'react';
// If using react-router-dom, import Link to route to your login/signup or feed
// import { Link } from 'react-router-dom'; 

function HandoffIllustration() {
  return (
    <svg
      viewBox="0 0 600 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label="Illustration of one person handing a bowl of food to another person"
    >
      {/* Soft background blobs */}
      <ellipse cx="180" cy="430" rx="150" ry="28" fill="#DCFCE7" />
      <ellipse cx="420" cy="440" rx="150" ry="28" fill="#FFEDD5" />
      <circle cx="300" cy="230" r="210" fill="#F0FDF4" />

      {/* Dashed motion arc from giver to receiver */}
      <path
        d="M 235 220 Q 300 160 365 220"
        fill="none"
        stroke="#86EFAC"
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* Floating leaf, top left */}
      <g transform="translate(90,90) rotate(-15)">
        <path d="M0 20 C 0 4, 16 -6, 30 0 C 24 16, 8 24, 0 20 Z" fill="#4ADE80" />
        <line x1="1" y1="19" x2="18" y2="6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Floating location pin, top right */}
      <g transform="translate(480,110)">
        <path
          d="M0 0 C 14 0, 24 10, 24 22 C 24 38, 0 58, 0 58 C 0 58, -24 38, -24 22 C -24 10, -14 0, 0 0 Z"
          fill="#FDBA74"
        />
        <circle cx="0" cy="22" r="8" fill="#FFF7ED" />
      </g>

      {/* ---- Left figure: giver ---- */}
      <g>
        {/* legs */}
        <rect x="150" y="340" width="20" height="70" rx="10" fill="#166534" />
        <rect x="188" y="340" width="20" height="70" rx="10" fill="#166534" />
        {/* body */}
        <path
          d="M140 260 C140 220, 170 200, 200 210 C 226 218, 236 250, 230 300 L 220 350 L 158 350 L 148 300 Z"
          fill="#22C55E"
        />
        {/* extended arm holding basket */}
        <path
          d="M222 250 C 250 252, 268 262, 278 278"
          fill="none"
          stroke="#22C55E"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* head */}
        <circle cx="182" cy="182" r="34" fill="#F4C89B" />
        {/* simple hair */}
        <path d="M150 176 C 150 148, 214 148, 214 176 C 200 166, 164 166, 150 176 Z" fill="#5B3A29" />
      </g>

      {/* Basket being passed */}
      <g transform="translate(300,270)">
        <path d="M-38 0 L38 0 L28 34 C 18 42, -18 42, -28 34 Z" fill="#B45309" />
        <path d="M-38 0 L38 0 L34 -10 L-34 -10 Z" fill="#D97706" />
        <path d="M-20 -10 C -20 -30, 20 -30, 20 -10" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
        {/* food peeking out */}
        <circle cx="-10" cy="-18" r="12" fill="#EF4444" />
        <circle cx="12" cy="-20" r="11" fill="#FACC15" />
        <circle cx="2" cy="-28" r="10" fill="#84CC16" />
      </g>

      {/* ---- Right figure: receiver, open hands ---- */}
      <g>
        {/* legs */}
        <rect x="400" y="340" width="20" height="70" rx="10" fill="#9A3412" />
        <rect x="438" y="340" width="20" height="70" rx="10" fill="#9A3412" />
        {/* body */}
        <path
          d="M388 260 C 384 220, 412 200, 442 208 C 470 216, 480 250, 474 300 L 466 350 L 402 350 L 392 300 Z"
          fill="#FB923C"
        />
        {/* extended arms receiving */}
        <path
          d="M394 258 C 366 258, 348 268, 336 282"
          fill="none"
          stroke="#FB923C"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* open hand */}
        <circle cx="330" cy="286" r="13" fill="#F4C89B" />
        {/* head */}
        <circle cx="432" cy="182" r="34" fill="#EBA36F" />
        {/* simple hair */}
        <path d="M400 172 C 404 144, 466 146, 464 174 C 448 162, 414 162, 400 172 Z" fill="#241C15" />
      </g>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1. Hero Section */}
      <section className="relative bg-green-50 pt-20 pb-28 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-6 border border-green-200">
              🌱 For College Campuses
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Rescue Food.<br /> 
              <span className="text-green-600">Stop Campus Waste.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              The student-to-student platform to share extra meals from events, club meetings, and cafeterias. Don't let good food end up in the trash.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Browse Campus Feed
              </button>
              <button className="px-8 py-3.5 bg-white text-green-700 border-2 border-green-200 hover:border-green-600 font-bold rounded-xl transition-all">
                Share Surplus Food
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 w-full max-w-lg relative z-10">
            <div className="aspect-square bg-gradient-to-tr from-green-200 to-green-50 rounded-full absolute -top-4 -right-4 -z-10 blur-3xl opacity-50"></div>
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-white p-6">
              <HandoffIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">How ShareBite Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Snap & Post</h3>
              <p className="text-gray-600">Have leftover catered food? Post a quick photo, quantity, and your campus location.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Claim Instantly</h3>
              <p className="text-gray-600">Students nearby see the live feed and can lock in a claim before the food expires.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Meet & Eat</h3>
              <p className="text-gray-600">Pick up the food, save money, and help divert perfectly good meals from the landfill.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA / Impact Section */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join hundreds of students already reducing food waste and sharing meals on campus.
          </p>
          <button className="px-10 py-4 bg-green-500 hover:bg-green-400 text-gray-900 font-extrabold rounded-xl shadow-lg transition-all text-lg">
            Create Your Free Account
          </button>
        </div>
      </section>

    </div>
  );
}