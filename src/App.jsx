import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostFood from './pages/PostFood';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#faf7f2] text-gray-900 font-sans flex flex-col">
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1f3d2b',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }} 
          />
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Food feed */}
              <Route path="/feed" element={<Home />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Food and dashboard (Protected) */}
              <Route
                path="/post-food"
                element={
                  <ProtectedRoute>
                    <PostFood />
                  </ProtectedRoute>
                }
              />
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
      </Router>
    </AuthProvider>
  );
}

export default App;