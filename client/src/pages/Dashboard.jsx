import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LottiePlayer from '../components/LottiePlayer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { 
  FiZap, 
  FiBookOpen, 
  FiClock, 
  FiPlus, 
  FiArrowRight, 
  FiFileText, 
  FiCheckCircle, 
  FiTrendingUp,
  FiAward,
  FiShare2,
  FiStar,
  FiTarget,
  FiLayers,
  FiActivity,
  FiFolder,
  FiRadio
} from 'react-icons/fi';

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const credits = userData?.credits ?? 50;
  const navigate = useNavigate();

  const userName = userData?.name ? userData.name.split(' ')[0] : 'Student';
  const role = userData?.role || 'Student';
  const course = userData?.course || 'B.Tech Computer Science';
  const semester = userData?.semester || 'Semester 4';
  const preferredNoteType = userData?.preferredNoteType || 'Deep Concept Notes';
  const [randomGreeting, setRandomGreeting] = useState(`Ready to start your day with high-yield AI exam notes for ${course}?`);

  useEffect(() => {
    const greetings = [
      `Ready to start your day with high-yield AI exam notes for ${course}?`,
      `Let's conquer your exam syllabus today. What subject are we mastering next?`,
      `Transform complex lectures into 5-minute rapid revision sheets for ${course}.`,
      `Smart preparation leads to top marks. Ready to generate notes for ${course}?`,
      `Your AI study co-pilot is ready. Let's make exam preparation effortless today!`
    ];
    setRandomGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, [course]);

  const [adminSettings, setAdminSettings] = useState(() => {
    const savedLocal = localStorage.getItem('adminSettings');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return {
      announcementBanner: 'Welcome to PrepAI! Upgrade to Pro for priority note generation.',
      isBannerActive: true
    };
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

  // AI Tool Launchers Grid
  const aiTools = [
    {
      title: 'Deep Concept Notes',
      icon: <FiBookOpen className="w-5 h-5 text-[#1e2025] dark:text-white" />,
      desc: 'Structured chapter explanations, key formulas, priority topic tags, and exam takeaways.',
      badge: 'Most Popular',
      path: '/notes',
      type: 'concept'
    },
    {
      title: '5-Min Rapid Revision Sheet',
      icon: <FiZap className="w-5 h-5 text-[#1e2025] dark:text-white" />,
      desc: 'Ultra-short bullet points and definition cheat sheets engineered for last-night cramming.',
      badge: 'Fast Prep',
      path: '/notes',
      type: 'revision'
    },
    {
      title: 'Predicted Exam Question Bank',
      icon: <FiTarget className="w-5 h-5 text-[#1e2025] dark:text-white" />,
      desc: 'Short, long, and diagram-based questions with estimated marks weightage allocation.',
      badge: 'High Yield',
      path: '/notes',
      type: 'questions'
    },
    {
      title: 'Visual Mermaid Flowcharts',
      icon: <FiShare2 className="w-5 h-5 text-[#1e2025] dark:text-white" />,
      desc: 'Process diagrams, architecture flowcharts, and visual topic weightage charts for quick recall.',
      badge: 'Visual Diagrams',
      path: '/notes',
      type: 'diagrams'
    }
  ];

  return (
    <div className="min-h-screen bg-[#EDEBE0] dark:bg-[#0d0d0d] text-[#1e2025] dark:text-[#ffffff] relative overflow-hidden font-sans selection:bg-[#EDEBE0] selection:text-[#1e2025] transition-colors duration-300">
      
      {/* Background Soft Organic Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-center" />
      <div className="trekt-bg-blob-bottom" />

      {/* Fixed Navbar Protection */}
      <Navbar />

      {/* Main Dashboard Analytics Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24 sm:pt-28 pb-16 relative z-10 space-y-6 font-sans">
        
        {/* Live Admin Announcement Banner */}
        {adminSettings?.isBannerActive !== false && adminSettings?.announcementBanner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-500/30 dark:border-amber-400/20 backdrop-blur-md flex items-center justify-between gap-4 text-[#1e2025] dark:text-white shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                <FiRadio className="w-4 h-4 animate-pulse" />
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1e2025] dark:text-white">
                {adminSettings.announcementBanner}
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-[10px] font-extrabold uppercase tracking-wider shrink-0">
              Announcement
            </span>
          </div>
        )}

        {/* Top Overview & Welcome Banner */}
        <div className="relative bg-[#EDEBE0] dark:bg-[#161616] px-8 sm:px-12 py-7 sm:py-8 rounded-[28px] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col md:flex-row items-center justify-between gap-6 overflow-visible min-h-[180px]">
          
          {/* Left Text Block */}
          <div className="space-y-2 z-10 max-w-xl text-center md:text-left py-1 pr-0 md:pr-60">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif text-[#1e2025] dark:text-white tracking-tight leading-tight">
              Welcome, {userName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#52565c] dark:text-gray-300 font-medium leading-relaxed">
              {randomGreeting || `Ready to start your day with AI exam notes for ${course}`}
            </p>
          </div>

          {/* Right Character Lottie Illustration */}
          <div className="relative md:absolute right-6 sm:right-10 md:right-12 bottom-0 z-20 flex items-end justify-center pointer-events-none mt-4 md:mt-0">
            <div className="w-64 h-[220px] sm:w-80 sm:h-[240px] md:w-[350px] md:h-[260px] relative flex items-end justify-center overflow-visible">
              <div className="w-full h-full transform translate-y-3 sm:translate-y-3.5 md:translate-y-4 scale-110 sm:scale-115 origin-bottom flex items-end justify-center">
                <LottiePlayer className="w-full h-full" />
              </div>
            </div>
          </div>

        </div>

        {/* 4 Analytical Performance Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <MetricRecordCard 
            icon={<FiZap className="w-5 h-5 text-[#1e2025] dark:text-white" />}
            value={`${credits}`}
            label="Available AI Credits"
            badge="Refill Anytime"
            actionText="Buy Credits"
            onAction={() => navigate('/pricing')}
          />

          <MetricRecordCard 
            icon={<FiLayers className="w-5 h-5 text-[#1e2025] dark:text-white" />}
            value="14"
            label="Syllabus Chapters Covered"
            badge="Exam Readiness"
          />

          <MetricRecordCard 
            icon={<FiTrendingUp className="w-5 h-5 text-[#1e2025] dark:text-white" />}
            value="99.4%"
            label="Syllabus Precision"
            badge="Verified Pattern"
          />

          <MetricRecordCard 
            icon={<FiClock className="w-5 h-5 text-[#1e2025] dark:text-white" />}
            value="18.5 hrs"
            label="Study Time Saved"
            badge="5-Min Revision"
          />

        </div>

        {/* Active Course & Exam Preparation Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Syllabus & Exam Readiness Overview Card */}
          <div className="lg:col-span-2 p-7 sm:p-8 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400 block">
                  Exam Syllabus Overview
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-[#1e2025] dark:text-white">
                  Active Course & Preparation Profile
                </h3>
              </div>
              <span className="text-xs font-bold text-[#52565c] dark:text-gray-400">
                Verified Account
              </span>
            </div>

            {/* Course & Exam Readiness Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400">Registered Course</span>
                <p className="text-sm font-extrabold text-[#1e2025] dark:text-white truncate">{course}</p>
                <p className="text-[11px] text-[#71757c] dark:text-gray-400 font-medium">{semester}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400">Preferred Note Format</span>
                <p className="text-sm font-extrabold text-[#1e2025] dark:text-white truncate">{preferredNoteType}</p>
                <p className="text-[11px] text-[#71757c] dark:text-gray-400 font-medium">Instant AI Generation Preset</p>
              </div>
            </div>

            {/* Quick Real User Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400">Available AI Credits</span>
                <p className="text-xs font-extrabold text-[#1e2025] dark:text-white">{credits} Credits</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400">Student Status</span>
                <p className="text-xs font-extrabold text-[#1e2025] dark:text-white">Active Member</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52565c] dark:text-gray-400">Auto Cloud Backup</span>
                <p className="text-xs font-extrabold text-[#1e2025] dark:text-white">Enabled in History</p>
              </div>
            </div>
          </div>

          {/* Quick Note History Access Widget */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#1e2025] dark:text-white">
                <FiFolder className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight text-[#1e2025] dark:text-white">
                  Personal Study Library
                </h3>
                <p className="text-xs text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
                  Access all your previously generated exam notes, flowcharts, and question banks in your dedicated history page.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/history')}
              className="w-full py-3 rounded-full bg-[#1e2025] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Go to Note History</span>
              <FiArrowRight />
            </button>
          </div>

        </div>

        {/* Quick AI Note Generator Tools Grid */}
        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1e2025] dark:text-white">
              AI Exam Note Tools
            </h2>
            <p className="text-xs text-[#52565c] dark:text-gray-400 font-medium">
              Select an AI note format below to generate high-yield study material instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiTools.map((tool, idx) => (
              <div 
                key={idx}
                onClick={() => navigate('/notes', { state: { selectedTool: tool.type, toolTitle: tool.title } })}
                className="p-6 sm:p-7 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover cursor-pointer space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1e2025] dark:text-white">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-bold text-[#52565c] dark:text-gray-400 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#1e2025] dark:text-white group-hover:underline">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#B2B4B7]/30 dark:border-[#303030] flex items-center justify-between text-xs font-bold text-[#1e2025] dark:text-white">
                  <span>Launch Generator</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

function MetricRecordCard({ icon, value, label, badge, actionText, onAction }) {
  return (
    <div className="p-6 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-3 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e2025] dark:text-white">
            {icon}
          </div>
          <span className="text-[10px] font-bold text-[#52565c] dark:text-gray-400 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1e2025] dark:text-white">{value}</h3>
          <p className="text-xs font-semibold text-[#52565c] dark:text-gray-400">{label}</p>
        </div>
      </div>

      {actionText && (
        <button 
          onClick={onAction}
          className="text-[11px] font-bold text-[#1e2025] dark:text-white hover:underline pt-2 border-t border-[#B2B4B7]/30 dark:border-[#303030] text-left flex items-center justify-between cursor-pointer"
        >
          <span>{actionText}</span>
          <FiArrowRight />
        </button>
      )}
    </div>
  );
}

export default Dashboard;
