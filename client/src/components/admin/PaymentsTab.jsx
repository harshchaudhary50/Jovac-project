import React, { useState } from 'react';
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function PaymentsTab({ payments = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const revenueChartData = [
        { month: 'Jan', revenue: 1500, starter: 500, pro: 1000 },
        { month: 'Feb', revenue: 3200, starter: 1200, pro: 2000 },
        { month: 'Mar', revenue: 6400, starter: 2400, pro: 4000 },
        { month: 'Apr', revenue: 8900, starter: 2900, pro: 6000 },
        { month: 'May', revenue: 10800, starter: 3800, pro: 7000 },
        { month: 'Jun', revenue: 12500, starter: 4500, pro: 8000 }
    ];

    const safePayments = Array.isArray(payments) ? payments : [];

    const filteredPayments = safePayments.filter(p => {
        const userStr = (p?.user || '').toLowerCase();
        const emailStr = (p?.email || '').toLowerCase();
        const planStr = (p?.plan || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = userStr.includes(searchLower) || emailStr.includes(searchLower) || planStr.includes(searchLower);
        const matchesStatus = statusFilter === 'All' || p?.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalSuccessRevenue = safePayments
        .filter(p => p?.status === 'Success')
        .reduce((sum, p) => {
            const rawAmt = String(p?.amount || '0').replace(/[^0-9]/g, '');
            return sum + (parseInt(rawAmt, 10) || 0);
        }, 0);

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-bold uppercase tracking-wider">Total Revenue</p>
                        <p className="text-xl font-extrabold text-[#1e2025] dark:text-white">₹{totalSuccessRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#EDEBE0] dark:bg-[#222222] text-[#1e2025] dark:text-white flex items-center justify-center font-bold">
                        <FiDollarSign className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-bold uppercase tracking-wider">Successful Payments</p>
                        <p className="text-xl font-extrabold text-[#1e2025] dark:text-white">
                            {payments.filter(p => p.status === 'Success').length} / {payments.length}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <FiCheckCircle className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-bold uppercase tracking-wider">Pending Transactions</p>
                        <p className="text-xl font-extrabold text-amber-500">
                            {payments.filter(p => p.status !== 'Success').length}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        <FiClock className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Payment Revenue Chart */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#1e2025] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <FiTrendingUp className="text-emerald-500" /> Revenue Collection Trend (₹)
                    </h3>
                    <span className="text-[11px] font-bold text-[#52565c] dark:text-gray-400">Monthly Earnings</span>
                </div>
                <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData}>
                            <defs>
                                <linearGradient id="paymentRevenueColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" opacity={0.2} />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                            <YAxis stroke="#9ca3af" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e2025', borderColor: '#10b981', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#paymentRevenueColor)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52565c] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search user or plan..."
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
                        className="px-3 py-2 rounded-full bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-xs font-bold text-[#1e2025] dark:text-white focus:outline-none cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
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
                                <th className="p-3.5">Plan Package</th>
                                <th className="p-3.5">Amount</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#B2B4B7]/20 dark:divide-[#262626]">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#EDEBE0]/30 dark:hover:bg-[#1e1e1e] transition-colors">
                                        <td className="p-3.5">
                                            <p className="font-bold text-[#1e2025] dark:text-white">{p.user}</p>
                                            <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-medium">{p.email}</p>
                                        </td>
                                        <td className="p-3.5 font-extrabold text-[#1e2025] dark:text-white">{p.plan}</td>
                                        <td className="p-3.5 font-extrabold text-[#1e2025] dark:text-white">{p.amount}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit border ${
                                                p.status === 'Success'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                                    : p.status === 'Pending'
                                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-800/60'
                                            }`}>
                                                {p.status === 'Success' && <FiCheckCircle className="w-3 h-3" />}
                                                {p.status === 'Pending' && <FiClock className="w-3 h-3" />}
                                                {p.status === 'Failed' && <FiXCircle className="w-3 h-3" />}
                                                <span>{p.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right text-[#52565c] dark:text-gray-400 font-medium">{p.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PaymentsTab;
