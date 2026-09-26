import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const PhotoAnalysisHistoryDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/photo-analysis/${id}`);
        setData(response.data);
      } catch (err) {
        const msg = 'Failed to fetch photo analysis details.';
        setError(msg);
        showToast(msg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link to="/skin-journey" className="text-indigo-600 font-medium hover:underline mb-6 inline-block">
        &larr; Back to Journey
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Photo Analysis Details</h1>
          <p className="text-gray-500">Date: {new Date(data.analyzedAt).toLocaleString()}</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className={`flex-1 p-3 rounded-lg text-center border text-sm font-medium ${data.imageQuality?.usable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            Photo Quality: {data.imageQuality?.usable ? 'Good' : 'Poor'}
          </div>
          <div className={`flex-1 p-3 rounded-lg text-center border text-sm font-medium ${data.faceDetected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            Face Detected: {data.faceDetected ? 'Yes' : 'No'}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-4">Visual Observations</h3>
        {data.observations && data.observations.length > 0 ? (
          <div className="space-y-4">
            {data.observations.map((obs, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-semibold text-gray-900 capitalize mb-1">{obs.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">{obs.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 italic">
            No significant variations detected or image was unusable.
          </div>
        )}

        {data.message && !data.imageQuality?.usable && (
          <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium">
            Note: {data.message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start">
            <span className="mr-2 text-base">🔒</span> 
            Privacy Note: The original photo was analyzed temporarily and was not permanently stored. This record only contains the text-based results of that analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysisHistoryDetail;
