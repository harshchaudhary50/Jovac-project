import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { getNotesHistory } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LottiePlayer from '../components/LottiePlayer';
import { 
  FiZap, 
  FiFileText, 
  FiClock,
  FiTrendingUp, 
  FiArrowRight, 
  FiLayers, 
  FiCheckCircle, 
  FiBookOpen, 
  FiRadio, 
  FiChevronRight,
  FiUser,
  FiTarget,
  FiShare2,
  FiFolder,
  FiCalendar
} from 'react-icons/fi';

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const credits = userData?.credits ?? 0;
  const userName = userData?.name || "Student";
  const course = userData?.course || "General Studies";
  const semester = userData?.semester || "Current Term";
  const preferredNoteType = userData?.preferredNoteType || "Deep Concept Notes";
  const userRole = userData?.role || "Student";

  const [notesHistory, setNotesHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [adminSettings, setAdminSettings] = useState(() => {
    const savedLocal = localStorage.getItem('adminSettings');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return {
      isBannerActive: true,
      announcementBanner: 'Welcome to NoteX! Select any note format below to start studying.'
    };
  });

  const [randomGreeting, setRandomGreeting] = useState("");

  const studyGreetings = [
    "Ready to master high-yield topics for your exams?",
    "Let's turn complex chapters into 5-minute revision sheets.",
    "Your personalized study co-pilot is ready.",
    "Focus on high-weightage topics and save precious study hours today."
  ];

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * studyGreetings.length);
    setRandomGreeting(studyGreetings[randomIdx]);
  }, []);

  useEffect(() => {
    // Fetch live user note history
    getNotesHistory()
      .then(res => {
        if (res?.data) {
          setNotesHistory(res.data);
        }
      })
      .catch(() => null)
      .finally(() => setLoadingHistory(false));

    // Fetch admin banner
    axios.get(`${serverUrl}/api/admin/settings`)
      .then(res => {
        if (res.data?.success && res.data.settings) {
          setAdminSettings(res.data.settings);
          localStorage.setItem('adminSettings', JSON.stringify(res.data.settings));
        }
      })
      .catch(() => null);
  }, []);

  const totalNotesCount = notesHistory.length;

  const aiNoteTools = [
    {
      id: 'concept',
      title: 'Deep Concept Notes',
      desc: 'Synthesize comprehensive textbook explanations with formulas and priority highlights.',
      icon: <FiBookOpen className="w-5 h-5 text-[#C85A32] dark:text-white" />,
      color: 'bg-[#F5EBE1] dark:bg-[#222222]',
      tag: 'Comprehensive'
    },
    {
      id: 'revision',
      title: '5-Minute Revision Sheets',
      desc: 'High-yield formula cards, bullet points, and cheat-sheets for rapid pre-exam recall.',
      icon: <FiZap className="w-5 h-5 text-[#DA9B42] dark:text-[#E6E2D3]" />,
      color: 'bg-[#FAF0DC] dark:bg-[#222222]',
      tag: 'Fast Recall'
    },
    {
      id: 'questions',
      title: 'Predicted Exam Question Banks',
      desc: 'Anticipate 2, 5, and 10 mark exam questions with structured answer frameworks.',
      icon: <FiTarget className="w-5 h-5 text-[#6B7B52] dark:text-[#EEEEEE]" />,
      color: 'bg-[#EDF2E8] dark:bg-[#222222]',
      tag: 'High Weightage'
    },
    {
      id: 'diagrams',
      title: 'Visual Flowcharts & Diagrams',
      desc: 'Generate interactive Mermaid architecture and process flowcharts for diagrams.',
      icon: <FiShare2 className="w-5 h-5 text-[#2B5866] dark:text-[#E6E2D3]" />,
      color: 'bg-[#E4ECEF] dark:bg-[#222222]',
      tag: 'Visual Learning'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
      
      {/* Background Soft Washes */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-center" />
      <div className="trekt-bg-blob-bottom" />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Dashboard Analytics Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-24 sm:pt-28 pb-16 relative z-10 space-y-6 font-sans">
        
        {/* Live Admin Announcement Banner */}
        {adminSettings?.isBannerActive !== false && adminSettings?.announcementBanner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#DA9B42]/15 via-[#C85A32]/10 to-[#2B5866]/10 dark:from-[#1a1a1a] dark:to-[#161616] border border-[#DA9B42]/30 dark:border-[#262626] backdrop-blur-md flex items-center justify-between gap-4 text-[#1E2224] dark:text-white shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#DA9B42]/20 text-[#DA9B42] dark:text-[#E6E2D3] font-bold shrink-0">
                <FiRadio className="w-4 h-4 animate-pulse" />
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1E2224] dark:text-white">
                {adminSettings.announcementBanner}
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-extrabold uppercase tracking-wider text-[#B86337] dark:text-[#E6E2D3] shrink-0">
              Announcement
            </span>
          </div>
        )}

        {/* Top Overview & Welcome Banner */}
        <div className="relative bg-white dark:bg-[#161616] px-8 sm:px-12 py-7 sm:py-8 rounded-[28px] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col md:flex-row items-center justify-between gap-6 overflow-visible min-h-[180px]">
          
          {/* Left Text Block */}
          <div className="space-y-2 z-10 max-w-xl text-center md:text-left py-1 pr-0 md:pr-60">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif text-[#1E2224] dark:text-white tracking-tight leading-tight">
              Welcome, <span className="text-[#C85A32] dark:text-white font-extrabold">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
              {randomGreeting || `Ready to start your preparation for ${course}`}
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

        {/* 4 Analytical Real Performance Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <MetricRecordCard 
            icon={<FiZap className="w-5 h-5 text-[#DA9B42] dark:text-[#E6E2D3]" />}
            iconBg="bg-[#FAF0DC] dark:bg-[#222222]"
            value={`${credits}`}
            label="Available AI Credits"
            badge="Refill Anytime"
            actionText="Refill Credits"
            onAction={() => navigate('/pricing')}
          />

          <MetricRecordCard 
            icon={<FiBookOpen className="w-5 h-5 text-[#C85A32] dark:text-white" />}
            iconBg="bg-[#F5EBE1] dark:bg-[#222222]"
            value={`${totalNotesCount}`}
            label="Notes Generated"
            badge={totalNotesCount > 0 ? "Saved in Cloud" : "Start Creating"}
            actionText="Create Note"
            onAction={() => navigate('/notes')}
          />

          <MetricRecordCard 
            icon={<FiUser className="w-5 h-5 text-[#6B7B52] dark:text-[#EEEEEE]" />}
            iconBg="bg-[#EDF2E8] dark:bg-[#222222]"
            value={userRole}
            label="Account Profile"
            badge="Verified User"
          />

          <MetricRecordCard 
            icon={<FiFolder className="w-5 h-5 text-[#2B5866] dark:text-[#E6E2D3]" />}
            iconBg="bg-[#E4ECEF] dark:bg-[#222222]"
            value={totalNotesCount > 0 ? `${totalNotesCount} Topics` : "0 Topics"}
            label="Cloud Study Library"
            badge="Auto-Synced"
            actionText={totalNotesCount > 0 ? "View History" : undefined}
            onAction={() => navigate('/history')}
          />

        </div>

        {/* Active Course & Exam Preparation Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Syllabus & Exam Readiness Overview Card */}
          <div className="lg:col-span-2 p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight text-[#1E2224] dark:text-white">
                  Active Course & Preparation Profile
                </h3>
              </div>
              <span className="text-xs font-bold text-[#6B7B52] dark:text-[#E6E2D3]">
                Verified Account
              </span>
            </div>

            {/* Course & Exam Readiness Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">Registered Course / Stream</span>
                <p className="text-sm font-extrabold text-[#1E2224] dark:text-white truncate">{course}</p>
                <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-medium">{semester}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">Preferred Note Format</span>
                <p className="text-sm font-extrabold text-[#1E2224] dark:text-white truncate">{preferredNoteType}</p>
                <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-medium">Auto-configured for Generation</p>
              </div>
            </div>

            {/* Quick Real User Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">Available AI Credits</span>
                <p className="text-xs font-extrabold text-[#1E2224] dark:text-white">{credits} Credits</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">Saved Study Notes</span>
                <p className="text-xs font-extrabold text-[#1E2224] dark:text-white">{totalNotesCount} Notes</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">Account Role</span>
                <p className="text-xs font-extrabold text-[#1E2224] dark:text-white">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Quick Note History Access Widget */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center text-[#C85A32] dark:text-white">
                <FiFolder className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">
                  Personal Study Library
                </h3>
                <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
                  {totalNotesCount > 0 
                    ? `You have ${totalNotesCount} note${totalNotesCount > 1 ? 's' : ''} saved in your library ready for instant review and export.`
                    : 'Access all your generated notes, flowcharts, and question banks in your dedicated history page once generated.'}
                </p>
              </div>

              {/* Show Recent Note if available */}
              {notesHistory.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] space-y-1">
                  <span className="text-[10px] font-bold text-[#C85A32] dark:text-[#E6E2D3] uppercase tracking-wider block">Recent Note</span>
                  <p className="text-xs font-extrabold text-[#1E2224] dark:text-white truncate">{notesHistory[0].topic}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(totalNotesCount > 0 ? '/history' : '/notes')}
              className="w-full py-3 rounded-full bg-[#2B5866] dark:bg-white hover:bg-[#20444F] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{totalNotesCount > 0 ? 'GO TO NOTE HISTORY' : 'CREATE FIRST NOTE'}</span>
              <FiArrowRight />
            </button>
          </div>

        </div>

        {/* Fast Tool Presets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-[#1E2224] dark:text-white">
              AI Note Generation Formats
            </h3>
            <span className="text-xs font-semibold text-[#5C6468] dark:text-gray-400">
              Click any format to launch note generator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiNoteTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => navigate('/notes', { state: { selectedTool: tool.id, toolTitle: tool.title } })}
                className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover cursor-pointer space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl ${tool.color} border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center`}>
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-bold text-[#5C6468] dark:text-gray-400 uppercase tracking-wider">
                      {tool.tag}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#1E2224] dark:text-white group-hover:text-[#C85A32] dark:group-hover:text-[#E6E2D3] transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DFD5] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-[#C85A32] dark:text-white">
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

function MetricRecordCard({ icon, iconBg = "bg-[#FAF7F2]", value, label, badge, actionText, onAction }) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-3 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-9 h-9 rounded-xl ${iconBg} border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold text-[#5C6468] dark:text-gray-400 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E2224] dark:text-white">{value}</h3>
          <p className="text-xs font-semibold text-[#5C6468] dark:text-gray-400">{label}</p>
        </div>
      </div>

      {actionText && (
        <button 
          onClick={onAction}
          className="text-[11px] font-bold text-[#C85A32] dark:text-[#E6E2D3] hover:underline pt-2 border-t border-[#E8DFD5] dark:border-[#262626] text-left flex items-center justify-between cursor-pointer"
        >
          <span>{actionText}</span>
          <FiArrowRight />
        </button>
      )}
    </div>
  );
}

export default Dashboard;
