import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage'; // Import the new Landing Page
import Home from './pages/Home';               // Home is now your Feed

// Temporary placeholder components so the router doesn't crash
// We will replace these with real files in the next phases!
const Login = () => <div className="p-8 text-center text-2xl font-bold">Login Page 🔐</div>;
const Register = () => <div className="p-8 text-center text-2xl font-bold">Register Page 📝</div>;
const PostFood = () => <div className="p-8 text-center text-2xl font-bold">Post Food Form 🍲</div>;
const Dashboard = () => <div className="p-8 text-center text-2xl font-bold">My Claims & Shared 📊</div>;

function App() {
  return (
    <Router>
      {/* 
        Note: We removed the max-w-7xl and padding wrapper from the main layout 
        here so the LandingPage hero section can stretch full width. 
        You can add that padding back inside the Home/Feed component later.
      */}
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        
        <main>
          <Routes>
            {/* The public marketing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* The logged-in application feed */}
            <Route path="/feed" element={<Home />} />
            
            {/* Auth and Utility Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-food" element={<PostFood />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;