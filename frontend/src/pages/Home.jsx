import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Discover Your True <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Skin Profile</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        Take our AI-powered assessment to understand your skin type and get a personalized skincare routine designed just for you.
      </p>
      <Link to="/analyze" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:-translate-y-1">
        Start Assessment
      </Link>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 text-xl">📝</div>
          <h3 className="font-semibold text-lg mb-2">Smart Questionnaire</h3>
          <p className="text-gray-500 text-sm">Answer simple questions about how your skin feels and behaves daily.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">📸</div>
          <h3 className="font-semibold text-lg mb-2">AI Photo Analysis</h3>
          <p className="text-gray-500 text-sm">Upload a photo for a completely private, AI-assisted visual check.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mb-4 text-xl">✨</div>
          <h3 className="font-semibold text-lg mb-2">Personalized Routine</h3>
          <p className="text-gray-500 text-sm">Get tailored ingredient and product category recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
