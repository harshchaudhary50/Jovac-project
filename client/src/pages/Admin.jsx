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
                <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] space-y-3 font-sans trekt-card-shadow">
                    <p className="text-xs font-bold text-[#1E2224] dark:text-white">Tab view reloaded cleanly.</p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold cursor-pointer"
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

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    const defaultSettings = {
        creditCostPerGeneration: 10,
        starterPlanPrice: 49,
        proPlanPrice: 199,
        maintenanceMode: false,
        selectedAiModel: 'Gemini 2.5 Flash',
        announcementBanner: 'Welcome to PrepAI! Select any note format below to start studying.',
        isBannerActive: true
    };

    const [overviewData, setOverviewData] = useState({
        totalUsers: 0,
        activeUsers: 0,
        notesGenerated: 0,
        creditsUsed: 0,
        totalRemainingCredits: 0,
        revenue: 0,
        userGrowth: [],
        notesActivity: []
    });
    const [usersList, setUsersList] = useState([]);
    const [notesLogs, setNotesLogs] = useState([]);
    const [paymentLogs, setPaymentLogs] = useState([]);
    const [creditLogs, setCreditLogs] = useState([]);
    const [contentLogs, setContentLogs] = useState([]);
    const [adminSettings, setAdminSettings] = useState(defaultSettings);

    const fetchAllAdminData = async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const [overviewRes, usersRes, notesRes, paymentsRes, creditsRes, contentRes, settingsRes] = await Promise.all([
                axios.get(`${serverUrl}/api/admin/overview`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/notes`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/payments`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/credits`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/content-monitoring`, { withCredentials: true }).catch(() => null),
                axios.get(`${serverUrl}/api/admin/settings`, { withCredentials: true }).catch(() => null)
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
        { id: 'overview', label: 'Overview', icon: <FiHome className="w-4 h-4" /> },
        { id: 'users', label: 'Users', icon: <FiUsers className="w-4 h-4" /> },
        { id: 'notes', label: 'Notes', icon: <FiFileText className="w-4 h-4" /> },
        { id: 'payments', label: 'Payments', icon: <FiCreditCard className="w-4 h-4" /> },
        { id: 'credits', label: 'Credits', icon: <FiZap className="w-4 h-4" /> },
        { id: 'monitoring', label: 'Monitoring', icon: <FiAlertTriangle className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings className="w-4 h-4" /> }
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
            
            {/* Background Soft Organic Washes */}
            <div className="trekt-bg-blob-top" />
            <div className="trekt-bg-blob-bottom" />

            {/* Global Navbar */}
            <Navbar />

            {/* Main Admin Console Container */}
            <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-32 pb-16 relative z-10 space-y-8 font-sans">
                
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#2B5866] text-white flex items-center justify-center shadow-xs">
                            <FiShield className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-[#1E2224] dark:text-white tracking-tight">
                                Admin Console
                            </h1>
                            <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium">
                                Real-time system analytics, user management, and AI credit balances.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchAllAdminData(true)}
                        disabled={loading}
                        className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] hover:bg-[#FAF7F2] dark:hover:bg-[#282828] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold text-[#1E2224] dark:text-white transition shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <span>{loading ? 'Refreshing...' : 'Refresh Live Data'}</span>
                    </button>
                </div>

                {/* Tab Navigation Pill Bar */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-[#E8DFD5] dark:border-[#262626] no-scrollbar">
                    {navTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] shadow-sm shadow-[#C85A32]/20 dark:shadow-none'
                                        : 'bg-white dark:bg-[#161616] text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] dark:hover:text-white border border-[#E8DFD5] dark:border-[#262626]'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Display with Clean Error Boundary */}
                <AdminTabBoundary key={activeTab}>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {activeTab === 'overview' && (
                            <OverviewTab data={overviewData} onTabChange={setActiveTab} />
                        )}

                        {activeTab === 'users' && (
                            <UsersTab users={usersList} refreshData={() => fetchAllAdminData(false)} />
                        )}

                        {activeTab === 'notes' && (
                            <NotesTab notes={notesLogs} />
                        )}

                        {activeTab === 'payments' && (
                            <PaymentsTab payments={paymentLogs} />
                        )}

                        {activeTab === 'credits' && (
                            <CreditsTab 
                                creditLogs={creditLogs} 
                                users={usersList} 
                                refreshData={() => fetchAllAdminData(false)} 
                            />
                        )}

                        {activeTab === 'monitoring' && (
                            <ContentMonitoringTab contentLogs={contentLogs} />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab 
                                settings={adminSettings} 
                                refreshData={() => fetchAllAdminData(false)} 
                            />
                        )}
                    </motion.div>
                </AdminTabBoundary>

            </main>

            {/* Footer */}
            <Footer />

        </div>
    );
}

export default Admin;
