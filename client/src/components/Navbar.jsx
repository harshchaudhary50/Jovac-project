import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiZap, FiLogOut, FiClock, FiPlus, FiChevronDown, FiBookOpen, FiGrid, FiFolder, FiDollarSign, FiSun, FiMoon, FiShield } from 'react-icons/fi';

function Navbar() {
    const { userData } = useSelector((state) => state.user);
    const credits = userData?.credits ?? 0;
    const [showCredits, setShowCredits] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Persistent Dark Mode State
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                return savedTheme === "dark";
            }
            return document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
            dispatch(setUserData(null));
            navigate("/auth");
        } catch (error) {
            console.log(error);
        }
    };

    // Public Navigation Links
    const publicNavLinks = [
        { label: "Home", href: "/" },
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" }
    ];

    // Logged-in App Navigation Links
    const loggedInNavLinks = [
        { label: "Dashboard", href: "/dashboard", icon: <FiGrid className="w-3.5 h-3.5" /> },
        { label: "Notes", href: "/notes", icon: <FiZap className="w-3.5 h-3.5" /> },
        { label: "History", href: "/history", icon: <FiFolder className="w-3.5 h-3.5" /> },
        { label: "Pricing", href: "/pricing", icon: <FiDollarSign className="w-3.5 h-3.5" /> },
        { label: "Admin", href: "/admin", icon: <FiShield className="w-3.5 h-3.5 text-amber-500" /> }
    ];

    const handleNavClick = (href) => {
        setMobileMenuOpen(false);
        if (href.startsWith("#")) {
            if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                    const el = document.querySelector(href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(href);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-3 bg-[#EDEBE0]/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#B2B4B7]/40 dark:border-[#222222] transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Compact Brand Logo */}
                <div 
                    onClick={() => navigate(userData ? "/dashboard" : "/")} 
                    className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
                >
                    <img 
                        src="/favicon.jpg" 
                        alt="PrepAI Logo" 
                        className="w-7 h-7 rounded-full object-cover shadow-xs border border-[#B2B4B7]/30 dark:border-[#303030] group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-lg font-bold tracking-tight text-[#1e2025] dark:text-white flex items-center gap-0.5 font-sans">
                        Prep<span className="text-[#52565c] dark:text-gray-400 font-semibold">AI</span>
                    </span>
                </div>

                {/* Right Group: Navigation Links + Theme Toggle + Credits + Profile */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    
                    {/* Logged-in Nav Links with Animated Sliding Pill */}
                    {userData ? (
                        <nav className="hidden md:flex items-center gap-1 relative">
                            {loggedInNavLinks.map((link) => {
                                const isActive = location.pathname === link.href || (link.href === "/dashboard" && location.pathname === "/");
                                return (
                                    <button
                                        key={link.href}
                                        onClick={() => navigate(link.href)}
                                        className="relative px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNavPill"
                                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                                className="absolute inset-0 bg-[#1e2025] dark:bg-white rounded-full shadow-xs"
                                            />
                                        )}
                                        <span className={`relative z-10 flex items-center gap-1.5 ${
                                            isActive 
                                                ? "text-white dark:text-[#0d0d0d]" 
                                                : "text-[#52565c] dark:text-gray-300 hover:text-[#1e2025] dark:hover:text-white"
                                        }`}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    ) : (
                        /* Nav Links for Landing Page */
                        <nav className="hidden md:flex items-center gap-8 mr-4">
                            {publicNavLinks.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleNavClick(link.href)}
                                    className="text-xs font-semibold uppercase tracking-wider text-[#52565c] dark:text-gray-300 hover:text-[#1e2025] dark:hover:text-white transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Professional Dark Mode Toggle Button (Visible ONLY when Logged In) */}
                    {userData && (
                        <motion.button
                            onClick={() => setIsDark(!isDark)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="p-2 rounded-full bg-white dark:bg-[#161616] text-[#1e2025] dark:text-amber-400 border border-[#B2B4B7]/40 dark:border-[#262626] shadow-xs hover:border-[#1e2025] dark:hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer"
                        >
                            {isDark ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-[#1e2025]" />}
                        </motion.button>
                    )}

                    {/* Action Controls */}
                    {userData ? (
                        <>
                            {/* Credits Pill */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => { setShowCredits(!showCredits); setShowProfile(false); }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] text-[#1e2025] dark:text-white border border-[#B2B4B7]/40 dark:border-[#262626] text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                    <span className="flex items-center gap-1 text-[#1e2025] dark:text-white">
                                        <FiZap className="w-3.5 h-3.5 text-[#1e2025] dark:text-amber-400" />
                                        <span>{credits} Credits</span>
                                    </span>
                                    <span className="w-4 h-4 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-[10px]">
                                        <FiPlus />
                                    </span>
                                </motion.button>

                                {/* Credits Dropdown */}
                                <AnimatePresence>
                                    {showCredits && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-64 p-4 bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-2xl shadow-xl z-50 text-left space-y-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-[#1e2025] dark:text-gray-300">Available AI Credits</p>
                                                <p className="text-2xl font-extrabold text-[#1e2025] dark:text-white">{credits} Credits</p>
                                            </div>
                                            <p className="text-[11px] text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
                                                Each AI note generation costs 10 credits.
                                            </p>
                                            <button
                                                onClick={() => { setShowCredits(false); navigate("/pricing"); }}
                                                className="w-full py-2.5 rounded-xl bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xs cursor-pointer"
                                            >
                                                Buy More Credits
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User Profile Pill */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowProfile(!showProfile); setShowCredits(false); }}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] text-xs font-bold text-[#1e2025] dark:text-white shadow-xs hover:border-[#1e2025] dark:hover:border-white transition-all cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-xs font-bold uppercase">
                                        {userData?.name ? userData.name.charAt(0) : "U"}
                                    </div>
                                    <span className="hidden sm:inline max-w-[100px] truncate text-[#1e2025] dark:text-white">{userData?.name?.split(' ')[0]}</span>
                                    <FiChevronDown className="w-3.5 h-3.5 text-[#52565c] dark:text-gray-400" />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-56 p-3 bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] rounded-2xl shadow-xl z-50 text-left space-y-2"
                                        >
                                            <div className="p-2 space-y-0.5 border-b border-[#B2B4B7]/30 dark:border-[#262626]">
                                                <p className="text-xs font-bold text-[#1e2025] dark:text-white truncate">{userData?.name}</p>
                                                <p className="text-[10px] text-[#52565c] dark:text-gray-400 truncate">{userData?.email}</p>
                                            </div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center gap-2 cursor-pointer"
                                            >
                                                <FiLogOut className="w-3.5 h-3.5" />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-full bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] text-[#1e2025] dark:text-white cursor-pointer"
                            >
                                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/auth")}
                                className="text-xs font-bold text-[#1e2025] dark:text-white hover:underline px-3 py-2 cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/auth")}
                                className="px-5 py-2.5 rounded-full bg-[#1e2025] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden pt-4 pb-2 space-y-2 border-t border-[#B2B4B7]/30 dark:border-[#222222] mt-3"
                    >
                        {userData ? (
                            loggedInNavLinks.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setMobileMenuOpen(false); navigate(link.href); }}
                                    className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold text-[#1e2025] dark:text-white hover:bg-white dark:hover:bg-[#161616] flex items-center gap-3 transition-all cursor-pointer"
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </button>
                            ))
                        ) : (
                            publicNavLinks.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleNavClick(link.href)}
                                    className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold text-[#1e2025] dark:text-white hover:bg-white dark:hover:bg-[#161616] transition-all cursor-pointer"
                                >
                                    {link.label}
                                </button>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
