import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Temporary placeholder components
const PostFood = () => (
  <div className="p-8 text-center text-2xl font-bold">
    Post Food Form 🍲
  </div>
);

const Dashboard = () => (
  <div className="p-8 text-center text-2xl font-bold">
    My Claims & Shared 📊
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />

          <main>
            <Routes>
              {/* Public landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Food feed */}
              <Route path="/feed" element={<Home />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Food and dashboard */}
              <Route path="/post-food" element={<PostFood />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;