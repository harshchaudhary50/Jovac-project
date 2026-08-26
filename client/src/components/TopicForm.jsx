import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { useLocation } from 'react-router-dom';
import { generateNotes } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../redux/userSlice';
import { FiZap, FiBookOpen, FiShare2, FiCheck, FiCpu, FiTable } from 'react-icons/fi';
import TextShimmerWave from './TextShimmerWave';

function TopicForm({ setResult, setLoading, loading, setError, isMaintenance }) {
  const location = useLocation();
  const selectedTool = location.state?.selectedTool;
  const toolTitle = location.state?.toolTitle;
  const { userData } = useSelector((state) => state.user);

  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const dispatch = useDispatch();

  const [adminSettings, setAdminSettings] = useState(() => {
    const savedLocal = localStorage.getItem('adminSettings');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return {
      creditCostPerGeneration: 10,
      selectedAiModel: 'Gemini 2.5 Flash',
      maintenanceMode: false
    };
  });

  const creditCost = adminSettings?.creditCostPerGeneration || 10;
  const activeModel = adminSettings?.selectedAiModel || 'Gemini 2.5 Flash';

  // Auto pre-select settings based on clicked Dashboard tool
  useEffect(() => {
    if (selectedTool) {
      if (selectedTool === 'concept') {
        setExamType('Deep Concept Notes');
        setRevisionMode(false);
        setIncludeDiagram(true);
      } else if (selectedTool === 'revision') {
        setExamType('Rapid Revision Sheet');
        setRevisionMode(true);
        setIncludeDiagram(false);
      } else if (selectedTool === 'questions') {
        setExamType('Predicted Question Bank');
        setRevisionMode(false);
        setIncludeDiagram(true);
      } else if (selectedTool === 'diagrams') {
        setExamType('Visual Mermaid Flowchart');
        setIncludeDiagram(true);
        setIncludeChart(true);
      }
    }
  }, [selectedTool]);

  // Pre-fill form from user onboarding preferences saved in database
  useEffect(() => {
    if (userData) {
      if (!classLevel && userData.semester) {
        setClassLevel(userData.semester);
      }
      if (!examType && userData.course) {
        setExamType(userData.course);
      }
      if (userData.preferredNoteType === '5-Minute Rapid Revision Sheets') {
        setRevisionMode(true);
      }
      if (userData.preferredNoteType === 'Visual Flowcharts & Diagrams') {
        setIncludeDiagram(true);
      }
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (userData?.isCreditAvailable === false || userData?.status === 'Disabled') {
      setError("Your user account has been disabled by Admin. Please contact support.");
      return;
    }
    if (isMaintenance || adminSettings?.maintenanceMode) {
      setError("AI Note Generation is temporarily paused for scheduled system maintenance. Please check back shortly.");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a valid subject or chapter topic");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart
      });
      
      if (result && result.data) {
        setResult(result.data);
        setClassLevel("");
        setTopic("");
        setExamType("");
        setIncludeChart(false);
        setRevisionMode(false);
        setIncludeDiagram(false);

        if (typeof result.creditsLeft === "number") {
          dispatch(updateCredits(result.creditsLeft));
        }
      } else {
        throw new Error("Invalid response format received from AI server");
      }
      setLoading(false);
    } catch (error) {
      console.error("TopicForm Submit Error:", error);
      setError(error.message || "Failed to generate notes. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("");
      return;
    }
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 8;

      if (value >= 95) {
        value = 95;
        setProgressText("Finalizing high-yield takeaways...");
        clearInterval(interval);
      } else if (value > 70) {
        setProgressText("Generating visual diagrams & charts...");
      } else if (value > 40) {
        setProgressText("Processing exam weightage patterns...");
      } else {
        setProgressText("Synthesizing concept notes...");
      }

      setProgress(Math.floor(value));
    }, 700);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-7 sm:p-10 trekt-card-shadow space-y-7 text-[#1E2224] dark:text-white transition-colors duration-300"
    >
      {/* Active Pre-selected Preset Banner */}
      {toolTitle && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF0DC] dark:bg-[#1e1e1e] border border-[#DA9B42]/30 dark:border-[#303030] text-[#1E2224] dark:text-white text-xs font-bold shadow-xs">
          <span className="flex items-center gap-2">
            <FiZap className="w-4 h-4 text-[#DA9B42] dark:text-amber-400" />
            <span>Active Format Preset: <strong className="underline text-[#B86337] dark:text-amber-400">{toolTitle}</strong></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#2B5866] dark:text-gray-300 font-extrabold">
            Pre-Configured
          </span>
        </div>
      )}

      {/* Input Fields Section */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
            Chapter or Subject Topic <span className="text-[#C85A32] dark:text-amber-400">*</span>
          </label>
          <input 
            type="text" 
            className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white shadow-xs transition-all" 
            placeholder="e.g., Operating Systems: Process Synchronization and Semaphores"
            onChange={(e) => setTopic(e.target.value)}
            value={topic}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
              Course / Academic Level (Optional)
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white shadow-xs transition-all"
              placeholder="e.g., B.Tech Computer Science (Semester 4)"
              onChange={(e) => setClassLevel(e.target.value)}
              value={classLevel}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
              Note Format Preset (Optional)
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white shadow-xs transition-all"
              placeholder="e.g., Comprehensive Concept Notes or Rapid Revision"
              onChange={(e) => setExamType(e.target.value)}
              value={examType}
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles Section */}
      <div className="space-y-3 pt-2 border-t border-[#E8DFD5] dark:border-[#262626]">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
          Output Enhancements
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <ToggleCard label="Rapid Revision Format" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} icon={<FiZap className="w-4 h-4 text-[#DA9B42] dark:text-amber-400" />} />
          <ToggleCard label="Mermaid Flowcharts" checked={includeDiagram} onChange={() => setIncludeDiagram(!includeDiagram)} icon={<FiShare2 className="w-4 h-4 text-[#2B5866] dark:text-teal-400" />} />
          <ToggleCard label="Summary Tables" checked={includeChart} onChange={() => setIncludeChart(!includeChart)} icon={<FiTable className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400" />} />
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || isMaintenance}
        className={`w-full py-4 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
          isMaintenance
            ? "bg-[#DA9B42] text-white opacity-80 cursor-not-allowed"
            : "bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] shadow-[#C85A32]/25 dark:shadow-none"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#0d0d0d] border-t-transparent rounded-full animate-spin shrink-0" />
            <TextShimmerWave className="text-white dark:text-[#0d0d0d] font-bold text-xs uppercase tracking-wider">
              Generating...
            </TextShimmerWave>
          </div>
        ) : isMaintenance ? (
          <>
            <FiCpu className="w-4 h-4" />
            <span>PAUSED (SYSTEM MAINTENANCE ACTIVE)</span>
          </>
        ) : (
          <>
            <FiCpu className="w-4 h-4" />
            <span>Generate Exam Notes ({creditCost} Credits)</span>
          </>
        )}
      </button>

      {/* Pure Aesthetic TextShimmerWave Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 py-10 px-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow flex items-center justify-center text-center"
        >
          <TextShimmerWave 
            duration={1.2} 
            spread={1.2}
            className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2224] dark:text-white"
          >
            Generating...
          </TextShimmerWave>
        </motion.div>
      )}
    </motion.div>
  );
}

function ToggleCard({ label, checked, onChange, icon }) {
  return (
    <div 
      onClick={onChange}
      className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
        checked 
          ? "bg-[#2B5866] dark:bg-[#222222] text-white border-[#2B5866] dark:border-white shadow-xs" 
          : "bg-[#FAF7F2] dark:bg-[#1e1e1e] text-[#1E2224] dark:text-white border-[#E8DFD5] dark:border-[#303030] hover:border-[#C85A32] dark:hover:border-white"
      }`}
    >
      <div className="flex items-center gap-2.5 text-xs font-extrabold">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
        checked 
          ? "bg-white text-[#2B5866] dark:text-[#0d0d0d] border-white font-bold" 
          : "border-[#E8DFD5] dark:border-[#303030] bg-white dark:bg-[#161616]"
      }`}>
        {checked && <FiCheck className="w-3 h-3 text-[#2B5866] dark:text-[#0d0d0d]" />}
      </div>
    </div>
  );
}

export default TopicForm;
