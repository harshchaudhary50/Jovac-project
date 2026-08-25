import React, { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { FiPlus, FiMinus, FiSearch, FiZap, FiCheck, FiX } from 'react-icons/fi';

function CreditsTab({ creditLogs, users, refreshData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(users[0]?.email || '');
    const [amountToAdd, setAmountToAdd] = useState(50);
    const [loading, setLoading] = useState(false);

    const filteredLogs = creditLogs.filter(log =>
        log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCreditsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${serverUrl}/api/admin/grant-credits`, {
                email: selectedUserEmail,
                credits: parseInt(amountToAdd)
            });
            setShowAddModal(false);
            refreshData();
        } catch (error) {
            console.error('Error granting credits:', error);
            alert('Failed to grant credits.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search user or action..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-medium text-[#1E2224] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white shadow-xs"
                    />
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#B24B27] dark:hover:bg-gray-100 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                    <FiPlus className="w-4 h-4" /> Grant Credits to User
                </button>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-gray-200">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1f1f1f] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-gray-400 uppercase tracking-wider text-[11px] font-extrabold">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Credit Delta</th>
                                <th className="p-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5]/40 dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => {
                                    const isPositive = log.credits > 0;
                                    return (
                                        <tr key={log.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1e1e1e] transition-colors">
                                            <td className="p-4 font-bold text-[#1E2224] dark:text-white">{log.user}</td>
                                            <td className="p-4 text-[#5C6468] dark:text-gray-300 font-semibold">{log.action}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] flex items-center gap-1 w-fit border ${
                                                    isPositive
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                                }`}>
                                                    {isPositive ? <FiPlus className="w-3 h-3" /> : <FiMinus className="w-3 h-3" />}
                                                    <span>{Math.abs(log.credits)} Credits</span>
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-[#5C6468] dark:text-gray-400 font-medium">{log.date}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                                        No credit transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Add Credits Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleAddCreditsSubmit} className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-white">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-base font-extrabold font-serif-title flex items-center gap-2">
                                <FiZap className="text-[#DA9B42]" /> Manual Credit Grant
                            </h3>
                            <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-1 font-bold">Select User</label>
                                <select
                                    value={selectedUserEmail}
                                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold cursor-pointer"
                                >
                                    {users.map(u => (
                                        <option key={u._id} value={u.email}>{u.name} ({u.email}) - {u.credits} Cr</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-1 font-bold">Amount to Add</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-[#262626]">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-[#222222] text-[#1E2224] dark:text-gray-300 text-xs font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold flex items-center gap-1.5"
                            >
                                <FiCheck className="w-4 h-4" /> Grant Credits
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreditsTab;
