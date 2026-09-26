import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const SkinAnalysisHistoryDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/skin-analysis/${id}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch analysis details.');
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Assessment Details</h1>
          <p className="text-gray-500">Date: {new Date(data.completedAt).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Skin Profile</h3>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-900 mb-2"><strong>Type:</strong> {data.skinType}</p>
              <p className="text-sm text-indigo-900 mb-2"><strong>Sensitivity:</strong> {data.sensitivity}</p>
              <p className="text-sm text-indigo-900"><strong>Concerns:</strong> {data.concerns.join(', ')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Score Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hydration</span>
                <span className="font-medium">{data.scores?.hydration || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Oiliness</span>
                <span className="font-medium">{data.scores?.oiliness || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sensitivity</span>
                <span className="font-medium">{data.scores?.sensitivity || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisHistoryDetail;
