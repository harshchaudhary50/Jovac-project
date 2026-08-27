import React, { useState } from 'react';
import { FiSearch, FiFileText, FiEye, FiX, FiUser, FiZap, FiCheckCircle } from 'react-icons/fi';

function NotesTab({ notes = [], logs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedLog, setSelectedLog] = useState(null);

    const safeNotes = Array.isArray(notes) && notes.length > 0 ? notes : (Array.isArray(logs) ? logs : []);

    const filteredNotes = safeNotes.filter(l => {
        const userStr = (l?.user || '').toLowerCase();
        const emailStr = (l?.email || '').toLowerCase();
        const topicStr = (l?.topic || '').toLowerCase();
        const typeStr = (l?.type || '').toLowerCase();
        
        const search = searchTerm.trim().toLowerCase();
        const matchesSearch = !search || 
            userStr.includes(search) || 
            emailStr.includes(search) || 
            topicStr.includes(search) || 
            typeStr.includes(search);

        const matchesType = typeFilter === 'All' || typeStr.includes(typeFilter.toLowerCase());

        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 font-sans">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-[#E6E2D3]/60 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by topic, user, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] transition"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[11px] text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold">Format:</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Formats</option>
                        <option value="DBMS">DBMS Notes</option>
                        <option value="DSA">DSA Notes</option>
                        <option value="Biotech">Biotech Notes</option>
                        <option value="Computer">Computer Science</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-[#EEEEEE]">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1a1a1a] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-[#E6E2D3]/70 text-[11px] font-semibold">
                            <tr>
                                <th className="p-3.5">User</th>
                                <th className="p-3.5">Topic Generated</th>
                                <th className="p-3.5">Format Type</th>
                                <th className="p-3.5">Credits</th>
                                <th className="p-3.5">Date</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-[#262626]">
                            {filteredNotes.length > 0 ? (
                                filteredNotes.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1f1f1f] transition-colors">
                                        <td className="p-3.5 font-medium text-[#1E2224] dark:text-[#FFFFFF]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#E8DFD5] dark:bg-[#262626] text-[#1E2224] dark:text-[#E6E2D3] flex items-center justify-center font-bold text-[10px]">
                                                    {(log.user || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div>{log.user || 'Student User'}</div>
                                                    <div className="text-[10px] text-[#877F76] dark:text-[#E6E2D3]/50">{log.email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-[#1E2224] dark:text-[#EEEEEE] font-medium max-w-xs truncate">
                                            {log.topic}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F0EDE6] dark:bg-[#222222] text-[#4A4740] dark:text-[#E6E2D3] border border-[#E6E2D3] dark:border-[#333333]">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="flex items-center gap-1 font-semibold text-[#1E2224] dark:text-[#E6E2D3]">
                                                <FiZap className="w-3.5 h-3.5 text-[#877F76] dark:text-[#E6E2D3]" /> -{log.creditsUsed || 10}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-[#5C6468] dark:text-[#E6E2D3]/70 font-normal">{log.date}</td>
                                        <td className="p-3.5 text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="px-3.5 py-1.5 rounded-full bg-[#C85A32] text-white hover:bg-[#B24B27] text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                                            >
                                                <FiEye className="w-3.5 h-3.5" /> View Note
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#5C6468] dark:text-[#E6E2D3]/60 font-medium">
                                        No notes found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] rounded-3xl p-6 space-y-4 shadow-2xl text-[#1E2224] dark:text-[#EEEEEE] max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <FiFileText className="text-[#5C6468] dark:text-[#E6E2D3] w-5 h-5" />
                                <h3 className="text-base font-serif font-bold truncate max-w-md text-[#1E2224] dark:text-[#FFFFFF]">{selectedLog.topic}</h3>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-[#5C6468] dark:text-gray-400 hover:text-white cursor-pointer">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] shrink-0">
                            <div>
                                <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 block text-[10px] uppercase font-medium">User</span>
                                <span className="font-semibold text-[#1E2224] dark:text-[#FFFFFF]">{selectedLog.user}</span>
                            </div>
                            <div>
                                <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 block text-[10px] uppercase font-medium">Note Format</span>
                                <span className="font-semibold text-[#1E2224] dark:text-[#FFFFFF]">{selectedLog.type}</span>
                            </div>
                            <div>
                                <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 block text-[10px] uppercase font-medium">Generated At</span>
                                <span className="font-medium text-[#5C6468] dark:text-[#E6E2D3]/80">{selectedLog.date}</span>
                            </div>
                        </div>

                        <div className="overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs leading-relaxed font-sans">
                            <p className="font-semibold text-sm border-b border-[#E8DFD5] dark:border-[#333333] pb-2 text-[#1E2224] dark:text-[#FFFFFF] flex items-center gap-1.5">
                                <FiCheckCircle className="text-[#877F76] dark:text-[#E6E2D3]" /> Topic Details
                            </p>
                            <p><strong>Topic Name:</strong> {selectedLog.topic}</p>
                            <p><strong>Associated Email:</strong> {selectedLog.email || 'N/A'}</p>
                            <p className="text-[#5C6468] dark:text-[#E6E2D3]/70">Generated high-yield exam preparation note covering key formulas, diagram explanations, and priority questions.</p>
                        </div>

                        <div className="flex justify-end pt-2 shrink-0">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] text-xs font-semibold cursor-pointer hover:opacity-90 transition"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotesTab;
