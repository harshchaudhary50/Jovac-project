import React from 'react';
import { FiBookOpen, FiStar, FiHelpCircle, FiZap, FiLayers } from 'react-icons/fi';

function Sidebar({ result }) {
  if (!result) return null;

  const subTopics = result.subTopics && typeof result.subTopics === 'object' && Object.keys(result.subTopics).length > 0
    ? result.subTopics 
    : { "⭐⭐⭐": [result.topic || "Core Concepts & Fundamentals"] };

  const importance = result.importance || "⭐⭐⭐";
  const shortQuestions = Array.isArray(result.questions?.short) ? result.questions.short : [];

  return (
    <div className="bg-white dark:bg-[#161616] rounded-3xl border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow p-6 space-y-6 text-[#1E2224] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8DFD5] dark:border-[#262626]">
        <div className="w-8 h-8 rounded-xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#EBD7BE] dark:border-[#303030] flex items-center justify-center text-[#C85A32] dark:text-white">
          <FiBookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold tracking-tight text-[#1E2224] dark:text-white">
            Quick Exam Summary
          </h3>
          <p className="text-[10px] text-[#5C6468] dark:text-gray-400 font-semibold">Priority & Topic Outline</p>
        </div>
      </div>

      {/* Sub Topics */}
      <section className="space-y-3">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C6468] dark:text-gray-400 flex items-center gap-1.5">
          <FiStar className="text-[#DA9B42] dark:text-amber-400" /> Subtopics by Priority
        </p>
        {Object.entries(subTopics).map(([star, topics]) => (
          <div key={star} className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] p-3.5 space-y-1.5">
            <p className="text-xs font-extrabold text-[#B86337] dark:text-amber-400">
              {star} Priority
            </p>
            <ul className="list-disc ml-4 text-xs text-[#5C6468] dark:text-gray-400 space-y-1 font-medium">
              {Array.isArray(topics) ? topics.map((t, i) => (
                <li key={i}>{t}</li>
              )) : <li>{String(topics)}</li>}
            </ul>
          </div>
        ))}
      </section>

      {/* Exam Importance */}
      {importance && (
        <section className="rounded-2xl bg-[#FAF0DC] dark:bg-[#1e1e1e] border border-[#DA9B42]/30 dark:border-[#303030] p-3.5 space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#B86337] dark:text-amber-400">
            🔥 Exam Weightage
          </p>
          <p className="text-xs font-bold text-[#1E2224] dark:text-white leading-relaxed">
            {importance}
          </p>
        </section>
      )}

      {/* Important Questions */}
      {shortQuestions.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C6468] dark:text-gray-400 flex items-center gap-1.5">
            <FiHelpCircle className="text-[#2B5866] dark:text-teal-400" /> Predicted Questions
          </p>
          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626] p-3.5 space-y-2">
            <ul className="list-disc ml-4 text-xs text-[#5C6468] dark:text-gray-400 space-y-2 leading-relaxed font-medium">
              {shortQuestions.slice(0, 3).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

    </div>
  );
}

export default Sidebar;
