import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiArrowRight, FiCpu } from 'react-icons/fi';

function GlobalGenerationIndicator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGenerating, activeTopic } = useSelector((state) => state.generator);

  // Do not show floating pill if user is already on the /notes page where full UI is visible
  if (location.pathname === '/notes') return null;

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          onClick={() => navigate('/notes')}
          className="fixed bottom-6 right-6 z-50 p-4 px-5 rounded-2xl bg-white dark:bg-[#161616] text-[#1E2224] dark:text-white shadow-2xl border border-[#E8DFD5] dark:border-[#333333] flex items-center gap-3.5 cursor-pointer hover:scale-105 transition-transform"
        >
          {/* Animated Spinner with high contrast in both themes */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-[#E8DFD5] dark:border-[#333333] rounded-full" />
            <div className="w-4 h-4 border-2 border-[#C85A32] dark:border-amber-400 border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>

          <div className="text-xs">
            <span className="font-extrabold uppercase tracking-wider block text-[10px] text-[#C85A32] dark:text-amber-400">
              Generating in Background
            </span>
            <span className="font-bold line-clamp-1 max-w-[200px] text-[#1E2224] dark:text-white">
              {activeTopic || "Synthesizing Notes..."}
            </span>
          </div>

          <div className="p-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] text-[#C85A32] dark:text-amber-400 shrink-0">
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GlobalGenerationIndicator;
