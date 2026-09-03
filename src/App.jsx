import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

const Home = () => <div className="p-8 text-center text-2xl font-bold">Food Feed 🍕</div>;
//const Register = () => <div className="p-8 text-center text-2xl font-bold">Register Page 📝</div>;
const PostFood = () => <div className="p-8 text-center text-2xl font-bold">Post Food Form 🍲</div>;
const Dashboard = () => <div className="p-8 text-center text-2xl font-bold">My Claims & Shared 📊</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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