import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { FiSearch, FiEye, FiShield, FiX, FiCheck } from 'react-icons/fi';

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
        const emailStr = (item?.email || '').toLowerCase();
        const contentStr = (item?.content || item?.topic || '').toLowerCase();
        const search = searchTerm.trim().toLowerCase();
        const matchesSearch = !search || userStr.includes(search) || emailStr.includes(search) || contentStr.includes(search);
        
        const itemStatus = (item?.status || 'Normal').toLowerCase();
        const filterStatus = statusFilter.trim().toLowerCase();
        const matchesStatus = filterStatus === 'all' || itemStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = async (id, newStatus) => {
        setLogs(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        setSelectedItem(null);
        try {
            await axios.post(`${serverUrl}/api/admin/content-monitoring/update`, {
                noteId: id,
                status: newStatus
            }, { withCredentials: true });
        } catch (error) {
            console.error("Failed to update status in DB:", error);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-[#E6E2D3]/60 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by user or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3]"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Normal">Normal</option>
                        <option value="Needs Review">Needs Review</option>
                        <option value="Reviewed">Reviewed</option>
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
                                <th className="p-3.5">Generated Content</th>
                                <th className="p-3.5">Similarity %</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((item) => {
                                    const rawSim = item?.similarity ?? 1;
                                    const sim = parseInt(String(rawSim).replace(/[^0-9]/g, ''), 10) || 1;

                                    return (
                                        <tr key={item.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1f1f1f] transition-colors">
                                            <td className="p-3.5 font-medium text-[#1E2224] dark:text-[#FFFFFF]">{item.user || 'Student'}</td>
                                            <td className="p-3.5 text-[#1E2224] dark:text-[#EEEEEE] font-medium max-w-xs truncate">
                                                {item.content || item.topic || 'AI Note'}
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-[#FAF7F2] dark:bg-[#222222] h-1.5 rounded-full overflow-hidden border border-[#E8DFD5] dark:border-[#333333]">
                                                        <div 
                                                            className="h-full rounded-full bg-[#5C6468] dark:bg-[#E6E2D3]"
                                                            style={{ width: `${Math.max(sim, 4)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-medium text-xs text-[#5C6468] dark:text-[#E6E2D3]">
                                                        {sim}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3.5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F0EDE6] dark:bg-[#222222] text-[#4A4740] dark:text-[#E6E2D3] border border-[#E6E2D3] dark:border-[#333333]">
                                                    {item.status || 'Normal'}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-right">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="px-3.5 py-1 rounded-full bg-[#C85A32] text-white hover:bg-[#B24B27] text-[11px] font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                                                >
                                                    <FiEye className="w-3.5 h-3.5" /> Review
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[#5C6468] dark:text-[#E6E2D3]/60 font-medium">
                                        No content logs found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-[#EEEEEE]">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#1E2224] dark:text-[#FFFFFF]">
                                <FiShield className="text-[#5C6468] dark:text-[#E6E2D3]" /> Similarity Detection Details
                            </h3>
                            <button onClick={() => setSelectedItem(null)} className="text-[#5C6468] dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 font-medium">User:</span>
                                    <span className="font-semibold text-[#1E2224] dark:text-[#FFFFFF]">{selectedItem.user}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 font-medium">Topic:</span>
                                    <span className="font-semibold text-[#1E2224] dark:text-[#FFFFFF]">{selectedItem.content || selectedItem.topic}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#5C6468] dark:text-[#E6E2D3]/70 font-medium">Similarity Match:</span>
                                    <span className="font-semibold text-[#1E2224] dark:text-[#E6E2D3]">{selectedItem.similarity || 1}% Match Detected</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-[#262626]">
                            <button
                                onClick={() => handleUpdateStatus(selectedItem.id, 'Normal')}
                                className="px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] text-[#1E2224] dark:text-[#EEEEEE] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium cursor-pointer hover:bg-[#E8DFD5] dark:hover:bg-[#333333]"
                            >
                                Mark Normal
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(selectedItem.id, 'Reviewed')}
                                className="px-5 py-2 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition"
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
