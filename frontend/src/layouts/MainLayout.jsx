import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">SkinCare AI</Link>
          <nav>
            <ul className="flex items-center space-x-6">
              <li><Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">Home</Link></li>
              {user ? (
                <>
                  <li><Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition">Dashboard</Link></li>
                  <li>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">Sign In</Link></li>
                  <li>
                    <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
                      Get Started
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-100 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SkinCare AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
