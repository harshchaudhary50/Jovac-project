import React from 'react';
import { FiUsers, FiUserCheck, FiFileText, FiZap, FiDollarSign } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function OverviewTab({ data }) {
    const isDark = document.documentElement.classList.contains('dark');

    const stats = [
        { title: 'Total Users', value: data?.totalUsers ? data.totalUsers.toLocaleString() : '1,284', icon: FiUsers, iconColor: 'text-[#2B5866] dark:text-white', iconBg: 'bg-[#E4ECEF] dark:bg-[#222222]' },
        { title: 'Active Users', value: data?.activeUsers ? data.activeUsers.toLocaleString() : '842', icon: FiUserCheck, iconColor: 'text-[#6B7B52] dark:text-emerald-400', iconBg: 'bg-[#EDF2E8] dark:bg-[#222222]' },
        { title: 'Notes Generated', value: data?.notesGenerated ? data.notesGenerated.toLocaleString() : '4,920', icon: FiFileText, iconColor: 'text-[#C85A32] dark:text-amber-400', iconBg: 'bg-[#F5EBE1] dark:bg-[#222222]' },
        { title: 'Credits Used', value: data?.creditsUsed ? data.creditsUsed.toLocaleString() : '49,200', icon: FiZap, iconColor: 'text-[#DA9B42] dark:text-amber-400', iconBg: 'bg-[#FAF0DC] dark:bg-[#222222]' },
        { title: 'Revenue', value: data?.revenue ? `₹${data.revenue.toLocaleString()}` : '₹94,800', icon: FiDollarSign, iconColor: 'text-[#B86337] dark:text-emerald-400', iconBg: 'bg-[#F6ECE4] dark:bg-[#222222]' }
    ];

    const charts = data?.charts || {
        userGrowth: [
            { month: 'Jan', users: 120 },
            { month: 'Feb', users: 310 },
            { month: 'Mar', users: 540 },
            { month: 'Apr', users: 780 },
            { month: 'May', users: 1020 },
            { month: 'Jun', users: 1284 }
        ],
        notesGenerated: [
            { month: 'Jan', notes: 350 },
            { month: 'Feb', notes: 820 },
            { month: 'Mar', notes: 1410 },
            { month: 'Apr', notes: 2190 },
            { month: 'May', notes: 3450 },
            { month: 'Jun', notes: 4920 }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {stats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow space-y-1.5">
                            <div className="flex items-center justify-between text-[#5C6468] dark:text-gray-400">
                                <span className="text-[11px] font-bold uppercase tracking-wider">{item.title}</span>
                                <div className={`w-7 h-7 rounded-lg ${item.iconBg} border dark:border-[#303030] flex items-center justify-center ${item.iconColor}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="text-xl font-extrabold text-[#1E2224] dark:text-white">{item.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#1E2224] dark:text-white uppercase tracking-wider">User Growth</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2B5866] dark:bg-white animate-pulse" />
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.userGrowth}>
                                <defs>
                                    <linearGradient id="userGrowthGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2B5866" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#2B5866" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                                <YAxis stroke="#9ca3af" fontSize={11} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#161616', 
                                        borderColor: '#303030', 
                                        borderRadius: '12px', 
                                        color: '#ffffff', 
                                        fontSize: '12px', 
                                        fontWeight: 'bold' 
                                    }} 
                                    itemStyle={{ color: '#ffffff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#2B5866" strokeWidth={3} fill="url(#userGrowthGlow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#1E2224] dark:text-white uppercase tracking-wider">Notes Activity</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32] dark:bg-amber-400 animate-pulse" />
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.notesGenerated}>
                                <defs>
                                    <linearGradient id="notesBarGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C85A32" />
                                        <stop offset="100%" stopColor="#B24B27" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                                <YAxis stroke="#9ca3af" fontSize={11} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#161616', 
                                        borderColor: '#303030', 
                                        borderRadius: '12px', 
                                        color: '#ffffff', 
                                        fontSize: '12px', 
                                        fontWeight: 'bold' 
                                    }} 
                                    itemStyle={{ color: '#ffffff' }}
                                />
                                <Bar dataKey="notes" fill="url(#notesBarGlow)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
