import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiGithub, FiTwitter, FiMail, FiCheckCircle, FiX, FiInfo, FiZap, FiBookOpen, FiShield, FiFileText } from 'react-icons/fi';

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [modalContent, setModalContent] = useState(null);

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
        <footer className="w-full bg-[#F5EBE1] dark:bg-[#0d0d0d] border-t border-[#E8DFD5] dark:border-[#262626] pt-14 pb-10 px-6 sm:px-12 text-[#5C6468] dark:text-gray-400 relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Main Footer Content Container */}
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-[#E8DFD5] dark:border-[#262626]">
                    
                    {/* Brand & Overview Column */}
                    <div className="md:col-span-2 space-y-4">
                        <div 
                            onClick={() => navigate("/")} 
                            className="flex items-center gap-2.5 cursor-pointer select-none group"
                        >
                            <img 
                                src="/logo.png" 
                                alt="NoteX Logo" 
                                className="w-8 h-8 rounded-xl object-contain shadow-xs border border-[#EBD7BE] dark:border-[#303030] group-hover:scale-105 transition-transform" 
                            />
                            <span className="text-xl font-bold tracking-tight text-[#1E2224] dark:text-white">
                                Note<span className="text-[#C85A32] dark:text-white font-extrabold">X</span>
                            </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400 leading-relaxed max-w-sm font-medium">
                            NoteX untangles complex syllabi into clear, high-yield exam notes, 5-minute revision sheets, and visual flowcharts in seconds.
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#FAF7F2] dark:hover:bg-[#222222] text-[#2B5866] dark:text-white border border-[#E8DFD5] dark:border-[#262626] transition shadow-xs">
                                <FiGithub className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#FAF7F2] dark:hover:bg-[#222222] text-[#2B5866] dark:text-white border border-[#E8DFD5] dark:border-[#262626] transition shadow-xs">
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a href="mailto:support@preppulse.ai" className="p-2.5 rounded-full bg-white dark:bg-[#161616] hover:bg-[#FAF7F2] dark:hover:bg-[#222222] text-[#2B5866] dark:text-white border border-[#E8DFD5] dark:border-[#262626] transition shadow-xs">
                                <FiMail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2224] dark:text-white">Product</h4>
                        <ul className="space-y-2 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    AI Note Generator
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    5-Min Revision Mode
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    Mermaid Diagrams
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/notes")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    PDF Export
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Resources & Pricing */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2224] dark:text-white">Resources</h4>
                        <ul className="space-y-2 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
                            <li>
                                <button onClick={() => navigate("/pricing")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    Credit Plans & Pricing
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/history")} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer">
                                    Saved Notes Library
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setModalContent('howItWorks')} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer text-left">
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setModalContent('features')} className="hover:text-[#C85A32] dark:hover:text-white transition cursor-pointer text-left">
                                    Features Overview
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Quality Assurance Badge Column */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2224] dark:text-white">Platform Promise</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-extrabold text-[#6B7B52] dark:text-emerald-400">
                                <FiCheckCircle className="w-4 h-4 shrink-0" />
                                <span>Curated Exam Quality</span>
                            </div>
                            <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
                                Formatted specifically for university and semester exam marking schemes.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright & Rights Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
                    <p>© {new Date().getFullYear()} NoteX — All Rights Reserved.</p>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setModalContent('privacy')} className="hover:text-[#C85A32] dark:hover:text-white cursor-pointer transition">Privacy Policy</button>
                        <button onClick={() => setModalContent('terms')} className="hover:text-[#C85A32] dark:hover:text-white cursor-pointer transition">Terms of Service</button>
                        <button onClick={() => setModalContent('support')} className="hover:text-[#C85A32] dark:hover:text-white cursor-pointer transition">Support</button>
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
                            className="bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 text-left text-[#1E2224] dark:text-white"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setModalContent(null)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white hover:bg-[#C85A32] dark:hover:bg-white hover:text-white dark:hover:text-[#0d0d0d] transition-all cursor-pointer"
                            >
                                <FiX className="w-4 h-4" />
                            </button>

                            {/* Dynamic Content Rendering */}
                            {modalContent === 'howItWorks' && (
                                <div className="space-y-4">
                                    <FiZap className="w-8 h-8 text-[#DA9B42] dark:text-amber-400" />
                                    <h3 className="text-xl font-extrabold font-serif text-[#1E2224] dark:text-white">How NoteX Works</h3>
                                    <div className="space-y-3 text-xs font-medium text-[#5C6468] dark:text-gray-400 leading-relaxed">
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626]">
                                            <strong className="block text-[#1E2224] dark:text-white mb-0.5">1. Enter Syllabus Topic</strong>
                                            Input any chapter topic, course code, or syllabus section into the generator.
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626]">
                                            <strong className="block text-[#1E2224] dark:text-white mb-0.5">2. AI Synthesis</strong>
                                            Our model synthesizes high-yield explanations, key formulas, priority exam tags, and visual flowcharts.
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1e1e1e] border border-[#E8DFD5] dark:border-[#262626]">
                                            <strong className="block text-[#1E2224] dark:text-white mb-0.5">3. Study & Export PDF</strong>
                                            Read your notes online or export clean, printable PDF revision sheets in 1-click.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalContent === 'features' && (
                                <div className="space-y-4">
                                    <FiBookOpen className="w-8 h-8 text-[#2B5866] dark:text-teal-400" />
                                    <h3 className="text-xl font-extrabold font-serif text-[#1E2224] dark:text-white">Features Overview</h3>
                                    <ul className="space-y-2.5 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400 shrink-0" />
                                            <span>Deep Concept Notes with Exam Takeaway Boxes</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400 shrink-0" />
                                            <span>5-Min Rapid Revision Bullet Sheets</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400 shrink-0" />
                                            <span>Predicted Semester Exam Question Banks</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400 shrink-0" />
                                            <span>Mermaid Architecture & Process Flowcharts</span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {modalContent === 'privacy' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif text-[#1E2224] dark:text-white">Privacy Policy</h3>
                                    <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">
                                        Your privacy is our priority. We store user data securely and never sell your personal information. All generated notes are saved safely under your account library.
                                    </p>
                                </div>
                            )}

                            {modalContent === 'terms' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif text-[#1E2224] dark:text-white">Terms of Service</h3>
                                    <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">
                                        NoteX is designed to assist students with high-yield exam preparation. Users retain full rights to export and study their generated notes.
                                    </p>
                                </div>
                            )}

                            {modalContent === 'support' && (
                                <div className="space-y-3">
                                    <h3 className="text-xl font-extrabold font-serif text-[#1E2224] dark:text-white">Contact Support</h3>
                                    <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">
                                        Have questions or need assistance with your AI credits? Email our support team anytime at <a href="mailto:support@preppulse.ai" className="font-bold text-[#C85A32] dark:text-white underline">support@preppulse.ai</a>.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setModalContent(null)}
                                className="w-full py-3 rounded-2xl bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider hover:bg-[#B24B27] dark:hover:bg-gray-100 transition-all shadow-xs cursor-pointer mt-4"
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
