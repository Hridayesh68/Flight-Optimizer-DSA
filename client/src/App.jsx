import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

// Pages
import Home from './pages/Home';
import PlanFlight from './pages/PlanFlight';

// Auth & Dashboard
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MyTrips from './components/Dashboard/MyTrips';

// Icons
import { IoAirplaneOutline, IoPersonCircleOutline, IoLogOutOutline } from 'react-icons/io5';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Navigation header
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 font-bold text-xl hover:text-blue-800 transition-colors">
              <IoAirplaneOutline className="mr-2 text-2xl" /> Flight Route Optimizer
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/plan-flight" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md">Plan Flight</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 flex items-center">
                  <IoPersonCircleOutline className="mr-1 text-xl" /> Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <IoLogOutOutline className="mr-1 text-lg" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Wrapper Layout
const DashboardLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-500">Manage your saved routes.</p>
      </div>
      <MyTrips />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="pb-12 h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plan-flight" element={<PlanFlight />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
