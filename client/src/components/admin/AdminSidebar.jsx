import React from 'react';
import { 
    FiHome, 
    FiUsers, 
    FiFileText, 
    FiCreditCard, 
    FiZap, 
    FiAlertTriangle, 
    FiSettings, 
    FiArrowLeft,
    FiShield
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function AdminSidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const navItems = [
        { id: 'overview', label: 'Overview', icon: FiHome, badge: null },
        { id: 'users', label: 'Users', icon: FiUsers, badge: '245' },
        { id: 'notes', label: 'Notes / Generations', icon: FiFileText, badge: '1.2k' },
        { id: 'payments', label: 'Payments', icon: FiCreditCard, badge: '₹12.5k' },
        { id: 'credits', label: 'Credits Audit', icon: FiZap, badge: null },
        { id: 'content', label: 'Content Monitoring', icon: FiAlertTriangle, badge: '2 Needs Review', alert: true },
        { id: 'settings', label: 'System Settings', icon: FiSettings, badge: null }
    ];

    return (
        <aside className="w-64 bg-[#16171a] border-r border-[#2d3038] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
            {/* Top Brand Header */}
            <div>
                <div className="p-5 border-b border-[#2d3038] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                            <FiShield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-extrabold tracking-wide text-white flex items-center gap-1.5">
                                PrepAI <span className="text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">ADMIN</span>
                            </h2>
                            <p className="text-[11px] text-gray-400">Control & Monitoring</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1 mt-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-amber-400 text-[#0d0d0d] font-bold shadow-md shadow-amber-400/10'
                                        : 'text-gray-300 hover:bg-[#22252c] hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0d0d0d]' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        isActive 
                                            ? 'bg-black/20 text-[#0d0d0d]' 
                                            : item.alert 
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                                : 'bg-[#2a2d36] text-gray-300'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom App Exit Link */}
            <div className="p-4 border-t border-[#2d3038] bg-[#121316]">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#22252c] hover:bg-[#2d303b] text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-[#2d3038]"
                >
                    <FiArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Back to Student App</span>
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;
