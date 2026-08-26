import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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

export const serverUrl = "http://localhost:8000";

function App() {
  const dispatch = useDispatch();

  // Try to fetch user from backend
  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
        {/* Root Route: If logged in, go to dashboard (or onboarding if pending); else landing page */}
        <Route 
          path='/' 
          element={
            !userData ? (
              <Home />
            ) : userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Dashboard />
            )
          } 
        />
        <Route path='/landing' element={<Home />} />
        
        {/* Onboarding Route: Only for users whose onboarding is pending */}
        <Route 
          path='/onboarding' 
          element={<Onboarding />} 
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
            userData && userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Dashboard />
            )
          } 
        />
        <Route 
          path='/notes' 
          element={
            userData && userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Notes />
            )
          } 
        />
        <Route 
          path='/history' 
          element={
            userData && userData.onboardingCompleted === false ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <History />
            )
          } 
        />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/admin' element={<Admin />} />

        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/payment-failed' element={<PaymentFailed />} />

        {/* Fallback route */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
