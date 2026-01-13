import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Placeholders for now, will create next
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Login />; // Or Redirect
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gigs/:id"
            element={<GigDetails />} // Publicly viewable? Yes, but bidding is protected.
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
