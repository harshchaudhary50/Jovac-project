import React from 'react';
import { FiUsers, FiUserCheck, FiFileText, FiZap, FiDollarSign } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function OverviewTab({ data }) {
    const stats = [
        { title: 'Total Users', value: data?.totalUsers ? data.totalUsers.toLocaleString() : '245', icon: FiUsers },
        { title: 'Active Users', value: data?.activeUsers ? data.activeUsers.toLocaleString() : '82', icon: FiUserCheck },
        { title: 'Notes Generated', value: data?.notesGenerated ? data.notesGenerated.toLocaleString() : '1,240', icon: FiFileText },
        { title: 'Credits Used', value: data?.creditsUsed ? data.creditsUsed.toLocaleString() : '8,450', icon: FiZap },
        { title: 'Revenue', value: data?.revenue ? `₹${data.revenue.toLocaleString()}` : '₹12,500', icon: FiDollarSign }
    ];

    const charts = data?.charts || {
        userGrowth: [
            { month: 'Jan', users: 45 },
            { month: 'Feb', users: 80 },
            { month: 'Mar', users: 130 },
            { month: 'Apr', users: 175 },
            { month: 'May', users: 210 },
            { month: 'Jun', users: 245 }
        ],
        notesGenerated: [
            { month: 'Jan', notes: 150 },
            { month: 'Feb', notes: 320 },
            { month: 'Mar', notes: 610 },
            { month: 'Apr', notes: 890 },
            { month: 'May', notes: 1050 },
            { month: 'Jun', notes: 1240 }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Minimal Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {stats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs space-y-1">
                            <div className="flex items-center justify-between text-[#52565c] dark:text-gray-400">
                                <span className="text-[11px] font-bold uppercase tracking-wider">{item.title}</span>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-xl font-extrabold text-[#1e2025] dark:text-white">{item.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Vibrant High-Contrast Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#1e2025] dark:text-white uppercase tracking-wider">User Growth</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.userGrowth}>
                                <defs>
                                    <linearGradient id="userGrowthGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                                <YAxis stroke="#9ca3af" fontSize={11} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e2025', borderColor: '#3b82f6', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fill="url(#userGrowthGlow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#1e2025] dark:text-white uppercase tracking-wider">Notes Activity</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.notesGenerated}>
                                <defs>
                                    <linearGradient id="notesBarGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                                <YAxis stroke="#9ca3af" fontSize={11} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e2025', borderColor: '#f59e0b', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
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
