import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import { getCurrentUser } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import History from './pages/History';
import Notes from './pages/Notes';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Admin from './pages/Admin';
import GlobalGenerationIndicator from './components/GlobalGenerationIndicator';

export const serverUrl = import.meta.env.VITE_SERVER_URL || "https://jovac-project-fu4c.onrender.com";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Try to fetch user from backend on initial mount
  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const { userData, authChecked } = useSelector((state) => state.user);
  const isAdmin = userData?.role?.toLowerCase() === 'admin' || userData?.email === 'jadounmadhav44@gmail.com';

  // Strict Theme Control:
  // 1. Landing Page ('/' or '/landing') and Auth ('/auth') are ALWAYS Light Mode
  // 2. Protected App pages use the user's saved DB theme preference (defaults to light for new users)
  useEffect(() => {
    const isPublicLightPage = ['/', '/landing', '/auth'].includes(location.pathname);
    
    if (isPublicLightPage) {
      document.documentElement.classList.remove('dark');
    } else if (userData) {
      if (userData.themePreference === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [location.pathname, userData]);

  // Prevent routing decisions until initial session check completes
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C85A32] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Root Route: If logged in, direct to Dashboard; else Landing Page */}
        <Route 
          path='/' 
          element={
            userData ? (
              userData.onboardingCompleted === false ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Home />
            )
          } 
        />
        <Route path='/landing' element={<Home />} />
        
        {/* Onboarding Route */}
        <Route 
          path='/onboarding' 
          element={
            !userData ? (
              <Navigate to="/auth" replace />
            ) : (
              <Onboarding />
            )
          } 
        />
        
        {/* Auth Route */}
        <Route 
          path='/auth' 
          element={
            userData ? (
              userData.onboardingCompleted === false ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Auth />
            )
          } 
        />

        {/* Protected App Routes */}
        <Route 
          path='/dashboard' 
          element={
            !userData ? (
              <Navigate to="/auth" replace />
            ) : userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Dashboard />
            )
          } 
        />
        <Route 
          path='/notes' 
          element={
            !userData ? (
              <Navigate to="/auth" replace />
            ) : userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Notes />
            )
          } 
        />
        <Route 
          path='/history' 
          element={
            !userData ? (
              <Navigate to="/auth" replace />
            ) : userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <History />
            )
          } 
        />
        <Route path='/pricing' element={<Pricing />} />
        
        {/* Admin Route */}
        <Route 
          path='/admin' 
          element={
            !userData ? (
              <Navigate to="/auth" replace />
            ) : isAdmin ? (
              <Admin />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/payment-failed' element={<PaymentFailed />} />

        {/* Fallback route */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Background Generation Indicator Floating Widget */}
      <GlobalGenerationIndicator />
    </>
  );
}

export default App;
