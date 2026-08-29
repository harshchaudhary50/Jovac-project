import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { serverUrl } from '../App';
import { clearUserData, updateUserTheme } from '../redux/userSlice';
import { saveThemePreference, logoutUser } from '../services/api';
import { ToggleTheme } from './lightswind/toggle-theme';
import {
    FiZap,
    FiGrid,
    FiFolder,
    FiDollarSign,
    FiShield,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronDown,
    FiPlus
} from 'react-icons/fi';

function Navbar() {
    const { userData } = useSelector((state) => state.user);
    const credits = userData?.credits ?? 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

    // Track active theme state from user profile or document
    const isDark = userData?.themePreference === 'dark' || document.documentElement.classList.contains('dark');

    const toggleTheme = async () => {
        if (!userData) return; // Disabled for non-logged-in public visitors

        const nextTheme = isDark ? 'light' : 'dark';
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        dispatch(updateUserTheme(nextTheme));
        await saveThemePreference(nextTheme);
    };

    const handleSignOut = async () => {
        try {
            await logoutUser(dispatch);
        } catch (error) {
            console.warn("Logout error:", error.message);
        } finally {
            // Enforce light mode on logout for landing & login page
            document.documentElement.classList.remove('dark');
            dispatch(clearUserData());
            navigate("/");
        }
    };

    // Public Landing Nav Links
    const publicNavLinks = [
        { label: "Home", href: "/" },
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" }
    ];

    // Check if current user is admin
    const isAdmin = userData?.role?.toLowerCase() === 'admin' || userData?.email?.toLowerCase() === 'jadounmadhav44@gmail.com';

    // Logged-in App Navigation Links
    const loggedInNavLinks = [
        { label: "Dashboard", href: "/dashboard", icon: <FiGrid className="w-3.5 h-3.5" /> },
        { label: "Notes", href: "/notes", icon: <FiZap className="w-3.5 h-3.5" /> },
        { label: "History", href: "/history", icon: <FiFolder className="w-3.5 h-3.5" /> },
        { label: "Pricing", href: "/pricing", icon: <FiDollarSign className="w-3.5 h-3.5" /> },
        ...(isAdmin ? [{ label: "Admin", href: "/admin", icon: <FiShield className="w-3.5 h-3.5 text-[#DA9B42]" /> }] : [])
    ];

    const handleNavClick = (href) => {
        setMobileMenuOpen(false);
        if (href === "/" || href === "#home" || href === "#top") {
            if (location.pathname !== "/") {
                navigate("/");
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith("#")) {
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
        <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-3 bg-[#FAF7F2]/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#E8DFD5] dark:border-[#262626] transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand Logo */}
                <div
                    onClick={() => {
                        if (location.pathname === "/") {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            navigate(userData ? "/dashboard" : "/");
                        }
                    }}
                    className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
                >
                    <img
                        src="/logo.png"
                        alt="NoteX Logo"
                        className="w-8 h-8 rounded-xl object-contain shadow-xs border border-[#EBD7BE] dark:border-[#303030] group-hover:scale-105 transition-transform"
                    />
                    <span className="text-lg font-bold tracking-tight text-[#1E2224] dark:text-white flex items-center gap-0.5 font-sans">
                        Note<span className="text-[#C85A32] dark:text-white font-extrabold">X</span>
                    </span>
                </div>

                {/* Right Group: Navigation Links + Theme Toggle + Credits + Profile */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">

                    {/* Logged-in Nav Links with Animated Sliding Pill */}
                    {userData ? (
                        <nav className="hidden md:flex items-center gap-1 relative">
                            {loggedInNavLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <button
                                        key={link.href}
                                        onClick={() => navigate(link.href)}
                                        className="relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNavPill"
                                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                                className="absolute inset-0 bg-[#C85A32] dark:bg-white rounded-full shadow-sm"
                                            />
                                        )}
                                        <span className={`relative z-10 flex items-center gap-1.5 ${isActive
                                            ? "text-white dark:text-[#0d0d0d]"
                                            : "text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] dark:hover:text-white"
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
                                    className="text-xs font-semibold uppercase tracking-wider text-[#5C6468] dark:text-gray-400 hover:text-[#C85A32] dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Dark/Light Mode Switcher: View Transition Toggle from Lightswind UI */}
                    {userData && (
                        <ToggleTheme
                            animationType="shrink-grow"
                            duration={550}
                            className="w-9 h-9 p-0 rounded-full bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] shadow-xs hover:border-[#C85A32] dark:hover:border-white transition-all cursor-pointer shrink-0"
                            onThemeChange={(newTheme) => {
                                dispatch(updateUserTheme(newTheme));
                                saveThemePreference(newTheme);
                            }}
                        />
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
                                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] text-[#1E2224] dark:text-white border border-[#E8DFD5] dark:border-[#262626] text-xs font-bold transition shadow-xs hover:border-[#DA9B42] cursor-pointer"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <FiZap className="w-3.5 h-3.5 text-[#DA9B42] dark:text-amber-400" />
                                        <span>{credits} <span className="hidden sm:inline">Credits</span></span>
                                    </span>
                                    <span className="w-4 h-4 rounded-full bg-[#DA9B42] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-[10px]">
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
                                            className="absolute right-0 mt-3 w-64 p-4 bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-2xl shadow-xl z-50 text-left space-y-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-[#5C6468] dark:text-gray-400">Available AI Credits</p>
                                                <p className="text-2xl font-extrabold text-[#1E2224] dark:text-white flex items-center gap-1.5">
                                                    <span className="text-[#DA9B42] dark:text-amber-400"><FiZap className="inline" /></span> {credits}
                                                </p>
                                                <p className="text-[11px] text-[#5C6468] dark:text-gray-400 font-medium">10 Credits used per note generation.</p>
                                            </div>
                                            <button
                                                onClick={() => { setShowCredits(false); navigate("/pricing"); }}
                                                className="w-full py-2.5 rounded-xl bg-[#DA9B42] dark:bg-white text-white dark:text-[#0d0d0d] font-bold text-xs uppercase tracking-wider hover:bg-[#C0842E] dark:hover:bg-gray-100 transition cursor-pointer"
                                            >
                                                Top Up Credits
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User Profile Avatar with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowProfile(!showProfile); setShowCredits(false); }}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] text-xs font-bold text-[#1E2224] dark:text-white shadow-xs hover:border-[#C85A32] dark:hover:border-white transition-all cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#2B5866] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-xs font-bold uppercase">
                                        {userData?.name ? userData.name.charAt(0) : "U"}
                                    </div>
                                    <span className="hidden sm:inline max-w-[100px] truncate text-[#1E2224] dark:text-white">{userData?.name?.split(' ')[0]}</span>
                                    <FiChevronDown className="w-3.5 h-3.5 text-[#5C6468] dark:text-gray-400" />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-56 p-3 bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] rounded-2xl shadow-xl z-50 text-left space-y-2"
                                        >
                                            <div className="p-2 space-y-0.5 border-b border-[#E8DFD5] dark:border-[#262626]">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold text-[#1E2224] dark:text-white truncate">{userData?.name}</p>
                                                    {isAdmin && (
                                                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-[#5C6468] dark:text-gray-400 truncate">{userData?.email}</p>
                                            </div>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => { setShowProfile(false); navigate("/admin"); }}
                                                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#1E2224] dark:text-white hover:bg-[#FAF7F2] dark:hover:bg-[#222222] transition-all flex items-center gap-2 cursor-pointer"
                                                >
                                                    <FiShield className="w-3.5 h-3.5 text-[#DA9B42]" />
                                                    <span>Admin Console</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center gap-2 cursor-pointer"
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
                                className="md:hidden p-2 rounded-full bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] text-[#1E2224] dark:text-white cursor-pointer"
                            >
                                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/auth")}
                                className="text-xs font-bold text-[#1E2224] dark:text-white hover:text-[#C85A32] dark:hover:text-gray-300 px-3 py-2 cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/auth")}
                                className="px-5 py-2.5 rounded-full bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
                        className="md:hidden pt-4 pb-2 space-y-2 border-t border-[#E8DFD5] dark:border-[#262626] mt-3"
                    >
                        {userData ? (
                            loggedInNavLinks.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setMobileMenuOpen(false); navigate(link.href); }}
                                    className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold text-[#1E2224] dark:text-white hover:bg-[#F5EBE1] dark:hover:bg-[#1a1a1a] flex items-center gap-3 transition-all cursor-pointer"
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
                                    className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold text-[#1E2224] dark:text-white hover:bg-[#F5EBE1] dark:hover:bg-[#1a1a1a] transition-all cursor-pointer"
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
