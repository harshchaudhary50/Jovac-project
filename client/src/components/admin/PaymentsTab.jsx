import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiDollarSign, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';
import { serverUrl } from '../../App';

function PaymentsTab({ payments: initialPayments = [] }) {
    const [payments, setPayments] = useState(initialPayments);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(false);

    const fetchLivePayments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/payments`, { withCredentials: true });
            if (res.data?.success && Array.isArray(res.data.payments)) {
                setPayments(res.data.payments);
            }
        } catch (err) {
            console.error('Error fetching live payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(initialPayments) && initialPayments.length > 0) {
            setPayments(initialPayments);
        } else {
            fetchLivePayments();
        }
    }, [initialPayments]);

    const safePayments = Array.isArray(payments) ? payments : [];

    // Normalize payments array so it works with MongoDB records seamlessly
    const normalizedPayments = safePayments.map((p, idx) => {
        const userName = p?.user?.name || p?.customerName || (typeof p?.user === 'string' ? p.user : 'User');
        const userEmail = p?.user?.email || p?.customerEmail || p?.email || '-';
        const numAmount = typeof p?.amount === 'number' ? p.amount : (parseInt(String(p?.amount || '0').replace(/[^0-9]/g, ''), 10) || 0);
        const planName = p?.plan || (p?.creditsAdded ? `${p.creditsAdded} Credits Pack` : (numAmount ? `₹${numAmount} Pack` : 'Credit Pack'));
        const rawStatus = (p?.status || 'success').toLowerCase();
        const status = rawStatus === 'success' ? 'Success' : (rawStatus === 'pending' ? 'Pending' : 'Failed');
        const dateStr = p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : (p?.date || '-');

        return {
            id: p?._id || p?.orderId || p?.id || idx,
            user: userName,
            email: userEmail,
            amount: numAmount,
            amountFormatted: `₹${numAmount}`,
            plan: planName,
            status,
            date: dateStr,
            createdAt: p?.createdAt ? new Date(p.createdAt) : new Date()
        };
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonthIndex - i + 12) % 12;
        last6Months.push(months[mIdx]);
    }

    const revenueChartData = last6Months.map(m => {
        const monthPayments = normalizedPayments.filter(p => {
            const pMonth = months[p.createdAt.getMonth()];
            return pMonth === m && p.status === 'Success';
        });
        const rev = monthPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
            month: m,
            revenue: rev
        };
    });

    const filteredPayments = normalizedPayments.filter(p => {
        const userStr = (p.user || '').toLowerCase();
        const emailStr = (p.email || '').toLowerCase();
        const planStr = (p.plan || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchLower || userStr.includes(searchLower) || emailStr.includes(searchLower) || planStr.includes(searchLower);
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalSuccessRevenue = normalizedPayments
        .filter(p => p.status === 'Success')
        .reduce((sum, p) => sum + p.amount, 0);

    const successCount = normalizedPayments.filter(p => p.status === 'Success').length;
    const pendingCount = normalizedPayments.filter(p => p.status !== 'Success').length;

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-bold uppercase tracking-wider">Total Revenue</p>
                        <p className="text-xl font-extrabold text-[#1E2224] dark:text-white">₹{totalSuccessRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-amber-400 flex items-center justify-center font-bold">
                        <FiDollarSign className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-bold uppercase tracking-wider">Successful Payments</p>
                        <p className="text-xl font-extrabold text-[#1E2224] dark:text-white">
                            {successCount} / {normalizedPayments.length}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-amber-400 flex items-center justify-center font-bold">
                        <FiCheckCircle className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-bold uppercase tracking-wider">Pending Transactions</p>
                        <p className="text-xl font-extrabold text-[#DA9B42] dark:text-amber-400">
                            {pendingCount}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] dark:bg-[#222222] text-[#DA9B42] dark:text-amber-400 flex items-center justify-center font-bold">
                        <FiClock className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Payment Revenue Chart */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#1E2224] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <FiTrendingUp className="text-[#DA9B42]" /> Revenue Collection Trend (₹)
                    </h3>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchLivePayments}
                            disabled={loading}
                            className="text-[11px] font-bold text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
                        >
                            <FiRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            <span>{loading ? 'Syncing...' : 'Sync Payments'}</span>
                        </button>
                        <span className="text-[11px] font-bold text-[#5C6468] dark:text-gray-400">Monthly Earnings</span>
                    </div>
                </div>
                <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData}>
                            <defs>
                                <linearGradient id="paymentRevenueColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C85A32" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#C85A32" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" opacity={0.15} />
                            <XAxis dataKey="month" stroke="#877F76" fontSize={11} />
                            <YAxis stroke="#877F76" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e2025', borderColor: '#DA9B42', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#C85A32" strokeWidth={3} fill="url(#paymentRevenueColor)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6468] dark:text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search user, email or plan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-medium text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-hidden focus:border-[#C85A32] dark:focus:border-white"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-[#5C6468] dark:text-gray-400 font-bold uppercase tracking-wider">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold text-[#1E2224] dark:text-white focus:outline-hidden cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
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
                                <th className="p-3.5">Plan Package</th>
                                <th className="p-3.5">Amount</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DFD5] dark:divide-[#262626]">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((p) => (
                                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1e1e1e] transition-colors">
                                        <td className="p-3.5">
                                            <p className="font-bold text-[#1E2224] dark:text-white">{p.user}</p>
                                            <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-medium">{p.email}</p>
                                        </td>
                                        <td className="p-3.5 font-extrabold text-[#1E2224] dark:text-white">{p.plan}</td>
                                        <td className="p-3.5 font-extrabold text-[#C85A32] dark:text-amber-400">{p.amountFormatted}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit border ${
                                                p.status === 'Success'
                                                    ? 'bg-[#FAF0DC] dark:bg-[#222222] text-[#B86337] dark:text-amber-400 border-[#DA9B42]/30 dark:border-[#333333]'
                                                    : p.status === 'Pending'
                                                        ? 'bg-[#FAF0DC] dark:bg-amber-950/40 text-[#DA9B42] dark:text-amber-400 border-[#DA9B42]/30 dark:border-amber-800/60'
                                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                                            }`}>
                                                {p.status === 'Success' && <FiCheckCircle className="w-3 h-3" />}
                                                {p.status === 'Pending' && <FiClock className="w-3 h-3" />}
                                                {p.status === 'Failed' && <FiXCircle className="w-3 h-3" />}
                                                <span>{p.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right text-[#5C6468] dark:text-gray-400 font-medium">{p.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[#5C6468] dark:text-gray-400 font-medium">
                                        No payments found in transaction history.
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
