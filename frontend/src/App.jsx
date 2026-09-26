import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import SkinAnalysisResult from './pages/SkinAnalysisResult';
import Recommendations from './pages/Recommendations';
import PhotoAnalysis from './pages/PhotoAnalysis';
import SkinJourney from './pages/SkinJourney';
import SkinAnalysisHistoryDetail from './pages/SkinAnalysisHistoryDetail';
import PhotoAnalysisHistoryDetail from './pages/PhotoAnalysisHistoryDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="analyze" element={
              <PrivateRoute>
                <Analyze />
              </PrivateRoute>
            } />
            <Route path="analyze/result" element={
              <PrivateRoute>
                <SkinAnalysisResult />
              </PrivateRoute>
            } />
            <Route path="recommendations" element={
              <PrivateRoute>
                <Recommendations />
              </PrivateRoute>
            } />
            <Route path="photo-analysis" element={
              <PrivateRoute>
                <PhotoAnalysis />
              </PrivateRoute>
            } />
            <Route path="skin-journey" element={
              <PrivateRoute>
                <SkinJourney />
              </PrivateRoute>
            } />
            <Route path="skin-journey/skin/:id" element={
              <PrivateRoute>
                <SkinAnalysisHistoryDetail />
              </PrivateRoute>
            } />
            <Route path="skin-journey/photo/:id" element={
              <PrivateRoute>
                <PhotoAnalysisHistoryDetail />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
