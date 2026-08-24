import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { getNotesHistory } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FinalResult from '../components/FinalResult';
import Sidebar from '../components/Sidebar';
import { 
  FiClock, 
  FiSearch, 
  FiZap, 
  FiBookOpen, 
  FiShare2, 
  FiTrash2, 
  FiExternalLink, 
  FiChevronRight,
  FiArrowLeft,
  FiCalendar,
  FiLayers
} from 'react-icons/fi';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getNotesHistory();
      setHistory(data.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    item.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.classLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.examType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EDEBE0] dark:bg-[#0d0d0d] text-[#1e2025] dark:text-[#ffffff] relative overflow-hidden font-sans selection:bg-[#EDEBE0] selection:text-[#1e2025] transition-colors duration-300">
      
      {/* Background Soft Organic Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-center" />
      <div className="trekt-bg-blob-bottom" />

      {/* Global Responsive Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-32 pb-16 relative z-10 space-y-8 font-sans">
        
        {/* Header Section / Note Reader Header */}
        {selectedNote ? (
          <div className="flex items-center justify-between gap-4 bg-[#EDEBE0] dark:bg-[#161616] p-6 rounded-3xl border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow">
            <button
              onClick={() => setSelectedNote(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#222222] hover:bg-[#1e2025] dark:hover:bg-white text-[#1e2025] dark:text-white hover:text-white dark:hover:text-[#0d0d0d] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to History List</span>
            </button>
            <span className="text-xs font-extrabold text-[#52565c] dark:text-gray-400 uppercase tracking-wider truncate">
              Viewing Note: <strong className="text-[#1e2025] dark:text-white">{selectedNote.topic}</strong>
            </span>
          </div>
        ) : (
          <div className="relative bg-[#EDEBE0] dark:bg-[#161616] px-8 sm:px-12 py-8 sm:py-10 rounded-[28px] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-2 z-10 max-w-2xl text-center md:text-left py-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52565c] dark:text-gray-400 block">
                Personal Study Library
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif text-[#1e2025] dark:text-white tracking-tight leading-tight">
                Generated Note History
              </h1>
              <p className="text-xs sm:text-sm text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
                Review, study, and revisit all your previously generated exam notes, 5-minute revision sheets, and visual flowcharts anytime.
              </p>
            </div>

            {/* Search Input Widget */}
            <div className="w-full md:w-72 relative shrink-0">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71757c] dark:text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search history by topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-bold text-[#1e2025] dark:text-white placeholder-[#71757c] dark:placeholder-gray-400 focus:outline-none focus:border-[#1e2025] dark:focus:border-white shadow-xs transition-all"
              />
            </div>
          </div>
        )}

        {/* Note Reader View Mode */}
        {selectedNote ? (
          <motion.div
            initial={{ opacity: 0, rotateY: -15, scale: 0.98 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
          >
            <div className="lg:col-span-1">
              <Sidebar result={selectedNote.content} />
            </div>

            <div className="lg:col-span-3 bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-3xl p-6 sm:p-8 trekt-card-shadow">
              <FinalResult result={selectedNote.content} />
            </div>
          </motion.div>
        ) : (
          /* History Grid View */
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-3 border-[#1e2025] dark:border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#52565c] dark:text-gray-400">Loading your study library...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-dashed border-[#B2B4B7]/60 dark:border-[#262626] text-center space-y-3 trekt-card-shadow">
                <FiBookOpen className="w-8 h-8 text-[#1e2025] dark:text-white mx-auto" />
                <h3 className="text-base font-extrabold text-[#1e2025] dark:text-white">No Notes Found in History</h3>
                <p className="text-xs text-[#52565c] dark:text-gray-400 font-medium">
                  {searchTerm ? "No saved notes match your search term." : "You haven't generated any AI notes yet. Create your first note now!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistory.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedNote(item)}
                    className="p-6 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow trekt-card-hover cursor-pointer flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold text-[#52565c] dark:text-gray-400 uppercase tracking-wider">
                          {item.examType || "Concept Note"}
                        </span>
                        {item.createdAt && (
                          <span className="text-[10px] text-[#71757c] dark:text-gray-400 font-bold flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Title & Course */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold tracking-tight text-[#1e2025] dark:text-white group-hover:underline line-clamp-2">
                          {item.topic}
                        </h3>
                        {item.classLevel && (
                          <p className="text-xs text-[#52565c] dark:text-gray-400 font-semibold truncate">
                            {item.classLevel}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-[#B2B4B7]/30 dark:border-[#303030] flex items-center justify-between text-xs font-bold text-[#1e2025] dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <FiBookOpen className="w-3.5 h-3.5 text-[#1e2025] dark:text-white" />
                        <span>Read Note</span>
                      </span>
                      <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#1e2025] dark:text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default History;
