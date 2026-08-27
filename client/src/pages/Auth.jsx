import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (input) => {
    const trimmed = input.trim().toLowerCase();
    const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!basicRegex.test(trimmed)) return false;

    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "proton.me",
      "protonmail.com"
    ];

    const domain = trimmed.split("@")[1];
    if (!domain) return false;

    return allowedDomains.includes(domain) || 
           domain.endsWith(".edu") || 
           domain.endsWith(".ac.in") || 
           domain.endsWith(".edu.in");
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const userName = User.displayName;
      const userEmail = User.email;
      const result = await axios.post(serverUrl + "/api/auth/google", { name: userName, email: userEmail }, {
        withCredentials: true
      });
      dispatch(setUserData(result.data));
      if (result.data.onboardingCompleted === false) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Google Sign-In failed. Please try again or use email login.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(serverUrl + "/api/auth/email", { 
        name: isSignUp ? name.trim() : undefined, 
        email: email.trim().toLowerCase(), 
        password,
        isSignUp 
      }, {
        withCredentials: true
      });

      dispatch(setUserData(result.data));
      if (result.data.onboardingCompleted === false) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      const serverMsg = error.response?.data?.message || "Authentication failed. Please check your credentials.";
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (signUpState) => {
    setIsSignUp(signUpState);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white flex flex-col justify-between selection:bg-[#EBD7BE] selection:text-[#1E2224] relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Soft Organic Background Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-12 pt-6 flex items-center justify-between relative z-10">
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <img 
            src="/favicon.jpg" 
            alt="PrepAI Logo" 
            className="w-8 h-8 rounded-full object-cover shadow-xs border border-[#EBD7BE] dark:border-[#303030] group-hover:scale-105 transition-transform" 
          />
          <span className="text-lg font-bold tracking-tight text-[#1E2224] dark:text-white font-sans">
            Prep<span className="text-[#C85A32] dark:text-white font-extrabold">AI</span>
          </span>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#161616] hover:bg-[#F5EBE1] dark:hover:bg-[#222222] text-[#2B5866] dark:text-white border border-[#E8DFD5] dark:border-[#262626] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <FiArrowLeft /> Back to Home
        </button>
      </header>

      {/* Main Double-Sliding Auth Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 relative z-10 my-auto">
        <div className="w-full rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow overflow-hidden relative min-h-[540px] flex flex-col md:flex-row shadow-2xl">
          
          {/* Sign In Form (Left Column on Desktop) */}
          <div className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-between transition-all duration-700 ease-in-out ${isSignUp ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100'}`}>
            <div className="space-y-5">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-serif text-[#1E2224] dark:text-white">Sign In</h2>
                <p className="text-xs text-[#5C6468] dark:text-gray-400">Use your Google account or email & password</p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#F5EBE1] dark:hover:bg-[#2a2a2a] text-[#1E2224] dark:text-white border border-[#E8DFD5] dark:border-[#303030] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-[#E8DFD5] dark:bg-[#262626] flex-1" />
                <span className="text-[10px] font-bold text-[#877F76] dark:text-gray-500 uppercase tracking-wider">OR EMAIL</span>
                <div className="h-px bg-[#E8DFD5] dark:bg-[#262626] flex-1" />
              </div>

              {/* Error Message Box */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1E2224] dark:text-white uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input 
                      type="email" 
                      required
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-semibold text-[#1E2224] dark:text-white focus:outline-none focus:border-[#C85A32] dark:focus:border-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1E2224] dark:text-white uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input 
                      type={showSignInPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-semibold text-[#1E2224] dark:text-white focus:outline-none focus:border-[#C85A32] dark:focus:border-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877F76] dark:text-gray-400 hover:text-[#1E2224] dark:hover:text-white p-1 cursor-pointer"
                      title={showSignInPassword ? "Hide Password" : "Show Password"}
                    >
                      {showSignInPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] transition-all shadow-md shadow-[#C85A32]/20 dark:shadow-none mt-2 cursor-pointer"
                >
                  {loading ? 'Signing In...' : 'SIGN IN'}
                </button>
              </form>
            </div>

            {/* Mobile Switch Link */}
            <div className="md:hidden text-center pt-4 border-t border-[#E8DFD5] dark:border-[#262626]">
              <p className="text-xs text-[#5C6468] dark:text-gray-400">
                First time user? {' '}
                <button onClick={() => switchMode(true)} className="font-bold text-[#C85A32] dark:text-white underline cursor-pointer">
                  Create an Account
                </button>
              </p>
            </div>
          </div>

          {/* Sign Up Form (Right Column on Desktop) */}
          <div className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-between transition-all duration-700 ease-in-out ${!isSignUp ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100'}`}>
            <div className="space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-serif text-[#1E2224] dark:text-white">Create Account</h2>
                <p className="text-xs text-[#5C6468] dark:text-gray-400">Register to claim your 50 free signup credits</p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#F5EBE1] dark:hover:bg-[#2a2a2a] text-[#1E2224] dark:text-white border border-[#E8DFD5] dark:border-[#303030] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <FcGoogle size={20} />
                <span>Sign up with Google</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-[#E8DFD5] dark:bg-[#262626] flex-1" />
                <span className="text-[10px] font-bold text-[#877F76] dark:text-gray-500 uppercase tracking-wider">OR ENTER DETAILS</span>
                <div className="h-px bg-[#E8DFD5] dark:bg-[#262626] flex-1" />
              </div>

              {/* Error Message Box */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1E2224] dark:text-white uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      required
                      placeholder="Alex Smith"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-semibold text-[#1E2224] dark:text-white focus:outline-none focus:border-[#C85A32] dark:focus:border-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1E2224] dark:text-white uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input 
                      type="email" 
                      required
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-semibold text-[#1E2224] dark:text-white focus:outline-none focus:border-[#C85A32] dark:focus:border-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1E2224] dark:text-white uppercase tracking-wider">Password (min 6 characters)</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input 
                      type={showSignUpPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-semibold text-[#1E2224] dark:text-white focus:outline-none focus:border-[#C85A32] dark:focus:border-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877F76] dark:text-gray-400 hover:text-[#1E2224] dark:hover:text-white p-1 cursor-pointer"
                      title={showSignUpPassword ? "Hide Password" : "Show Password"}
                    >
                      {showSignUpPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] transition-all shadow-md shadow-[#C85A32]/20 dark:shadow-none mt-2 cursor-pointer"
                >
                  {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                </button>
              </form>
            </div>

            {/* Mobile Switch Link */}
            <div className="md:hidden text-center pt-4 border-t border-[#E8DFD5] dark:border-[#262626]">
              <p className="text-xs text-[#5C6468] dark:text-gray-400">
                Already have an account? {' '}
                <button onClick={() => switchMode(false)} className="font-bold text-[#C85A32] dark:text-white underline cursor-pointer">
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Animated Overlay Panel (Desktop Only) */}
          <motion.div
            animate={{ x: isSignUp ? '0%' : '100%' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-[#2B5866] dark:bg-[#1a1a1a] text-white p-10 flex-col justify-between z-20 shadow-2xl overflow-hidden"
          >
            {/* Ambient Overlay Glow Shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#DA9B42]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#C85A32]/15 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">PrepAI</span>
            </div>

            {/* Content Swap */}
            <div className="relative z-10 space-y-4 my-auto text-center px-4">
              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.div
                    key="signup-overlay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-3xl font-serif font-bold">Welcome Back!</h3>
                    <p className="text-xs text-[#EBD7BE] dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                      To keep connected with your saved notes, 5-minute revision sheets, and note history, please log in.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => switchMode(false)}
                        className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider border-2 border-white text-white hover:bg-white hover:text-[#2B5866] dark:hover:text-[#0d0d0d] transition-all shadow-md cursor-pointer"
                      >
                        SIGN IN
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin-overlay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-3xl font-serif font-bold">Hello, Student!</h3>
                    <p className="text-xs text-[#EBD7BE] dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                      Enter your details and start your exam prep journey with 50 free credits allocated automatically.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => switchMode(true)}
                        className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider border-2 border-white text-white hover:bg-white hover:text-[#2B5866] dark:hover:text-[#0d0d0d] transition-all shadow-md cursor-pointer"
                      >
                        SIGN UP
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Perks */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-[#EBD7BE] dark:text-gray-300 font-semibold border-t border-white/15 pt-4">
              <span className="flex items-center gap-1"><FiCheckCircle className="text-[#DA9B42]" /> 50 Free Credits</span>
              <span className="flex items-center gap-1"><FiCheckCircle className="text-[#DA9B42]" /> Instant PDF Export</span>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer minimal */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-4 text-center text-xs text-[#5C6468] dark:text-gray-500 relative z-10 font-medium">
        © {new Date().getFullYear()} PrepAI Inc. All rights reserved.
      </footer>

    </div>
  );
}

export default Auth;
