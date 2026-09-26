import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user?.name}!</h2>
        <p className="text-gray-500 mb-8">Welcome to your personal SkinCare AI dashboard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Your Profile</h3>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li><strong>Name:</strong> {user?.name}</li>
              <li><strong>Email:</strong> {user?.email}</li>
              <li><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex flex-col justify-center items-center text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Your Skincare Plan</h3>
            <p className="text-sm text-purple-800 mb-4">Access your personalized routine or retake the assessment.</p>
            <div className="flex flex-col w-full px-4 sm:px-8 space-y-3">
              <Link to="/skin-journey" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full transition duration-300 shadow-sm">
                My Skin Journey 🚀
              </Link>
              <Link to="/recommendations" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition duration-300">
                View My Routine
              </Link>
              <Link to="/analyze" className="bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 font-medium py-2 px-6 rounded-full transition duration-300">
                Analyze My Skin
              </Link>
              <Link to="/photo-analysis" className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-medium py-2 px-6 rounded-full transition duration-300">
                Analyze Skin Photo 📸
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
