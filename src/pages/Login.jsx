import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Photo credits (Unsplash License — free to use, no attribution required,
// credited here anyway as good practice):
//   Thali        — Zoshua Colah   (unsplash.com/@zoshuacolah)
//   Food donation — Anosh Ahmed   (unsplash.com/@anoshahmeddubai)
const IMG_THALI =
  'https://images.unsplash.com/photo-1742281257707-0c7f7e5ca9c6?w=1400&q=80&auto=format&fit=crop';
const IMG_DONATION =
  'https://images.unsplash.com/photo-1755599629285-91cc09a185c7?w=500&q=80&auto=format&fit=crop';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Expects backend response shape: { token, user: {...} }
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Wire up your OAuth flow here later, e.g.:
    // window.location.href = 'http://localhost:5000/api/auth/google';
    console.log('Google login not yet connected.');
  };

  return (
    <div className="min-h-screen flex bg-[#FBF8F1]">
      {/* Left branding panel — real food photography, hidden below lg */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-emerald-950">
        {/* Main background photo */}
        <img
          src={IMG_THALI}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay so text stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur text-lg font-bold">
              🌿
            </span>
            <span className="text-xl font-semibold tracking-tight">ShareBite</span>
          </Link>

          {/* Floating photo — food donation, layered over the main thali
              background with a subtle float animation */}
          <div className="relative h-40 xl:h-48 my-6">
            <img
              src={IMG_DONATION}
              alt="Volunteers packing boxes of food for donation"
              className="motion-safe:animate-[float_5s_ease-in-out_infinite] absolute left-1/2 -translate-x-1/2 top-2 h-32 w-56 xl:h-36 xl:w-64 rounded-2xl object-cover shadow-2xl ring-1 ring-white/20 -rotate-2 transition-transform hover:scale-105 hover:rotate-0"
            />
          </div>

          <div className="max-w-md">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200/80 mb-4">
              Good food deserves another chance
            </p>
            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.15] mb-5">
              Share food.
              <br />
              Reduce waste.
              <br />
              Make an impact.
            </h1>
            <p className="text-emerald-50/80 text-base leading-relaxed">
              Every meal shared on ShareBite is one less meal wasted — and one
              more person fed, nearby, today.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-white">12,400+</p>
              <p className="text-emerald-200/70">Meals shared</p>
            </div>
            <div className="h-9 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold text-white">4,000+</p>
              <p className="text-emerald-200/70">Community members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white text-lg">
              🌿
            </span>
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              ShareBite
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Share food. Reduce waste. Make an impact.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.243L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                  />
                </svg>
              )}
              {submitting ? 'Logging in…' : 'Log In'}
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google login — neutral monogram icon, not a reproduction of
                any brand's official logo artwork */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                G
              </span>
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}