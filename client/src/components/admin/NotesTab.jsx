import React, { useState } from 'react';
import { FiSearch, FiFileText, FiEye, FiX, FiUser, FiZap } from 'react-icons/fi';

function NotesTab({ logs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    const safeLogs = Array.isArray(logs) ? logs : [];

    const filteredLogs = safeLogs.filter(l => {
        const userStr = (l?.user || '').toLowerCase();
        const topicStr = (l?.topic || '').toLowerCase();
        const typeStr = (l?.type || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return userStr.includes(searchLower) || topicStr.includes(searchLower) || typeStr.includes(searchLower);
    });

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-sm">
                <div className="relative w-full sm:w-96">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52565c] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by topic, user, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-medium text-[#1e2025] dark:text-white placeholder-gray-500 focus:outline-none focus:border-[#1e2025] dark:focus:border-white"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e2025] dark:text-gray-200">
                        <thead className="bg-[#EDEBE0]/50 dark:bg-[#1f1f1f] border-b border-[#B2B4B7]/40 dark:border-[#262626] text-[#52565c] dark:text-gray-400 uppercase tracking-wider text-[11px] font-extrabold">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Topic Generated</th>
                                <th className="p-4">Format Type</th>
                                <th className="p-4">Credits</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#B2B4B7]/20 dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#EDEBE0]/30 dark:hover:bg-[#1e1e1e] transition-colors">
                                        <td className="p-4 font-bold text-[#1e2025] dark:text-white flex items-center gap-2">
                                            <FiUser className="text-[#52565c] dark:text-gray-400" />
                                            <span>{log.user}</span>
                                        </td>
                                        <td className="p-4 text-[#1e2025] dark:text-white font-semibold max-w-xs truncate">
                                            {log.topic}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-[#EDEBE0]/60 dark:bg-[#222222] text-[#1e2025] dark:text-gray-300 border border-[#B2B4B7]/40 dark:border-[#303030]">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 font-extrabold text-amber-500">
                                                <FiZap className="w-3.5 h-3.5" /> -{log.creditsUsed || 10}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#52565c] dark:text-gray-400 font-medium">{log.date}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="px-4 py-2 rounded-full bg-white dark:bg-[#222222] text-[#1e2025] dark:text-white border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-bold hover:border-[#1e2025] transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                                            >
                                                <FiEye className="w-3.5 h-3.5 text-amber-500" /> View Note
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                                        No generation logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-3xl p-6 space-y-4 shadow-2xl text-[#1e2025] dark:text-white max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-[#B2B4B7]/30 dark:border-[#262626] pb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <FiFileText className="text-amber-500 w-5 h-5" />
                                <h3 className="text-base font-extrabold font-serif-title truncate max-w-md">{selectedLog.topic}</h3>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs p-4 rounded-2xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] shrink-0">
                            <div>
                                <span className="text-[#52565c] dark:text-gray-400 block text-[10px] uppercase font-bold">User</span>
                                <span className="font-bold text-[#1e2025] dark:text-white">{selectedLog.user}</span>
                            </div>
                            <div>
                                <span className="text-[#52565c] dark:text-gray-400 block text-[10px] uppercase font-bold">Note Type</span>
                                <span className="font-bold text-[#1e2025] dark:text-white">{selectedLog.type}</span>
                            </div>
                            <div>
                                <span className="text-[#52565c] dark:text-gray-400 block text-[10px] uppercase font-bold">Timestamp</span>
                                <span className="font-bold text-[#52565c] dark:text-gray-300">{selectedLog.date}</span>
                            </div>
                        </div>

                        <div className="overflow-y-auto space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs leading-relaxed font-sans">
                            <p className="font-extrabold text-sm border-b border-[#B2B4B7]/30 pb-2">
                                📌 High Priority AI Note Breakdown
                            </p>
                            <p><strong>Topic:</strong> {selectedLog.topic}</p>
                            <p className="text-[#52565c] dark:text-gray-300">Generated high-yield exam preparation note covering key formulas, diagram explanations, and 5-star priority questions.</p>
                        </div>

                        <div className="flex justify-end pt-2 shrink-0">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold"
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
