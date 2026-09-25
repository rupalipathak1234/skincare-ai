import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Recommendations = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await api.get('/recommendations/latest');
        setRecommendation(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('No skin analysis found. Please complete the questionnaire first.');
        } else {
          setError(err.response?.data?.message || 'Failed to load recommendations.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-indigo-600 text-lg font-medium animate-pulse">Generating your personalized routine...</div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
          {error}
        </div>
        <Link to="/analyze" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700">
          Analyze My Skin
        </Link>
      </div>
    );
  }

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const RoutineStep = ({ step }) => (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm mb-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
        {step.step}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{step.title}</h4>
        <p className="text-sm text-gray-700 mt-1">{step.description}</p>
        <p className="text-xs text-gray-500 mt-2 italic">{step.reason}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Personalized Routine</h1>
        <p className="text-gray-500">Tailored to your unique skin profile.</p>
      </div>

      {/* Profile Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-10 border border-indigo-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 block mb-1">Probable Skin Profile</span>
          <div className="font-bold text-gray-900 text-lg">
            {capitalize(recommendation.skinType)} &bull; {capitalize(recommendation.sensitivity)}
          </div>
        </div>
        <div className="sm:text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 block mb-1">Main Concerns</span>
          <div className="font-medium text-gray-800 text-sm">
            {recommendation.concerns.length > 0 ? recommendation.concerns.map(capitalize).join(' • ') : 'None'}
          </div>
        </div>
      </div>

      {/* Morning Routine */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">☀️</span>
          <h2 className="text-xl font-bold text-gray-900">Morning Routine</h2>
        </div>
        <div className="pl-2">
          {recommendation.morning.map(step => <RoutineStep key={step.step} step={step} />)}
        </div>
      </div>

      {/* Evening Routine */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🌙</span>
          <h2 className="text-xl font-bold text-gray-900">Evening Routine</h2>
        </div>
        <div className="pl-2">
          {recommendation.evening.map(step => <RoutineStep key={step.step} step={step} />)}
        </div>
      </div>

      {/* Weekly Care */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🗓️</span>
          <h2 className="text-xl font-bold text-gray-900">Optional / Weekly Care</h2>
        </div>
        <div className="pl-2">
          {recommendation.weekly.map(step => <RoutineStep key={step.step} step={step} />)}
        </div>
      </div>

      {/* Skin Notes */}
      {recommendation.notes.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 mb-10 border border-amber-100">
          <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center">
            <span className="mr-2">💡</span> Skin Notes
          </h3>
          <ul className="space-y-2 text-sm text-amber-800 list-disc pl-5">
            {recommendation.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center">
          <span className="mr-2">⚠️</span> 
          Disclaimer: This routine provides general skincare information and is not a medical diagnosis or medical treatment plan.
        </p>
      </div>

    </div>
  );
};

export default Recommendations;
