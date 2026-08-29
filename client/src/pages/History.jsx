import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from 'react-router-dom';
import { getNotesHistory, deleteNoteApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FinalResult from '../components/FinalResult';
import Sidebar from '../components/Sidebar';
import { 
  FiSearch, 
  FiBookOpen, 
  FiTrash2, 
  FiChevronRight,
  FiArrowLeft,
  FiCalendar,
  FiPlus,
  FiZap,
  FiTarget,
  FiShare2,
  FiCheckCircle,
  FiX,
  FiAlertTriangle
} from 'react-icons/fi';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [toastMsg, setToastMsg] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalNote, setDeleteModalNote] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getNotesHistory();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setHistory(list);
      setLoading(false);
    } catch (error) {
      console.error("Fetch history error:", error);
      setHistory([]);
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalNote) return;

    const noteId = deleteModalNote._id;
    const topicName = deleteModalNote.topic || "Note";

    setDeletingId(noteId);
    try {
      await deleteNoteApi(noteId);
      setHistory(prev => prev.filter(item => item._id !== noteId));
      if (selectedNote?._id === noteId) {
        setSelectedNote(null);
      }
      setToastMsg(`Deleted "${topicName}" from history.`);
      setTimeout(() => setToastMsg(""), 3000);
      setDeleteModalNote(null);
    } catch (err) {
      console.error("Delete note error:", err);
      setToastMsg("Failed to delete note. Please try again.");
      setTimeout(() => setToastMsg(""), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHistory = history.filter(item => {
    const topicStr = (item.topic || '').toLowerCase();
    const classStr = (item.classLevel || '').toLowerCase();
    const examStr = (item.examType || '').toLowerCase();
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch = !search || 
      topicStr.includes(search) || 
      classStr.includes(search) || 
      examStr.includes(search);

    let matchesType = true;
    if (filterType === 'Questions') {
      matchesType = examStr.includes('question') || examStr.includes('bank');
    } else if (filterType === 'Revision') {
      matchesType = item.revisionMode || examStr.includes('revision');
    } else if (filterType === 'Diagrams') {
      matchesType = item.includeDiagram || examStr.includes('diagram') || examStr.includes('flowchart');
    } else if (filterType === 'Concept') {
      matchesType = !item.revisionMode && !examStr.includes('question');
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Floating Success Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2224] dark:bg-white text-white dark:text-[#000000] px-4 py-3 rounded-2xl shadow-xl border border-[#E8DFD5] dark:border-[#333333] flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <FiCheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Minimal Aesthetic Confirmation Modal Card */}
      <AnimatePresence>
        {deleteModalNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-[#2a2a2a] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0DC] dark:bg-[#222222] border border-[#DA9B42]/30 dark:border-[#333333] flex items-center justify-center text-[#B86337] dark:text-[#E6E2D3] shrink-0">
                  <FiTrash2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-[#1E2224] dark:text-white">
                    Delete Note
                  </h3>
                  <p className="text-xs text-[#5C6468] dark:text-neutral-400 leading-relaxed font-normal">
                    Are you sure you want to remove <span className="font-semibold text-[#1E2224] dark:text-neutral-200">"{deleteModalNote.topic}"</span> from your saved library?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteModalNote(null)}
                  disabled={deletingId !== null}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#5C6468] dark:text-neutral-300 hover:bg-[#FAF7F2] dark:hover:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1E2224] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-neutral-200 transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {deletingId ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8">
        
        {/* Header Section */}
        {selectedNote ? (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedNote(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] text-xs font-bold text-[#1E2224] dark:text-white hover:border-[#C85A32] dark:hover:border-[#E6E2D3] transition-all cursor-pointer shadow-2xs"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>

            <button
              onClick={() => setDeleteModalNote(selectedNote)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF0DC] dark:bg-[#1f1f1f] border border-[#DA9B42]/30 dark:border-[#333333] text-xs font-semibold text-[#87532A] dark:text-[#E6E2D3] hover:bg-[#FAF7F2] dark:hover:bg-[#282828] transition cursor-pointer"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete Note</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2 border-b border-[#E8DFD5] dark:border-[#262626]">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2224] dark:text-white tracking-tight">
                Generated Note Library
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6468] dark:text-[#E6E2D3]/70 font-medium">
                Review, study, and revisit all your previously generated exam notes, question banks, and visual flowcharts stored in MongoDB cloud.
              </p>
            </div>

            {/* Quick Actions & Search */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#877F76] dark:text-[#E6E2D3]/50" />
                <input
                  type="text"
                  placeholder="Search history by topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full text-xs bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-white placeholder-[#877F76] focus:outline-hidden focus:border-[#C85A32] dark:focus:border-[#E6E2D3] transition-all shadow-2xs"
                />
              </div>

              <button
                onClick={() => navigate('/notes')}
                className="px-4 py-2 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#000000] text-xs font-bold hover:bg-[#B24B27] dark:hover:bg-gray-100 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Note</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Type Pills (When on list view) */}
        {!selectedNote && history.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 font-sans">
            {[
              { id: 'All', label: 'All Saved Notes', icon: FiBookOpen },
              { id: 'Questions', label: 'Question Banks', icon: FiTarget },
              { id: 'Revision', label: '5-Min Sheets', icon: FiZap },
              { id: 'Diagrams', label: 'Flowcharts', icon: FiShare2 },
              { id: 'Concept', label: 'Concept Notes', icon: FiBookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
                  filterType === tab.id
                    ? "bg-[#1E2224] dark:bg-white text-white dark:text-[#000000] shadow-xs"
                    : "bg-white dark:bg-[#161616] text-[#5C6468] dark:text-[#E6E2D3]/70 border border-[#E8DFD5] dark:border-[#333333] hover:border-[#C85A32] dark:hover:border-[#E6E2D3]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Note Reader View Mode */}
        {selectedNote ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
          >
            <div className="lg:col-span-1">
              <Sidebar result={selectedNote.content} />
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 sm:p-8 trekt-card-shadow">
              <FinalResult result={selectedNote.content} />
            </div>
          </motion.div>
        ) : (
          /* History Grid View */
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-3 border-[#C85A32] dark:border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#5C6468] dark:text-[#E6E2D3]/70">Loading your study library...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#161616] border border-dashed border-[#E8DFD5] dark:border-[#262626] text-center space-y-3 trekt-card-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#EBD7BE] dark:border-[#303030] flex items-center justify-center text-[#C85A32] dark:text-white mx-auto">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2224] dark:text-white">No Notes Found in History</h3>
                <p className="text-xs text-[#5C6468] dark:text-[#E6E2D3]/70 font-medium">
                  {searchTerm ? `No saved notes match "${searchTerm}".` : "You haven't generated any AI notes yet. Create your first note now!"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/notes')}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#000000] text-xs font-bold cursor-pointer"
                  >
                    Generate First Note
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistory.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedNote(item)}
                    className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover cursor-pointer flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges & Delete Action */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F0EDE6] dark:bg-[#222222] text-[#4A4740] dark:text-[#E6E2D3] border border-[#E6E2D3] dark:border-[#333333]">
                          {item.examType || (item.revisionMode ? "5-Min Sheet" : "Concept Note")}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {item.createdAt && (
                            <span className="text-[10px] text-[#5C6468] dark:text-[#E6E2D3]/60 font-medium flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModalNote(item);
                            }}
                            title="Delete note"
                            className="p-1 rounded-md text-[#877F76] hover:text-[#1E2224] dark:hover:text-white transition cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Course */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold tracking-tight text-[#1E2224] dark:text-white group-hover:text-[#C85A32] dark:group-hover:text-[#E6E2D3] transition-colors line-clamp-2">
                          {item.topic}
                        </h3>
                        {item.classLevel && (
                          <p className="text-xs text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold truncate">
                            {item.classLevel}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-[#E8DFD5] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-[#C85A32] dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <FiBookOpen className="w-3.5 h-3.5" />
                        <span>Read Note</span>
                      </span>
                      <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
