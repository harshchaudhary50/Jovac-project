import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { clearGeneratedResult } from '../redux/generatorSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopicForm from '../components/TopicForm';
import Sidebar from '../components/Sidebar';
import FinalResult from '../components/FinalResult';
import { FiBookOpen, FiArrowRight, FiAlertCircle, FiTool, FiPlus, FiCpu } from 'react-icons/fi';

function Notes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { isGenerating, generatedResult, generationError, activeTopic } = useSelector((state) => state.generator);

  const [adminSettings, setAdminSettings] = useState(() => {
    const savedLocal = localStorage.getItem('adminSettings');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return { maintenanceMode: false };
  });

  useEffect(() => {
    axios.get(`${serverUrl}/api/admin/settings`)
      .then(res => {
        if (res.data?.success && res.data.settings) {
          setAdminSettings(res.data.settings);
          localStorage.setItem('adminSettings', JSON.stringify(res.data.settings));
        }
      })
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
      
      {/* Background Soft Organic Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-center" />
      <div className="trekt-bg-blob-bottom" />

      {/* Global Responsive Navbar */}
      <Navbar />

      {/* Main Note Generator Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-32 pb-16 relative z-10 space-y-8 font-sans">
        
        {/* Top Header Banner */}
        <div className="relative bg-white dark:bg-[#161616] px-8 sm:px-12 py-8 sm:py-10 rounded-[28px] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          
          <div className="space-y-2 z-10 max-w-2xl text-center md:text-left py-1">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif text-[#1E2224] dark:text-white tracking-tight leading-tight">
              Generate Exam-Oriented Notes
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
              Enter your chapter or syllabus topic below. AI synthesizes in-depth conceptual notes, question banks, formulas, and visual diagrams in the background even if you switch pages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {generatedResult && (
              <button
                onClick={() => dispatch(clearGeneratedResult())}
                className="px-5 py-3.5 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#B24B27] dark:hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create New Note</span>
              </button>
            )}

            {/* Direct History Quick Link */}
            <button
              onClick={() => navigate('/history')}
              className="px-5 py-3.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#2B5866] dark:hover:bg-white text-[#2B5866] dark:text-white hover:text-white dark:hover:text-[#0d0d0d] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Saved Notes</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* System Maintenance Banner if Active */}
        {adminSettings?.maintenanceMode && (
          <div className="p-5 rounded-3xl bg-[#FAF0DC] dark:bg-[#1a1a1a] border border-[#DA9B42]/40 dark:border-[#303030] text-[#1E2224] dark:text-white flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#DA9B42]/20 text-[#DA9B42] font-bold shrink-0">
                <FiTool className="w-5 h-5 animate-bounce" />
              </span>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#B86337] dark:text-amber-400">
                  System Maintenance Mode Active
                </h4>
                <p className="text-xs font-medium text-[#5C6468] dark:text-gray-400">
                  AI Note Generation is temporarily paused for scheduled server upgrades. Please check back shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Note Topic Input Form (Only shown when not showing result, or can be toggled) */}
        {!generatedResult && (
          <TopicForm 
            isMaintenance={adminSettings?.maintenanceMode === true}
          />
        )}

        {/* Global Error Alert Box */}
        {generationError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5">
            <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{generationError}</span>
          </div>
        )}

        {/* Empty Placeholder before generation */}
        {!generatedResult && !isGenerating && (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#161616] border border-dashed border-[#E8DFD5] dark:border-[#262626] flex flex-col items-center justify-center text-center space-y-3 trekt-card-shadow"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#EBD7BE] dark:border-[#303030] flex items-center justify-center text-[#C85A32] dark:text-white">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-extrabold text-[#1E2224] dark:text-white">Generated Notes Will Appear Here</h3>
              <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
                Fill in the form above and click "Generate Exam Notes" to synthesize your study guide in the background.
              </p>
            </div>
          </motion.div>
        )}

        {/* Generated Result View Layout */}
        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
          >
            {/* Left Sidebar Table of Contents / Highlights */}
            <div className="lg:col-span-1">
              <Sidebar result={generatedResult} />
            </div>

            {/* Right Main Note Output */}
            <div className="lg:col-span-3 bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 sm:p-8 trekt-card-shadow">
              <FinalResult result={generatedResult} />
            </div>
          </motion.div>
        )}

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default Notes;
