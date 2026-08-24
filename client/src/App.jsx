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

  // Try to fetch user from backend, but fallback gracefully if not authenticated
  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/landing' element={<Home />} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/history' element={<History />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/admin' element={<Admin />} />

        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/payment-failed' element={<PaymentFailed />} />

        {/* Fallback route */}
        <Route path='*' element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
