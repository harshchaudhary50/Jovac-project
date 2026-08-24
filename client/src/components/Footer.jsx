import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiGithub, FiTwitter, FiMail, FiCheckCircle, FiX, FiInfo, FiZap, FiBookOpen, FiShield, FiFileText } from 'react-icons/fi';

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [modalContent, setModalContent] = useState(null); // 'howItWorks', 'features', 'privacy', 'terms', 'support'

    const handleNavClick = (targetHash) => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const el = document.querySelector(targetHash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else {
            const el = document.querySelector(targetHash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="w-full bg-[#EDEBE0] dark:bg-[#0d0d0d] border-t border-[#B2B4B7]/40 dark:border-[#222222] pt-14 pb-10 px-6 sm:px-12 text-[#52565c] dark:text-gray-400 relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Main Footer Content Container */}
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-[#B2B4B7]/30 dark:border-[#262626]">
                    
                    {/* Brand & Overview Column */}
                    <div className="md:col-span-2 space-y-4">
                        <div 
                            onClick={() => navigate("/")} 
                            className="flex items-center gap-2.5 cursor-pointer select-none group"
                        >
                            <img 
                                src="/favicon.jpg" 
                                alt="PrepPulse AI Logo" 
                                className="w-8 h-8 rounded-xl object-cover shadow-xs border border-[#B2B4B7]/30 dark:border-[#303030] group-hover:scale-105 transition-transform" 
                            />
                            <span className="text-xl font-bold tracking-tight text-[#1e2025] dark:text-white">
                                Prep<span className="text-[#52565c] dark:text-gray-400 font-semibold">AI</span>
                            </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#52565c] dark:text-gray-400 leading-relaxed max-w-sm font-medium">
                            PrepAI untangles complex syllabi into clear, high-yield exam notes, 5-minute revision sheets, and visual flowcharts in seconds.
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#EDEBE0] dark:hover:bg-[#222222] text-[#1e2025] dark:text-white border border-[#B2B4B7]/40 dark:border-[#262626] transition shadow-xs">
                                <FiGithub className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#EDEBE0] dark:hover:bg-[#222222] text-[#1e2025] dark:text-white border border-[#B2B4B7]/40 dark:border-[#262626] transition shadow-xs">
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a href="mailto:support@preppulse.ai" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#EDEBE0] dark:hover:bg-[#222222] text-[#1e2025] dark:text-white border border-[#B2B4B7]/40 dark:border-[#262626] transition shadow-xs">
                                <FiMail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e2025] dark:text-white">Product</h4>
                        <ul className="space-y-2 text-xs font-semibold text-[#52565c] dark:text-gray-400">
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    AI Note Generator
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    5-Min Revision Mode
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    Mermaid Diagrams
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    PDF Export
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Resources & Pricing */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e2025] dark:text-white">Resources</h4>
                        <ul className="space-y-2 text-xs font-semibold text-[#52565c] dark:text-gray-400">
                            <li>
                                <button onClick={() => navigate("/pricing")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    Credit Plans & Pricing
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/history")} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer">
                                    Saved Notes Library
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setModalContent('howItWorks')} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer text-left">
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setModalContent('features')} className="hover:text-[#1e2025] dark:hover:text-white transition cursor-pointer text-left">
                                    Features Overview
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Quality Assurance Badge Column */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e2025] dark:text-white">Platform Promise</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-extrabold text-[#1e2025] dark:text-white">
                                <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Curated Exam Quality</span>
                            </div>
                            <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
                                Formatted specifically for university and semester exam marking schemes.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright & Rights Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#52565c] dark:text-gray-400">
                    <p>© {new Date().getFullYear()} PrepAI — All Rights Reserved.</p>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setModalContent('privacy')} className="hover:text-[#1e2025] dark:hover:text-white cursor-pointer transition">Privacy Policy</button>
                        <button onClick={() => setModalContent('terms')} className="hover:text-[#1e2025] dark:hover:text-white cursor-pointer transition">Terms of Service</button>
                        <button onClick={() => setModalContent('support')} className="hover:text-[#1e2025] dark:hover:text-white cursor-pointer transition">Support</button>
                    </div>
                </div>

            </div>

            {/* Interactive Information Dialog Modal */}
            <AnimatePresence>
                {modalContent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 text-left text-[#1e2025] dark:text-white"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setModalContent(null)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030] text-[#1e2025] dark:text-white hover:bg-[#1e2025] hover:text-white dark:hover:bg-white dark:hover:text-[#0d0d0d] transition-all cursor-pointer"
                            >
                                <FiX className="w-4 h-4" />
                            </button>

                            {/* Dynamic Content Rendering */}
                            {modalContent === 'howItWorks' && (
                                <div className="space-y-4">
                                    <FiZap className="w-8 h-8 text-amber-500" />
                                    <h3 className="text-xl font-extrabold font-serif">How PrepAI Works</h3>
                                    <div className="space-y-3 text-xs font-medium text-[#52565c] dark:text-gray-300 leading-relaxed">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030]">
                                            <strong className="block text-[#1e2025] dark:text-white mb-0.5">1. Enter Syllabus Topic</strong>
                                            Input any chapter topic, course code, or syllabus section into the generator.
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030]">
                                            <strong className="block text-[#1e2025] dark:text-white mb-0.5">2. AI Synthesis</strong>
                                            Our model synthesizes high-yield explanations, key formulas, priority exam tags, and visual flowcharts.
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-[#222222] border border-[#B2B4B7]/30 dark:border-[#303030]">
                                            <strong className="block text-[#1e2025] dark:text-white mb-0.5">3. Study & Export PDF</strong>
                                            Read your notes online or export clean, printable PDF revision sheets in 1-click.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalContent === 'features' && (
                                <div className="space-y-4">
                                    <FiBookOpen className="w-8 h-8 text-[#1e2025] dark:text-white" />
                                    <h3 className="text-xl font-extrabold font-serif">Features Overview</h3>
                                    <ul className="space-y-2.5 text-xs font-semibold text-[#52565c] dark:text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Deep Concept Notes with Exam Takeaway Boxes</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>5-Min Rapid Revision Bullet Sheets</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Predicted Semester Exam Question Banks</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>Mermaid Architecture & Process Flowcharts</span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {modalContent === 'privacy' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif">Privacy Policy</h3>
                                    <p className="text-xs text-[#52565c] dark:text-gray-300 leading-relaxed">
                                        Your privacy is our priority. We store user data securely and never sell your personal information. All generated notes are saved safely under your account library.
                                    </p>
                                </div>
                            )}

                            {modalContent === 'terms' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif">Terms of Service</h3>
                                    <p className="text-xs text-[#52565c] dark:text-gray-300 leading-relaxed">
                                        PrepPulse AI is designed to assist students with high-yield exam preparation. Users retain full rights to export and study their generated notes.
                                    </p>
                                </div>
                            )}

                            {modalContent === 'support' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif">Contact Support</h3>
                                    <p className="text-xs text-[#52565c] dark:text-gray-300 leading-relaxed">
                                        Have questions or need assistance with your AI credits? Email our support team anytime at <a href="mailto:support@preppulse.ai" className="font-bold text-[#1e2025] dark:text-white underline">support@preppulse.ai</a>.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setModalContent(null)}
                                className="w-full py-3 rounded-2xl bg-[#1e2025] dark:bg-[#ffffff] text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xs cursor-pointer mt-4"
                            >
                                Close Window
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </footer>
    );
}

export default Footer;
