import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const SkinJourney = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await api.get('/skin-journey');
        setData(response.data);
      } catch (err) {
        const msg = 'Failed to fetch skin journey.';
        setError(msg);
        showToast(msg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) return <div className="text-center py-20">Loading your journey...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  const { latestSkinAnalysis, assessmentHistory, photoHistory } = data;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Skin Journey</h1>
      
      {/* Current Skin Profile */}
      <section className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Skin Profile</h2>
        {latestSkinAnalysis ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Latest Assessment: {new Date(latestSkinAnalysis.completedAt).toLocaleDateString()}</p>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">{latestSkinAnalysis.skinType} Skin</h3>
              <p className="text-md text-gray-700 mb-1">Sensitivity: {latestSkinAnalysis.sensitivity}</p>
              <p className="text-md text-gray-700 mb-4">Concerns: {latestSkinAnalysis.concerns.join(', ')}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <Link to="/recommendations" className="text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full transition shadow-sm">
                View Current Routine
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-4">Complete your skin assessment to build your profile.</p>
            <Link to="/analyze" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition shadow-sm">
              Analyze My Skin
            </Link>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assessment History */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Assessment History</h2>
          {assessmentHistory?.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {assessmentHistory.map((item) => (
                <div key={item._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-3 sm:mb-0">
                    <p className="text-sm text-gray-500 mb-1">{new Date(item.completedAt).toLocaleDateString()}</p>
                    <p className="font-semibold text-gray-800">{item.skinType}</p>
                    <p className="text-xs text-gray-600">Sens: {item.sensitivity} | {item.concerns.length} Concerns</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/skin-journey/skin/${item._id}`)}
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
              No skin assessments yet.
              <div className="mt-4">
                <Link to="/analyze" className="text-indigo-600 font-medium hover:underline">Take one now</Link>
              </div>
            </div>
          )}
        </section>

        {/* Photo Analysis History */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Photo Analysis History</h2>
          {photoHistory?.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {photoHistory.map((item) => (
                <div key={item._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-3 sm:mb-0">
                    <p className="text-sm text-gray-500 mb-1">{new Date(item.analyzedAt).toLocaleDateString()}</p>
                    <p className="font-semibold text-gray-800">Quality: {item.imageQuality?.usable ? 'Good' : 'Poor'}</p>
                    <p className="text-xs text-gray-600">
                      Face: {item.faceDetected ? 'Yes' : 'No'} | Obs: {item.observations?.length || 0}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/skin-journey/photo/${item._id}`)}
                    className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
              No photo analyses yet.
              <div className="mt-4">
                <Link to="/photo-analysis" className="text-purple-600 font-medium hover:underline">Analyze a photo</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SkinJourney;
