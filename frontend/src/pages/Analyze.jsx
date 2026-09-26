import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const questions = [
  {
    id: 'q1',
    title: 'Face wash ke 1–2 hours baad skin kaisi feel hoti hai?',
    options: ['Very oily / shiny', 'Comfortable', 'Tight / stretched', 'T-zone oily but cheeks normal/dry'],
    type: 'single'
  },
  {
    id: 'q2',
    title: 'Din ke beech mein face kitna oily hota hai?',
    options: ['Very oily', 'Slightly oily', 'Mostly normal', 'Almost never oily'],
    type: 'single'
  },
  {
    id: 'q3',
    title: 'Face wash ke baad skin?',
    options: ['Tight/dry', 'Comfortable', 'T-zone oily', 'Irritated/burning'],
    type: 'single'
  },
  {
    id: 'q4',
    title: 'Cheeks generally kaise hote hain?',
    options: ['Dry/flaky', 'Normal', 'Oily', 'Kabhi dry, kabhi oily'],
    type: 'single'
  },
  {
    id: 'q5',
    title: 'T-zone (forehead + nose) kaisa hota hai?',
    options: ['Very oily', 'Slightly oily', 'Normal', 'Dry'],
    type: 'single'
  },
  {
    id: 'q6',
    title: 'Pimples kitni frequently hote hain?',
    options: ['Rarely', 'Occasionally', 'Frequently', 'Very frequently'],
    type: 'single'
  },
  {
    id: 'q7',
    title: 'Skin products lagane ke baad irritation hoti hai?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently'],
    type: 'single'
  },
  {
    id: 'q8',
    title: 'Skin mein redness/stinging easily hoti hai?',
    options: ['Never', 'Sometimes', 'Often', 'Very easily'],
    type: 'single'
  },
  {
    id: 'q9',
    title: 'Skin flakes / rough patches?',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Never'],
    type: 'single'
  },
  {
    id: 'q10',
    title: 'Current main concern kya hai?',
    options: ['Acne', 'Oiliness', 'Dryness', 'Redness', 'Dark spots', 'Uneven texture', 'Dullness', 'None'],
    type: 'multiple'
  }
];

const Analyze = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentQ = questions[currentStep];

  const handleOptionClick = (option) => {
    if (currentQ.type === 'single') {
      setAnswers({ ...answers, [currentQ.id]: option });
    } else {
      // Multiple select
      const currentSelections = answers[currentQ.id];
      if (option === 'None') {
        setAnswers({ ...answers, [currentQ.id]: ['None'] });
      } else {
        let newSelections = currentSelections.filter(o => o !== 'None');
        if (newSelections.includes(option)) {
          newSelections = newSelections.filter(o => o !== option);
        } else {
          newSelections.push(option);
        }
        setAnswers({ ...answers, [currentQ.id]: newSelections });
      }
    }
  };

  const isCurrentAnswered = () => {
    const ans = answers[currentQ.id];
    if (currentQ.type === 'single') return ans !== '';
    return ans.length > 0;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentAnswered()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/skin-analysis/questionnaire', { answers });
      navigate('/analyze/result');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit questionnaire';
      setError(msg);
      showToast(msg, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Question {currentStep + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-indigo-600">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* Question Area */}
        <div className="min-h-[300px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.title}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = currentQ.type === 'single' 
                ? answers[currentQ.id] === option 
                : answers[currentQ.id].includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex-shrink-0 mr-3 border flex items-center justify-center ${currentQ.type === 'single' ? 'rounded-full' : 'rounded'} ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                      {isSelected && <span className="w-2 h-2 bg-white rounded-sm"></span>}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitting}
            className="px-6 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Previous
          </button>
          
          {currentStep === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentAnswered() || isSubmitting}
              className="px-8 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition"
            >
              {isSubmitting ? 'Analyzing...' : 'Submit Answers'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered()}
              className="px-8 py-2 rounded-full font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Analyze;
