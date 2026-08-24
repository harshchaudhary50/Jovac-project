import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiSearch, FiEye, FiShield, FiX, FiCheck } from 'react-icons/fi';

function ContentMonitoringTab({ contentLogs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [logs, setLogs] = useState(Array.isArray(contentLogs) ? contentLogs : []);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (Array.isArray(contentLogs)) {
            setLogs(contentLogs);
        }
    }, [contentLogs]);

    const safeLogs = Array.isArray(logs) ? logs : [];

    const filteredLogs = safeLogs.filter(item => {
        const userStr = (item?.user || '').toLowerCase();
        const contentStr = (item?.content || item?.topic || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = userStr.includes(searchLower) || contentStr.includes(searchLower);
        const matchesStatus = statusFilter === 'All' || item?.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = (id, newStatus) => {
        setLogs(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        setSelectedItem(null);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52565c] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by user or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-medium text-[#1e2025] dark:text-white placeholder-gray-500 focus:outline-none focus:border-[#1e2025] dark:focus:border-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-[#52565c] dark:text-gray-400 font-bold uppercase tracking-wider">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-full bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-bold text-[#1e2025] dark:text-white focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Normal">Normal</option>
                        <option value="Needs Review">Needs Review</option>
                        <option value="Reviewed">Reviewed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1e2025] dark:text-gray-200">
                        <thead className="bg-[#EDEBE0]/50 dark:bg-[#1f1f1f] border-b border-[#B2B4B7]/40 dark:border-[#262626] text-[#52565c] dark:text-gray-400 uppercase tracking-wider text-[11px] font-extrabold">
                            <tr>
                                <th className="p-3.5">User</th>
                                <th className="p-3.5">Generated Content</th>
                                <th className="p-3.5">Similarity %</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#B2B4B7]/20 dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((item) => {
                                    const sim = item?.similarity ?? 2;
                                    const isHigh = sim >= 50;
                                    const isMedium = sim >= 30 && sim < 50;

                                    return (
                                        <tr key={item.id} className="hover:bg-[#EDEBE0]/30 dark:hover:bg-[#1e1e1e] transition-colors">
                                            <td className="p-3.5 font-bold text-[#1e2025] dark:text-white">{item.user || 'Student'}</td>
                                            <td className="p-3.5 text-[#1e2025] dark:text-white font-medium max-w-xs truncate">
                                                {item.content || item.topic || 'AI Note'}
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-[#EDEBE0] dark:bg-[#222222] h-2 rounded-full overflow-hidden border border-[#B2B4B7]/40">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                isHigh ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`}
                                                            style={{ width: `${sim}%` }}
                                                        />
                                                    </div>
                                                    <span className={`font-extrabold text-xs ${
                                                        isHigh ? 'text-red-600 dark:text-red-400' : isMedium ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {sim}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                                    item.status === 'Needs Review'
                                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                                        : item.status === 'Reviewed'
                                                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60'
                                                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                                }`}>
                                                    {item.status || 'Normal'}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-right">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="px-3 py-1 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-black text-[11px] font-extrabold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                                                >
                                                    <FiEye className="w-3.5 h-3.5 text-amber-500" /> Review
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                                        No content logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-2xl p-6 space-y-5 shadow-2xl text-[#1e2025] dark:text-white">
                        <div className="flex items-center justify-between border-b border-[#B2B4B7]/30 dark:border-[#262626] pb-3">
                            <h3 className="text-sm font-extrabold flex items-center gap-2">
                                <FiShield className="text-amber-500" /> Similarity Detection Details
                            </h3>
                            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#52565c] dark:text-gray-400 font-bold uppercase">User:</span>
                                    <span className="font-extrabold">{selectedItem.user}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#52565c] dark:text-gray-400 font-bold uppercase">Topic:</span>
                                    <span className="font-extrabold text-[#1e2025] dark:text-white">{selectedItem.content || selectedItem.topic}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#52565c] dark:text-gray-400 font-bold uppercase">Similarity Match:</span>
                                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{selectedItem.similarity}% Match Detected</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B2B4B7]/30 dark:border-[#262626]">
                            <button
                                onClick={() => handleUpdateStatus(selectedItem.id, 'Normal')}
                                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-[#222222] text-[#1e2025] dark:text-gray-300 text-xs font-bold"
                            >
                                Mark Normal
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(selectedItem.id, 'Reviewed')}
                                className="px-5 py-2 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                                <FiCheck className="w-4 h-4" /> Mark Reviewed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContentMonitoringTab;
