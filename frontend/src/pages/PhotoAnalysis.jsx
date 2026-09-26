import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const PhotoAnalysis = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setResult(null);

    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        const msg = 'Please select a valid image file (JPEG or PNG).';
        setError(msg);
        showToast(msg, 'warning');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        const msg = 'File size must be less than 5MB.';
        setError(msg);
        showToast(msg, 'warning');
        return;
      }
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Assuming api is configured with axios
      const res = await api.post('/photo-analysis/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
      if (res.data.success) {
        showToast('Photo analyzed successfully!', 'success');
      } else {
        showToast(res.data.message || 'Analysis completed with warnings', 'warning');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to analyze photo. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Analyze Your Skin Photo</h1>
        <p className="text-gray-500 mb-2">Upload a clear, front-facing photo of your face for AI-assisted visual observations.</p>
        <p className="text-xs font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-full border border-indigo-100">
          🔒 Your uploaded photo is processed temporarily for analysis. The photo itself is not stored.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Photo</h2>
          
          {!preview ? (
            <button 
              type="button"
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload a photo"
            >
              <span className="text-4xl mb-4" aria-hidden="true">📸</span>
              <p className="text-sm font-medium text-indigo-600 mb-1">Click to upload a photo</p>
              <p className="text-xs text-gray-500">JPEG or PNG, max 5MB</p>
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-w-sm mb-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium text-gray-700 truncate max-w-full px-4 mb-4">{file.name}</p>
              
              <div className="flex w-full space-x-4">
                <button 
                  onClick={handleClear}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Clear
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Analyzing...' : 'Analyze Photo'}
                </button>
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png" 
            className="hidden" 
          />

          {error && (
            <div className="mt-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Analysis Results</h2>
          
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm">Upload and analyze a photo to see results here.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-indigo-600 animate-pulse">Processing image securely...</p>
            </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col space-y-6">
              
              {/* Quality & Detection Status */}
              <div className="flex gap-2">
                <div className={`flex-1 p-3 rounded-lg text-center border text-sm font-medium ${result.imageQuality?.usable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  Photo Quality: {result.imageQuality?.usable ? 'Good' : 'Poor'}
                </div>
                <div className={`flex-1 p-3 rounded-lg text-center border text-sm font-medium ${result.faceDetected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  Face Detected: {result.faceDetected ? 'Yes' : 'No'}
                </div>
              </div>

              {!result.success && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium">
                  {result.message}
                </div>
              )}

              {result.success && result.observations?.length > 0 && (
                <div className="space-y-3 flex-1">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Visual Observations</h3>
                  {result.observations.map((obs, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start">
                      <span className="text-xl mr-3">{obs.type === 'visible_shine' ? '✨' : obs.type === 'texture_variation' ? '〰️' : '🎨'}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{obs.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600 mt-1">{obs.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.success && result.observations?.length === 0 && (
                <div className="text-sm text-gray-600 italic">No significant variations detected.</div>
              )}

              {/* Disclaimer */}
              {result.disclaimer && (
                <div className="mt-auto pt-6">
                  <p className="text-xs text-gray-500 text-center flex items-center justify-center bg-gray-100 p-3 rounded-lg border border-gray-200">
                    <span className="mr-2 text-base">⚠️</span> 
                    {result.disclaimer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link to="/dashboard" className="text-indigo-600 font-medium hover:text-indigo-800 transition">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PhotoAnalysis;
