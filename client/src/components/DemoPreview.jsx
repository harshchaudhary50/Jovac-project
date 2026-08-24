import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiBookOpen, FiZap, FiShare2, FiCheckCircle, FiDownload, FiStar, FiHelpCircle, FiArrowRight } from 'react-icons/fi';

const DEMO_DATA = {
  topic: "Operating Systems — Process Synchronization & Deadlocks",
  level: "B.Tech Computer Science / GATE CS",
  importance: "High Priority (15-20% Exam Weightage)",
  subTopics: [
    { priority: "Priority 1", text: "Critical Section Problem & Peterson's Algorithm" },
    { priority: "Priority 2", text: "Semaphores & Mutex (Counting vs Binary)" },
    { priority: "Priority 3", text: "Banker's Algorithm for Deadlock Avoidance" }
  ],
  revision: [
    "Race Condition occurs when multiple processes access shared memory concurrently.",
    "Mutex is a locking mechanism (binary: 0 or 1); Semaphore is a signaling mechanism.",
    "4 Coffman Conditions for Deadlock: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
    "Banker's Algorithm tests if resource allocation leaves the system in a Safe State."
  ],
  flowchartSteps: [
    { step: "1. Process Request", desc: "Process requests allocation of shared system resources", status: "Initiated" },
    { step: "2. Availability Check", desc: "OS checks if requested instances <= Available vector", status: "Evaluation" },
    { step: "3. Banker's Safety Test", desc: "Simulate allocation & verify Work >= Need safe sequence", status: "Running" },
    { step: "4. State Allocation", desc: "System grants resources safely without deadlock risk", status: "Completed" }
  ],
  questions: [
    "Q1 (Short): Differentiate between Mutex and Counting Semaphore with code example. (4 Marks)",
    "Q2 (Long): Explain Banker's Algorithm with an allocation matrix example showing safe sequence. (10 Marks)",
    "Q3 (Diagram): Draw the state transition model for Deadlock Detection in multi-threaded environments."
  ]
};

export default function DemoPreview() {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-[#B2B4B7]/40 dark:border-[#262626] bg-[#EDEBE0] dark:bg-[#161616] text-[#1e2025] dark:text-white trekt-card-shadow overflow-hidden transition-colors duration-300">
      
      {/* Clean Header Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-[#B2B4B7]/30 dark:border-[#262626]">
        
        {/* Header Title */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#52565c] dark:text-gray-400">
            Interactive AI Output Preview
          </span>
        </div>

        {/* Clean Interactive Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-[#222222] p-1.5 rounded-2xl border border-[#B2B4B7]/40 dark:border-[#303030]">
          <TabButton 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')} 
            icon={<FiBookOpen className="w-3.5 h-3.5" />} 
            label="Detailed Notes" 
          />
          <TabButton 
            active={activeTab === 'revision'} 
            onClick={() => setActiveTab('revision')} 
            icon={<FiZap className="w-3.5 h-3.5" />} 
            label="5-Min Revision" 
          />
          <TabButton 
            active={activeTab === 'diagram'} 
            onClick={() => setActiveTab('diagram')} 
            icon={<FiShare2 className="w-3.5 h-3.5" />} 
            label="AI Diagram" 
          />
          <TabButton 
            active={activeTab === 'questions'} 
            onClick={() => setActiveTab('questions')} 
            icon={<FiHelpCircle className="w-3.5 h-3.5" />} 
            label="Exam Questions" 
          />
        </div>

      </div>

      {/* Main Content Showcase */}
      <div className="p-6 sm:p-8 min-h-[380px] space-y-6">
        
        {/* Chapter Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#B2B4B7]/30 dark:border-[#262626]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52565c] dark:text-gray-400">
              <span>{DEMO_DATA.level}</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">{DEMO_DATA.importance}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1e2025] dark:text-white tracking-tight">
              {DEMO_DATA.topic}
            </h3>
          </div>

          <button className="px-4 py-2 text-xs font-bold bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] rounded-xl flex items-center gap-2 shadow-xs cursor-pointer hover:bg-black dark:hover:bg-gray-200 transition-all self-start sm:self-auto">
            <FiDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Tab Content Animated Display */}
        <AnimatePresence mode="wait">
          
          {/* Detailed Concept Notes View */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Priority Subtopics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {DEMO_DATA.subTopics.map((sub, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/80 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] text-xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52565c] dark:text-gray-400 block">{sub.priority}</span>
                    <span className="text-[#1e2025] dark:text-white font-extrabold">{sub.text}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Content Card */}
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-4 text-xs sm:text-sm text-[#1e2025] dark:text-gray-200 leading-relaxed font-sans">
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-[#1e2025] dark:text-white">1. What is Process Synchronization?</h4>
                  <p className="text-[#52565c] dark:text-gray-300 font-medium">
                    Process Synchronization is the mechanism to ensure that two or more concurrent processes do not simultaneously execute in the critical section or modify shared data, avoiding data corruption.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#B2B4B7]/30 dark:border-[#303030] space-y-2">
                  <h4 className="text-base font-extrabold text-[#1e2025] dark:text-white">2. Critical Section Essential Conditions</h4>
                  <ul className="space-y-1.5 pl-4 list-disc marker:text-[#1e2025] dark:marker:text-white text-[#52565c] dark:text-gray-300 font-medium">
                    <li><strong className="text-[#1e2025] dark:text-white">Mutual Exclusion:</strong> Only one process inside CS at any time.</li>
                    <li><strong className="text-[#1e2025] dark:text-white">Progress:</strong> Processes outside CS shouldn't delay waiting processes.</li>
                    <li><strong className="text-[#1e2025] dark:text-white">Bounded Waiting:</strong> Must guarantee no process starves forever.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5-Min Rapid Revision Sheet View */}
          {activeTab === 'revision' && (
            <motion.div
              key="revision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-4"
            >
              <div className="flex items-center gap-2 text-[#1e2025] dark:text-white font-extrabold text-sm border-b border-[#B2B4B7]/30 dark:border-[#303030] pb-3">
                <FiZap className="w-4 h-4 text-amber-500" />
                <span>5-Minute Rapid Revision Cheat Sheet</span>
              </div>
              <ul className="space-y-3">
                {DEMO_DATA.revision.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-[#1e2025] dark:text-gray-200">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Visual AI Flowchart Diagram View */}
          {activeTab === 'diagram' && (
            <motion.div
              key="diagram"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DEMO_DATA.flowchartSteps.map((stepItem, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        {stepItem.status}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#1e2025] dark:text-white">
                        {stepItem.step}
                      </h4>
                      <p className="text-xs text-[#52565c] dark:text-gray-300 font-medium leading-relaxed">
                        {stepItem.desc}
                      </p>
                    </div>
                    {idx < 3 && (
                      <div className="hidden sm:flex justify-end pt-2 text-[#52565c] dark:text-gray-400">
                        <FiArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Exam Questions Bank View */}
          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {DEMO_DATA.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/90 dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] flex items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm font-bold text-[#1e2025] dark:text-gray-100">{q}</p>
                  <span className="px-3 py-1 text-[10px] font-extrabold bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] rounded-full shrink-0">
                    High Yield
                  </span>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
        active 
          ? 'bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] shadow-xs' 
          : 'text-[#52565c] dark:text-gray-300 hover:text-[#1e2025] dark:hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
