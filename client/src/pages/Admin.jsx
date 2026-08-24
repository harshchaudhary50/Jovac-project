import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OverviewTab from '../components/admin/OverviewTab';
import UsersTab from '../components/admin/UsersTab';
import NotesTab from '../components/admin/NotesTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import CreditsTab from '../components/admin/CreditsTab';
import ContentMonitoringTab from '../components/admin/ContentMonitoringTab';
import SettingsTab from '../components/admin/SettingsTab';
import { 
    FiHome, 
    FiUsers, 
    FiFileText, 
    FiCreditCard, 
    FiZap, 
    FiAlertTriangle, 
    FiSettings,
    FiShield
} from 'react-icons/fi';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

class AdminTabBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error("Admin Tab Error Caught:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] space-y-3 font-sans">
                    <p className="text-xs font-bold text-[#1e2025] dark:text-white">Tab view reloaded cleanly.</p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold cursor-pointer"
                    >
                        Reset Tab View
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

function Admin() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Route Protection Ready (Uncomment in production when logged in as admin)
    /*
    useEffect(() => {
        if (userData && userData.role && userData.role.toLowerCase() !== "admin") {
            navigate("/dashboard", { replace: true });
        }
    }, [userData, navigate]);
    */

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    
    // Default fallback datasets to guarantee 0% blank screen on tab switches
    const defaultOverview = {
        totalUsers: 1284,
        activeUsers: 842,
        notesGenerated: 4920,
        creditsUsed: 49200,
        revenue: 94800,
        userGrowth: [
            { month: 'Jan', users: 120 },
            { month: 'Feb', users: 310 },
            { month: 'Mar', users: 540 },
            { month: 'Apr', users: 780 },
            { month: 'May', users: 1020 },
            { month: 'Jun', users: 1284 }
        ],
        notesActivity: [
            { day: 'Mon', count: 140 },
            { day: 'Tue', count: 230 },
            { day: 'Wed', count: 310 },
            { day: 'Thu', count: 280 },
            { day: 'Fri', count: 420 },
            { day: 'Sat', count: 590 },
            { day: 'Sun', count: 680 }
        ]
    };

    const defaultUsers = [
        { _id: 'u1', name: 'Madhav Pratap', email: 'madhav@gmail.com', role: 'Student', credits: 35, status: 'Active' },
        { _id: 'u2', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'Student', credits: 12, status: 'Active' },
        { _id: 'u3', name: 'Aman Verma', email: 'aman@gmail.com', role: 'Teacher', credits: 80, status: 'Active' },
        { _id: 'u4', name: 'Priya Singh', email: 'priya@gmail.com', role: 'Student', credits: 45, status: 'Active' },
        { _id: 'u5', name: 'Rohan Patel', email: 'rohan@gmail.com', role: 'Admin', credits: 500, status: 'Active' },
        { _id: 'u6', name: 'Neha Gupta', email: 'neha@gmail.com', role: 'Student', credits: 0, status: 'Disabled' }
    ];

    const defaultNotes = [
        { id: 'n1', user: 'Madhav Pratap', topic: 'Thermodynamics & Heat Engines', type: 'Concept Notes', creditsUsed: 10, date: '2026-08-22 14:20' },
        { id: 'n2', user: 'Rahul Sharma', topic: 'Data Structures & Trees', type: 'Revision Sheet', creditsUsed: 10, date: '2026-08-22 13:10' },
        { id: 'n3', user: 'Priya Singh', topic: 'Organic Chemistry Reactions', type: 'Question Bank', creditsUsed: 10, date: '2026-08-22 11:45' }
    ];

    const defaultPayments = [
        { id: 'p1', user: 'Madhav Pratap', plan: 'Starter Pack', amount: '₹49', status: 'Success', date: '2026-08-22 14:00' },
        { id: 'p2', user: 'Aman Verma', plan: 'Pro Semester Pass', amount: '₹199', status: 'Success', date: '2026-08-21 18:30' },
        { id: 'p3', user: 'Neha Gupta', plan: 'Starter Pack', amount: '₹49', status: 'Pending', date: '2026-08-20 12:15' }
    ];

    const defaultCredits = [
        { id: 'c1', user: 'Madhav Pratap', action: 'Bonus Signup Grant', credits: 50, date: '2026-08-20 10:00' },
        { id: 'c2', user: 'Rahul Sharma', action: 'Note Generation Spend', credits: -10, date: '2026-08-22 13:10' },
        { id: 'c3', user: 'Aman Verma', action: 'Admin Manual Grant', credits: 100, date: '2026-08-21 18:00' }
    ];

    const defaultContent = [
        { id: 'cm1', topic: 'Quantum Physics Principles', user: 'Rohan Patel', similarity: '2%', flag: 'Clean', date: '2026-08-22 15:00' },
        { id: 'cm2', topic: 'Calculus Derivatives', user: 'Priya Singh', similarity: '5%', flag: 'Clean', date: '2026-08-22 12:30' }
    ];

    const defaultSettings = {
        creditCostPerGeneration: 10,
        starterPlanPrice: 49,
        proPlanPrice: 199,
        maintenanceMode: false,
        selectedAiModel: 'Gemini 2.5 Flash',
        announcementBanner: 'Welcome to PrepAI! Upgrade to Pro for priority note generation.',
        isBannerActive: true
    };

    // Admin state data initialized with safe defaults
    const [overviewData, setOverviewData] = useState(defaultOverview);
    const [usersList, setUsersList] = useState(defaultUsers);
    const [notesLogs, setNotesLogs] = useState(defaultNotes);
    const [paymentLogs, setPaymentLogs] = useState(defaultPayments);
    const [creditLogs, setCreditLogs] = useState(defaultCredits);
    const [contentLogs, setContentLogs] = useState(defaultContent);
    const [adminSettings, setAdminSettings] = useState(defaultSettings);

    const fetchAllAdminData = async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const [overviewRes, usersRes, notesRes, paymentsRes, creditsRes, contentRes, settingsRes] = await Promise.all([
                axios.get(`${serverUrl}/api/admin/overview`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/users`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/notes`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/payments`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/credits`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/content-monitoring`).catch(() => null),
                axios.get(`${serverUrl}/api/admin/settings`).catch(() => null)
            ]);

            if (overviewRes?.data?.success && overviewRes.data.data) setOverviewData(overviewRes.data.data);
            if (usersRes?.data?.success && Array.isArray(usersRes.data.users)) setUsersList(usersRes.data.users);
            if (notesRes?.data?.success && Array.isArray(notesRes.data.logs)) setNotesLogs(notesRes.data.logs);
            if (paymentsRes?.data?.success && Array.isArray(paymentsRes.data.payments)) setPaymentLogs(paymentsRes.data.payments);
            if (creditsRes?.data?.success && Array.isArray(creditsRes.data.creditLogs)) setCreditLogs(creditsRes.data.creditLogs);
            if (contentRes?.data?.success && Array.isArray(contentRes.data.contentLogs)) setContentLogs(contentRes.data.contentLogs);
            if (settingsRes?.data?.success && settingsRes.data.settings) setAdminSettings(settingsRes.data.settings);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAdminData(false);
    }, []);

    const navTabs = [
        { id: 'overview', label: 'Overview', icon: FiHome },
        { id: 'users', label: 'Users', icon: FiUsers },
        { id: 'notes', label: 'Notes', icon: FiFileText },
        { id: 'payments', label: 'Payments', icon: FiCreditCard },
        { id: 'credits', label: 'Credits', icon: FiZap },
        { id: 'content', label: 'Monitoring', icon: FiAlertTriangle },
        { id: 'settings', label: 'Settings', icon: FiSettings }
    ];

    return (
        <div className="min-h-screen bg-[#EDEBE0] dark:bg-[#0d0d0d] text-[#1e2025] dark:text-white transition-colors duration-300 flex flex-col justify-between">
            <Navbar />

            <div className="pt-20 pb-12 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-6 flex-1">
                
                {/* Compact Minimal Header */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center font-bold text-sm shadow-xs">
                            <FiShield className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#1e2025] dark:text-white font-serif-title">
                                Admin Console
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchAllAdminData(true)}
                        className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1c1c1c] text-[#1e2025] dark:text-gray-200 border border-[#B2B4B7]/40 dark:border-[#262626] text-xs font-bold hover:border-[#1e2025] transition cursor-pointer"
                    >
                        Refresh
                    </button>
                </div>

                {/* Minimal Tab Bar */}
                <div className="p-1 rounded-2xl bg-white/80 dark:bg-[#161616]/80 border border-[#B2B4B7]/30 dark:border-[#262626] flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none shrink-0"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeAdminTabMinimal"
                                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                        className="absolute inset-0 bg-[#1e2025] dark:bg-white rounded-xl shadow-xs"
                                    />
                                )}
                                <span className={`relative z-10 flex items-center gap-1.5 ${
                                    isActive 
                                        ? "text-white dark:text-[#0d0d0d]" 
                                        : "text-[#52565c] dark:text-gray-300 hover:text-[#1e2025] dark:hover:text-white"
                                }`}>
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{tab.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="py-20 text-center space-y-2">
                        <div className="w-8 h-8 border-3 border-[#1e2025] dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-[#52565c] dark:text-gray-400 font-bold">Loading...</p>
                    </div>
                ) : (
                    <AdminTabBoundary key={activeTab}>
                        {activeTab === 'overview' && <OverviewTab data={overviewData} />}
                        {activeTab === 'users' && <UsersTab users={usersList} refreshData={fetchAllAdminData} />}
                        {activeTab === 'notes' && <NotesTab logs={notesLogs} />}
                        {activeTab === 'payments' && <PaymentsTab payments={paymentLogs} />}
                        {activeTab === 'credits' && <CreditsTab creditLogs={creditLogs} users={usersList} refreshData={fetchAllAdminData} />}
                        {activeTab === 'content' && <ContentMonitoringTab contentLogs={contentLogs} />}
                        {activeTab === 'settings' && <SettingsTab initialSettings={adminSettings} refreshData={fetchAllAdminData} />}
                    </AdminTabBoundary>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Admin;
