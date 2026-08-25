import React, { useState } from 'react';
import { 
    FiSearch, 
    FiPlus, 
    FiEdit2, 
    FiX, 
    FiCheck, 
    FiZap 
} from 'react-icons/fi';
import axios from 'axios';
import { serverUrl } from '../../App';

function UsersTab({ users, refreshData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Modal states
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddCreditModal, setShowAddCreditModal] = useState(false);
    
    // Form fields
    const [editRole, setEditRole] = useState('Student');
    const [editCredits, setEditCredits] = useState(50);
    const [editStatus, setEditStatus] = useState('Active');
    const [creditsToAdd, setCreditsToAdd] = useState(50);
    const [loading, setLoading] = useState(false);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setEditRole(user.role || 'Student');
        setEditCredits(user.credits ?? 50);
        setEditStatus(user.status || 'Active');
        setShowEditModal(true);
    };

    const handleOpenAddCredit = (user) => {
        setSelectedUser(user);
        setCreditsToAdd(50);
        setShowAddCreditModal(true);
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;
        setLoading(true);
        try {
            await axios.post(`${serverUrl}/api/admin/users/update`, {
                userId: selectedUser._id,
                role: editRole,
                credits: editCredits,
                status: editStatus
            });
            setShowEditModal(false);
            refreshData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCreditsSubmit = async () => {
        if (!selectedUser) return;
        setLoading(true);
        try {
            await axios.post(`${serverUrl}/api/admin/credits/add`, {
                userId: selectedUser._id,
                creditsToAdd: creditsToAdd
            });
            setShowAddCreditModal(false);
            refreshData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-medium text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-[#5C6468] dark:text-gray-400 font-bold uppercase tracking-wider">Role:</span>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold text-[#1E2224] dark:text-white focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-gray-200">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1f1f1f] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-gray-400 uppercase tracking-wider text-[11px] font-extrabold">
                            <tr>
                                <th className="p-3.5">User</th>
                                <th className="p-3.5">Email</th>
                                <th className="p-3.5">Role</th>
                                <th className="p-3.5">Credits</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5] dark:divide-[#262626]">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1e1e1e] transition-colors">
                                        <td className="p-3.5 font-bold text-[#1E2224] dark:text-white flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#2B5866] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center font-extrabold text-[11px] uppercase">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="p-3.5 text-[#5C6468] dark:text-gray-400 font-medium">{u.email}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${
                                                u.role === 'Admin' 
                                                    ? 'bg-[#2B5866] dark:bg-white text-white dark:text-[#0d0d0d] border-[#2B5866] dark:border-white' 
                                                    : u.role === 'Teacher'
                                                    ? 'bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-amber-400 border-[#DA9B42]/30 dark:border-[#303030]'
                                                    : 'bg-[#F5EBE1] dark:bg-[#222222] text-[#C85A32] dark:text-gray-300 border-[#EBD7BE] dark:border-[#303030]'
                                            }`}>
                                                {u.role || 'Student'}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-1 font-extrabold text-[#DA9B42] dark:text-amber-400">
                                                <FiZap className="w-3.5 h-3.5" />
                                                <span>{u.credits}</span>
                                            </div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`font-extrabold text-[11px] ${
                                                u.status === 'Active' 
                                                    ? 'text-[#6B7B52] dark:text-emerald-400' 
                                                    : 'text-red-500'
                                            }`}>
                                                {u.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenAddCredit(u)}
                                                    className="px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#2B5866] dark:hover:bg-white text-[#2B5866] dark:text-white hover:text-white dark:hover:text-[#0d0d0d] border border-[#E8DFD5] dark:border-[#303030] text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <FiPlus className="w-3 h-3" /> Credits
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="px-3 py-1 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#B24B27] dark:hover:bg-gray-100 text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <FiEdit2 className="w-3 h-3" /> Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#5C6468] dark:text-gray-400 font-medium">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-white">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-sm font-extrabold flex items-center gap-2">
                                Edit User Settings
                            </h3>
                            <button onClick={() => setShowEditModal(false)} className="text-[#5C6468] dark:text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-0.5">User Profile</label>
                                <p className="font-extrabold text-sm text-[#1E2224] dark:text-white">{selectedUser.name}</p>
                                <p className="text-[#5C6468] dark:text-gray-400 font-medium">{selectedUser.email}</p>
                            </div>

                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-1 font-bold">Role</label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-1 font-bold">Credits Balance</label>
                                <input
                                    type="number"
                                    value={editCredits}
                                    onChange={(e) => setEditCredits(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                />
                            </div>

                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-1 font-bold">Account Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Disabled">Disabled</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-[#262626]">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] text-[#5C6468] dark:text-gray-300 text-xs font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                disabled={loading}
                                className="px-5 py-2 rounded-full bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                                <FiCheck className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Add Credit Modal */}
            {showAddCreditModal && selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-white">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-sm font-extrabold flex items-center gap-2">
                                <FiZap className="text-[#DA9B42] dark:text-amber-400" /> Allocate Credits
                            </h3>
                            <button onClick={() => setShowAddCreditModal(false)} className="text-[#5C6468] dark:text-gray-400 hover:text-black dark:hover:text-white">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <p className="text-[#5C6468] dark:text-gray-400 font-medium">
                                Add AI credits to <span className="font-bold text-[#1E2224] dark:text-white">{selectedUser.name}</span>.
                            </p>

                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 block mb-2 font-bold">Credits to Add</label>
                                <div className="flex items-center gap-2">
                                    {[20, 50, 100, 200].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setCreditsToAdd(num)}
                                            className={`px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition ${
                                                creditsToAdd === num
                                                    ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] border-[#C85A32] dark:border-white'
                                                    : 'bg-[#FAF7F2] dark:bg-[#222222] text-[#1E2224] dark:text-white border-[#E8DFD5] dark:border-[#303030]'
                                            }`}
                                        >
                                            +{num}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={creditsToAdd}
                                    onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                                    className="w-full mt-3 px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD5] dark:border-[#262626]">
                            <button
                                onClick={() => setShowAddCreditModal(false)}
                                className="px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] text-[#5C6468] dark:text-gray-300 text-xs font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCreditsSubmit}
                                disabled={loading}
                                className="px-5 py-2 rounded-full bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                                <FiPlus className="w-4 h-4" /> Add {creditsToAdd} Credits
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersTab;
