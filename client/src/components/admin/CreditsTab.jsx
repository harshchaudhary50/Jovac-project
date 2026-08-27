import React, { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { FiPlus, FiMinus, FiSearch, FiZap, FiCheck, FiX } from 'react-icons/fi';

function CreditsTab({ creditLogs = [], users = [], refreshData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(users[0]?.email || '');
    const [amountToAdd, setAmountToAdd] = useState(50);
    const [loading, setLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const safeCreditLogs = Array.isArray(creditLogs) ? creditLogs : [];
    const safeUsers = Array.isArray(users) ? users : [];

    const filteredLogs = safeCreditLogs.filter(log => {
        const userStr = (log?.user || '').toLowerCase();
        const emailStr = (log?.email || '').toLowerCase();
        const actionStr = (log?.action || '').toLowerCase();
        const search = searchTerm.trim().toLowerCase();

        const matchesSearch = !search || userStr.includes(search) || emailStr.includes(search) || actionStr.includes(search);
        
        let matchesType = true;
        if (typeFilter === 'Deduction') {
            matchesType = (log?.credits || 0) < 0;
        } else if (typeFilter === 'Addition') {
            matchesType = (log?.credits || 0) > 0;
        }

        return matchesSearch && matchesType;
    });

    const handleAddCreditsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const emailTarget = selectedUserEmail || safeUsers[0]?.email;
            await axios.post(`${serverUrl}/api/admin/credits/add`, {
                email: emailTarget,
                creditsToAdd: parseInt(amountToAdd)
            }, { withCredentials: true });
            
            setShowAddModal(false);
            setToastMsg(`Successfully allocated ${amountToAdd} credits to ${emailTarget}!`);
            setTimeout(() => setToastMsg(''), 3000);
            if (refreshData) refreshData();
        } catch (error) {
            console.error('Error granting credits:', error);
            alert('Failed to grant credits. Please check server connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 font-sans">
            {toastMsg && (
                <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-[#EEEEEE] text-xs font-medium flex items-center justify-between animate-fade-in">
                    <span>{toastMsg}</span>
                    <button onClick={() => setToastMsg('')} className="text-xs opacity-70 hover:opacity-100 cursor-pointer"><FiX /></button>
                </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-[#E6E2D3]/60 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search user, email, or action..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] transition"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Transactions</option>
                            <option value="Addition">Grants / Bonuses (+)</option>
                            <option value="Deduction">Notes Spent (-)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            if (safeUsers.length > 0 && !selectedUserEmail) {
                                setSelectedUserEmail(safeUsers[0].email);
                            }
                            setShowAddModal(true);
                        }}
                        className="px-4 py-2 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] hover:opacity-90 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                        <FiPlus className="w-4 h-4" /> Grant Credits
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-[#EEEEEE]">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1a1a1a] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-[#E6E2D3]/70 text-[11px] font-semibold">
                            <tr>
                                <th className="p-3.5">User</th>
                                <th className="p-3.5">Action & Details</th>
                                <th className="p-3.5">Credit Delta</th>
                                <th className="p-3.5 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-[#262626]">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => {
                                    const isPositive = log.credits > 0;
                                    return (
                                        <tr key={log.id} className="hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1f1f1f] transition-colors">
                                            <td className="p-3.5 font-medium text-[#1E2224] dark:text-[#FFFFFF]">
                                                <div>{log.user}</div>
                                                <div className="text-[10px] text-[#877F76] dark:text-[#E6E2D3]/50 font-normal">{log.email}</div>
                                            </td>
                                            <td className="p-3.5 text-[#1E2224] dark:text-[#EEEEEE] font-medium">{log.action}</td>
                                            <td className="p-3.5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F0EDE6] dark:bg-[#222222] text-[#4A4740] dark:text-[#E6E2D3] border border-[#E6E2D3] dark:border-[#333333]">
                                                    {isPositive ? <FiPlus className="w-3 h-3 text-[#877F76] dark:text-[#E6E2D3]" /> : <FiMinus className="w-3 h-3 text-[#877F76] dark:text-[#E6E2D3]" />}
                                                    <span>{Math.abs(log.credits)} Credits</span>
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-right text-[#5C6468] dark:text-[#E6E2D3]/70 font-normal">{log.date}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[#5C6468] dark:text-[#E6E2D3]/60 font-medium">
                                        No credit transactions found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Add Credits Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleAddCreditsSubmit} className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-[#EEEEEE]">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-base font-serif font-bold text-[#1E2224] dark:text-[#FFFFFF] flex items-center gap-2">
                                <FiZap className="text-[#5C6468] dark:text-[#E6E2D3]" /> Manual Credit Grant
                            </h3>
                            <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="text-[#5C6468] dark:text-[#E6E2D3]/70 block mb-1 font-medium">Select User</label>
                                <select
                                    value={selectedUserEmail}
                                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-[#EEEEEE] font-medium cursor-pointer"
                                >
                                    {safeUsers.map(u => (
                                        <option key={u._id} value={u.email}>{u.name} ({u.email}) - {u.credits ?? 50} Cr</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[#5C6468] dark:text-[#E6E2D3]/70 block mb-1 font-medium">Credits to Add</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5000"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-[#EEEEEE] font-medium text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-[#262626]">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 rounded-full border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-[#EEEEEE] text-xs font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                            >
                                <FiCheck className="w-4 h-4" /> {loading ? 'Granting...' : 'Confirm Grant'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreditsTab;
