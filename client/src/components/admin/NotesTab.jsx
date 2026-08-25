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
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-96">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by topic, user, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-medium text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-gray-200">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1f1f1f] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-gray-400 uppercase tracking-wider text-[11px] font-extrabold">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Topic Generated</th>
                                <th className="p-4">Format Type</th>
                                <th className="p-4">Credits</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5] dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1e1e1e] transition-colors">
                                        <td className="p-4 font-bold text-[#1E2224] dark:text-white flex items-center gap-2">
                                            <FiUser className="text-[#5C6468] dark:text-gray-400" />
                                            <span>{log.user}</span>
                                        </td>
                                        <td className="p-4 text-[#1E2224] dark:text-white font-semibold max-w-xs truncate">
                                            {log.topic}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-[#FAF7F2] dark:bg-[#222222] text-[#B86337] dark:text-amber-400 border border-[#E8DFD5] dark:border-[#303030]">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 font-extrabold text-[#DA9B42] dark:text-amber-400">
                                                <FiZap className="w-3.5 h-3.5" /> -{log.creditsUsed || 10}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#5C6468] dark:text-gray-400 font-medium">{log.date}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#C85A32] dark:hover:bg-white text-[#1E2224] dark:text-white hover:text-white dark:hover:text-[#0d0d0d] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                                            >
                                                <FiEye className="w-3.5 h-3.5 text-[#DA9B42] dark:text-amber-400" /> View Note
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#5C6468] dark:text-gray-400 font-medium">
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
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 space-y-4 shadow-2xl text-[#1E2224] dark:text-white max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <FiFileText className="text-[#C85A32] dark:text-amber-400 w-5 h-5" />
                                <h3 className="text-base font-extrabold font-serif-title truncate max-w-md">{selectedLog.topic}</h3>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-[#5C6468] dark:text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] shrink-0">
                            <div>
                                <span className="text-[#5C6468] dark:text-gray-400 block text-[10px] uppercase font-bold">User</span>
                                <span className="font-bold text-[#1E2224] dark:text-white">{selectedLog.user}</span>
                            </div>
                            <div>
                                <span className="text-[#5C6468] dark:text-gray-400 block text-[10px] uppercase font-bold">Note Type</span>
                                <span className="font-bold text-[#1E2224] dark:text-white">{selectedLog.type}</span>
                            </div>
                            <div>
                                <span className="text-[#5C6468] dark:text-gray-400 block text-[10px] uppercase font-bold">Timestamp</span>
                                <span className="font-bold text-[#5C6468] dark:text-gray-400">{selectedLog.date}</span>
                            </div>
                        </div>

                        <div className="overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs leading-relaxed font-sans">
                            <p className="font-extrabold text-sm border-b border-[#E8DFD5] dark:border-[#303030] pb-2 text-[#C85A32] dark:text-amber-400">
                                📌 High Priority AI Note Breakdown
                            </p>
                            <p><strong>Topic:</strong> {selectedLog.topic}</p>
                            <p className="text-[#5C6468] dark:text-gray-400">Generated high-yield exam preparation note covering key formulas, diagram explanations, and priority questions.</p>
                        </div>

                        <div className="flex justify-end pt-2 shrink-0">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 rounded-full bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold cursor-pointer"
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
