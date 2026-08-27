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

function UsersTab({ users = [], refreshData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    
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
    const [toastMsg, setToastMsg] = useState('');

    const safeUsers = Array.isArray(users) ? users : [];

    const filteredUsers = safeUsers.filter(u => {
        const nameStr = (u?.name || '').toLowerCase();
        const emailStr = (u?.email || '').toLowerCase();
        const courseStr = (u?.course || '').toLowerCase();
        const semesterStr = (u?.semester || '').toLowerCase();
        const roleStr = (u?.role || 'Student').toLowerCase();
        const statusStr = (u?.status || 'Active').toLowerCase();
        
        const search = searchTerm.trim().toLowerCase();
        const matchesSearch = !search || 
            nameStr.includes(search) || 
            emailStr.includes(search) || 
            courseStr.includes(search) ||
            semesterStr.includes(search);

        const matchesRole = roleFilter === 'All' || roleStr === roleFilter.toLowerCase();
        const matchesStatus = statusFilter === 'All' || statusStr === statusFilter.toLowerCase();

        return matchesSearch && matchesRole && matchesStatus;
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
            }, { withCredentials: true });
            setShowEditModal(false);
            setToastMsg(`User ${selectedUser.name} updated successfully!`);
            setTimeout(() => setToastMsg(''), 3000);
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
            }, { withCredentials: true });
            setShowAddCreditModal(false);
            setToastMsg(`${creditsToAdd} credits added to ${selectedUser.name}!`);
            setTimeout(() => setToastMsg(''), 3000);
            refreshData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {toastMsg && (
                <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-[#1E2224] dark:text-[#EEEEEE] text-xs font-medium flex items-center justify-between animate-fade-in">
                    <span>{toastMsg}</span>
                    <button onClick={() => setToastMsg('')} className="text-xs opacity-70 hover:opacity-100 cursor-pointer"><FiX /></button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-[#E6E2D3]/60 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] placeholder-[#877F76] dark:placeholder-[#E6E2D3]/40 focus:outline-none focus:border-[#C85A32] dark:focus:border-[#E6E2D3] transition"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold">Role:</span>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-[#5C6468] dark:text-[#E6E2D3]/70 font-semibold">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium text-[#1E2224] dark:text-[#EEEEEE] focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E2224] dark:text-[#EEEEEE]">
                        <thead className="bg-[#FAF7F2] dark:bg-[#1a1a1a] border-b border-[#E8DFD5] dark:border-[#262626] text-[#5C6468] dark:text-[#E6E2D3]/70 text-[11px] font-semibold">
                            <tr>
                                <th className="p-3.5">User</th>
                                <th className="p-3.5">Email</th>
                                <th className="p-3.5">Course / Details</th>
                                <th className="p-3.5">Role</th>
                                <th className="p-3.5">Credits</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-[#262626]">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1f1f1f] transition-colors">
                                        <td className="p-3.5 font-medium text-[#1E2224] dark:text-[#FFFFFF] flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#E8DFD5] dark:bg-[#262626] text-[#1E2224] dark:text-[#E6E2D3] flex items-center justify-center font-bold text-[11px]">
                                                {(u.name || 'U').charAt(0)}
                                            </div>
                                            <span>{u.name || 'Student User'}</span>
                                        </td>
                                        <td className="p-3.5 text-[#5C6468] dark:text-[#E6E2D3]/70 font-normal">{u.email}</td>
                                        <td className="p-3.5 text-[#5C6468] dark:text-[#E6E2D3]/70 text-[11px]">
                                            <div className="font-medium text-[#1E2224] dark:text-[#EEEEEE]">{u.course || 'Not Specified'}</div>
                                            <div className="text-[10px] text-[#877F76] dark:text-[#E6E2D3]/50">{u.semester || ''}</div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F0EDE6] dark:bg-[#222222] text-[#4A4740] dark:text-[#E6E2D3] border border-[#E6E2D3] dark:border-[#333333]">
                                                {u.role || 'Student'}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-1 font-semibold text-[#1E2224] dark:text-[#E6E2D3]">
                                                <FiZap className="w-3.5 h-3.5 text-[#877F76] dark:text-[#E6E2D3]" />
                                                <span>{u.credits ?? 50}</span>
                                            </div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="text-[11px] font-medium text-[#5C6468] dark:text-[#E6E2D3]">
                                                {u.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenAddCredit(u)}
                                                    className="px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#E8DFD5] dark:hover:bg-[#333333] text-[#1E2224] dark:text-[#EEEEEE] border border-[#E8DFD5] dark:border-[#333333] text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <FiPlus className="w-3 h-3" /> Credits
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="px-3 py-1 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] hover:opacity-90 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <FiEdit2 className="w-3 h-3" /> Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-[#5C6468] dark:text-[#E6E2D3]/60 font-medium">
                                        No users matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-[#EEEEEE]">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-base font-serif font-bold text-[#1E2224] dark:text-[#FFFFFF]">Edit User Details</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><FiX /></button>
                        </div>
                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="block font-medium text-[#5C6468] dark:text-[#E6E2D3]/70 mb-1">User</label>
                                <p className="font-semibold text-sm text-[#1E2224] dark:text-[#FFFFFF]">{selectedUser.name} ({selectedUser.email})</p>
                            </div>
                            <div>
                                <label className="block font-medium text-[#5C6468] dark:text-[#E6E2D3]/70 mb-1">Assign Role</label>
                                <select 
                                    value={editRole} 
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] font-medium"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-[#5C6468] dark:text-[#E6E2D3]/70 mb-1">Total Credits</label>
                                <input 
                                    type="number" 
                                    value={editCredits} 
                                    onChange={(e) => setEditCredits(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] font-medium"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-[#5C6468] dark:text-[#E6E2D3]/70 mb-1">Account Status</label>
                                <select 
                                    value={editStatus} 
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] font-medium"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Disabled">Disabled</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-full border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium cursor-pointer">Cancel</button>
                            <button onClick={handleSaveUser} disabled={loading} className="px-5 py-2 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] text-xs font-semibold cursor-pointer">{loading ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Credit Modal */}
            {showAddCreditModal && selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#333333] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1E2224] dark:text-[#EEEEEE]">
                        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                            <h3 className="text-base font-serif font-bold text-[#1E2224] dark:text-[#FFFFFF]">Grant Credits to {selectedUser.name}</h3>
                            <button onClick={() => setShowAddCreditModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><FiX /></button>
                        </div>
                        <div className="space-y-4 text-xs">
                            <p className="text-[#5C6468] dark:text-[#E6E2D3]/70">Current Balance: <strong className="text-[#1E2224] dark:text-[#FFFFFF]">{selectedUser.credits ?? 50} Credits</strong></p>
                            <div>
                                <label className="block font-medium text-[#5C6468] dark:text-[#E6E2D3]/70 mb-1">Credits to Add</label>
                                <input 
                                    type="number" 
                                    value={creditsToAdd} 
                                    onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] font-medium text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button onClick={() => setShowAddCreditModal(false)} className="px-4 py-2 rounded-full border border-[#E8DFD5] dark:border-[#333333] text-xs font-medium cursor-pointer">Cancel</button>
                            <button onClick={handleAddCreditsSubmit} disabled={loading} className="px-5 py-2 rounded-full bg-[#1E2224] dark:bg-[#FFFFFF] text-white dark:text-[#000000] text-xs font-semibold cursor-pointer">{loading ? 'Adding...' : 'Confirm Grant'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersTab;
