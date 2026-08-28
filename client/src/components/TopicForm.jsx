import React, { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { useLocation } from 'react-router-dom';
import { generateNotes } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../redux/userSlice';
import { FiZap, FiBookOpen, FiShare2, FiCheck, FiCpu, FiTable, FiTarget } from 'react-icons/fi';
import TextShimmerWave from './TextShimmerWave';

function TopicForm({ setResult, setLoading, loading, setError, isMaintenance }) {
  const location = useLocation();
  const selectedTool = location.state?.selectedTool;
  const toolTitle = location.state?.toolTitle;
  const { userData } = useSelector((state) => state.user);

  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [formatMode, setFormatMode] = useState("concept");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
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

  // Auto pre-select settings based on clicked Dashboard tool or fallback to onboarding preferences
  useEffect(() => {
    if (selectedTool) {
      if (selectedTool === 'concept') {
        setFormatMode('concept');
        setExamType('Deep Concept Notes');
        setRevisionMode(false);
        setIncludeDiagram(true);
        setIncludeChart(false);
      } else if (selectedTool === 'revision') {
        setFormatMode('revision');
        setExamType('5-Minute Revision Sheet');
        setRevisionMode(true);
        setIncludeDiagram(false);
        setIncludeChart(false);
      } else if (selectedTool === 'questions') {
        setFormatMode('questions');
        setExamType('Predicted Question Bank');
        setRevisionMode(false);
        setIncludeDiagram(true);
        setIncludeChart(true);
      } else if (selectedTool === 'diagrams') {
        setFormatMode('diagrams');
        setExamType('Visual Flowchart & Architecture');
        setIncludeDiagram(true);
        setIncludeChart(true);
        setRevisionMode(false);
      }
      if (userData?.semester) {
        setClassLevel(userData.semester);
      }
    } else if (userData) {
      if (userData.semester) setClassLevel(userData.semester);
      if (userData.course) setExamType(userData.course);
      if (userData.preferredNoteType === '5-Minute Rapid Revision Sheets') {
        setFormatMode('revision');
        setRevisionMode(true);
      } else if (userData.preferredNoteType === 'Visual Flowcharts & Diagrams') {
        setFormatMode('diagrams');
        setIncludeDiagram(true);
      } else if (userData.preferredNoteType === 'Predicted Exam Question Banks') {
        setFormatMode('questions');
      } else {
        setFormatMode('concept');
      }
    }
  }, [selectedTool, userData]);

  const handleSelectMode = (mode) => {
    setFormatMode(mode);
    if (mode === 'questions') {
      setExamType('Predicted Question Bank');
      setRevisionMode(false);
      setIncludeDiagram(true);
    } else if (mode === 'revision') {
      setExamType('5-Minute Revision Sheet');
      setRevisionMode(true);
    } else if (mode === 'diagrams') {
      setExamType('Visual Flowchart & Architecture');
      setIncludeDiagram(true);
      setRevisionMode(false);
    } else {
      setExamType('Deep Concept Notes');
      setRevisionMode(false);
    }
  };

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
        formatMode,
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

  const formatPresets = [
    { id: 'concept', label: 'Deep Concept Notes', icon: FiBookOpen, desc: 'Detailed theory, formulas, and comparison table' },
    { id: 'questions', label: 'Predicted Question Bank', icon: FiTarget, desc: '2, 5 & 10 mark questions with complete model solutions' },
    { id: 'revision', label: '5-Min Revision Sheet', icon: FiZap, desc: 'Rapid 1-line definitions, mnemonics & exam takeaways' },
    { id: 'diagrams', label: 'Visual Flowcharts', icon: FiShare2, desc: 'Interactive Mermaid diagrams & architecture walkthrough' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-7 sm:p-10 trekt-card-shadow space-y-7 text-[#1E2224] dark:text-white transition-colors duration-300 font-sans"
    >
      {/* Format Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
          Generation Format & Structure
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {formatPresets.map((preset) => {
            const Icon = preset.icon;
            const isSelected = formatMode === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectMode(preset.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? "bg-[#1E2224] dark:bg-white text-white dark:text-[#000000] border-[#1E2224] dark:border-white shadow-xs"
                    : "bg-[#FAF7F2] dark:bg-[#222222] text-[#1E2224] dark:text-[#EEEEEE] border-[#E8DFD5] dark:border-[#333333] hover:border-[#C85A32] dark:hover:border-[#E6E2D3]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 shrink-0" />
                  {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{preset.label}</h4>
                  <p className={`text-[10px] leading-tight line-clamp-1 mt-0.5 ${
                    isSelected ? "text-[#E6E2D3] dark:text-[#333333]" : "text-[#5C6468] dark:text-[#E6E2D3]/60"
                  }`}>
                    {preset.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
            Chapter or Subject Topic <span className="text-[#C85A32] dark:text-[#E6E2D3]">*</span>
          </label>
          <input 
            type="text" 
            className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] shadow-xs transition-all" 
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
              className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] shadow-xs transition-all"
              placeholder="e.g., B.Tech Computer Science (Semester 4)"
              onChange={(e) => setClassLevel(e.target.value)}
              value={classLevel}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2224] dark:text-white block">
              Exam Type / Scope (Optional)
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-sm font-semibold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] shadow-xs transition-all"
              placeholder="e.g., University Mid-Term / Final Exam"
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
          <ToggleCard 
            label="Rapid Revision Sheet" 
            checked={revisionMode} 
            onChange={() => setRevisionMode(!revisionMode)} 
            icon={<FiZap className="w-4 h-4 text-[#DA9B42] dark:text-[#E6E2D3]" />} 
          />
          <ToggleCard 
            label="Mermaid Flowcharts" 
            checked={includeDiagram} 
            onChange={() => setIncludeDiagram(!includeDiagram)} 
            icon={<FiShare2 className="w-4 h-4 text-[#2B5866] dark:text-[#EEEEEE]" />} 
          />
          <ToggleCard 
            label="Summary Tables" 
            checked={includeChart} 
            onChange={() => setIncludeChart(!includeChart)} 
            icon={<FiTable className="w-4 h-4 text-[#5C6468] dark:text-[#E6E2D3]" />} 
          />
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
            <span>Generate {formatMode === 'questions' ? 'Predicted Question Bank' : formatMode === 'revision' ? '5-Min Revision Sheet' : formatMode === 'diagrams' ? 'Visual Diagrams' : 'Exam Notes'} ({creditCost} Credits)</span>
          </>
        )}
      </button>

      {/* Aesthetic TextShimmerWave Loading State */}
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
          ? "bg-[#1E2224] dark:bg-[#222222] text-white border-[#1E2224] dark:border-[#333333] shadow-xs" 
          : "bg-[#FAF7F2] dark:bg-[#1e1e1e] text-[#1E2224] dark:text-[#EEEEEE] border-[#E8DFD5] dark:border-[#303030] hover:border-[#C85A32] dark:hover:border-[#E6E2D3]"
      }`}
    >
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
        checked 
          ? "bg-white text-[#1E2224] dark:text-[#000000] border-white font-bold" 
          : "border-[#E8DFD5] dark:border-[#303030] bg-white dark:bg-[#161616]"
      }`}>
        {checked && <FiCheck className="w-3 h-3 text-[#1E2224] dark:text-[#000000]" />}
      </div>
    </div>
  );
}

export default TopicForm;
