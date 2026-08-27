import React from 'react';
import { FiUsers, FiUserCheck, FiFileText, FiZap, FiDollarSign } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function OverviewTab({ data }) {
    const isDark = document.documentElement.classList.contains('dark');

    const stats = [
        { title: 'Total Users', value: (data?.totalUsers ?? 0).toLocaleString(), icon: FiUsers, iconColor: 'text-[#2B5866] dark:text-[#E6E2D3]', iconBg: 'bg-[#E4ECEF] dark:bg-[#222222]' },
        { title: 'Active Users', value: (data?.activeUsers ?? 0).toLocaleString(), icon: FiUserCheck, iconColor: 'text-[#5C6468] dark:text-[#EEEEEE]', iconBg: 'bg-[#EDF2E8] dark:bg-[#222222]' },
        { title: 'Notes Generated', value: (data?.notesGenerated ?? 0).toLocaleString(), icon: FiFileText, iconColor: 'text-[#C85A32] dark:text-[#E6E2D3]', iconBg: 'bg-[#F5EBE1] dark:bg-[#222222]' },
        { title: 'Credits Used', value: (data?.creditsUsed ?? 0).toLocaleString(), icon: FiZap, iconColor: 'text-[#DA9B42] dark:text-[#E6E2D3]', iconBg: 'bg-[#FAF0DC] dark:bg-[#222222]' },
        { title: 'Revenue', value: `₹${(data?.revenue ?? 0).toLocaleString()}`, icon: FiDollarSign, iconColor: 'text-[#B86337] dark:text-[#EEEEEE]', iconBg: 'bg-[#F6ECE4] dark:bg-[#222222]' }
    ];

    const userGrowthData = data?.userGrowth && data.userGrowth.length > 0 ? data.userGrowth : [
        { month: 'Jan', users: data?.totalUsers || 0 },
        { month: 'Feb', users: data?.totalUsers || 0 },
        { month: 'Mar', users: data?.totalUsers || 0 },
        { month: 'Apr', users: data?.totalUsers || 0 },
        { month: 'May', users: data?.totalUsers || 0 },
        { month: 'Jun', users: data?.totalUsers || 0 }
    ];

    const notesActivityData = data?.notesActivity && data.notesActivity.length > 0 ? data.notesActivity : [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 }
    ];

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
                            <AreaChart data={userGrowthData}>
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
                            <BarChart data={notesActivityData}>
                                <defs>
                                    <linearGradient id="notesBarGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C85A32" />
                                        <stop offset="100%" stopColor="#B24B27" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
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
                                <Bar dataKey="count" fill="url(#notesBarGlow)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
