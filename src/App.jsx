import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostFood from './pages/PostFood';
import Dashboard from './pages/Dashboard';
import EventListings from './pages/EventListings';
import ProtectedRoute from './components/common/ProtectedRoute';

function AppLayout() {
  const location = useLocation();
  // Only show the old public Navbar on public landing/auth pages
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen ${isPublicPage ? 'bg-[#faf7f2] text-gray-900' : 'bg-[#F6F8FA] text-slate-900'} font-sans flex flex-col`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0F172A',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }} 
      />

      {isPublicPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Campus Food feed */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Event & Catering Surplus */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventListings />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Post Food */}
          <Route
            path="/post-food"
            element={
              <ProtectedRoute>
                <PostFood />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;