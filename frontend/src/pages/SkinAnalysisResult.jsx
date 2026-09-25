import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SkinAnalysisResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/skin-analysis/latest');
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-indigo-600 text-lg font-medium">Loading your profile...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
          {error || 'No analysis found.'}
        </div>
        <Link to="/analyze" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700">
          Take Assessment
        </Link>
      </div>
    );
  }

  // Capitalize helpers
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Your Probable Skin Profile</h1>
        <p className="text-gray-500">Based on your answers, here is our AI-assisted assessment of your skin.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Primary Skin Type */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex flex-col items-center justify-center text-center">
              <span className="text-indigo-500 font-semibold mb-2 uppercase tracking-wide text-sm">Primary Type</span>
              <h2 className="text-3xl font-bold text-indigo-900">{capitalize(result.skinType)}</h2>
            </div>

            {/* Sensitivity */}
            <div className={`rounded-xl p-6 border flex flex-col items-center justify-center text-center ${result.sensitivity === 'sensitive' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <span className={`font-semibold mb-2 uppercase tracking-wide text-sm ${result.sensitivity === 'sensitive' ? 'text-rose-500' : 'text-emerald-500'}`}>Sensitivity</span>
              <h2 className={`text-3xl font-bold ${result.sensitivity === 'sensitive' ? 'text-rose-900' : 'text-emerald-900'}`}>
                {capitalize(result.sensitivity)}
              </h2>
            </div>
          </div>

          {/* Concerns */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detected Concerns</h3>
            {result.concerns && result.concerns.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {result.concerns.map(c => (
                  <span key={c} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No major concerns reported.</p>
            )}
          </div>
          
          <div className="mt-8 text-gray-600 text-sm leading-relaxed">
            <p>
              Your profile suggests you have a <strong>{result.skinType}</strong> skin type with <strong>{result.sensitivity}</strong> characteristics. 
              Understanding your skin type is the first step toward a healthy, glowing complexion. 
              In the future, we will provide a personalized skincare routine tailored specifically to these findings.
            </p>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center">
            <span className="mr-2">⚠️</span> 
            Disclaimer: This questionnaire provides a general skincare profile and is not a medical diagnosis. Please consult a dermatologist for medical concerns.
          </p>
        </div>
      </div>

      <div className="text-center space-y-4 flex flex-col items-center">
        <Link to="/recommendations" className="bg-indigo-600 text-white font-medium py-3 px-8 rounded-full shadow-sm hover:bg-indigo-700 transition w-full sm:w-auto">
          View My Personalized Routine
        </Link>
        <Link to="/dashboard" className="text-gray-500 font-medium hover:text-gray-800 transition block">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SkinAnalysisResult;
