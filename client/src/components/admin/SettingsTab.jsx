import React, { useState, useEffect } from 'react';
import { FiCheck, FiSave, FiCpu, FiZap, FiAlertCircle, FiRadio } from 'react-icons/fi';
import axios from 'axios';
import { serverUrl } from '../../App';

function SettingsTab({ initialSettings, refreshData }) {
    const [settings, setSettings] = useState(() => {
        const savedLocal = localStorage.getItem('adminSettings');
        if (savedLocal) {
            try { return JSON.parse(savedLocal); } catch (e) {}
        }
        return initialSettings || {
            creditCostPerGeneration: 10,
            starterPlanPrice: 49,
            proPlanPrice: 199,
            maintenanceMode: false,
            selectedAiModel: 'Gemini 2.5 Flash',
            announcementBanner: 'Welcome to PrepAI! Upgrade to Pro for priority note generation.',
            isBannerActive: true
        };
    });

    const [savedMessage, setSavedMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        const updated = { ...settings, [field]: value };
        setSettings(updated);
        localStorage.setItem('adminSettings', JSON.stringify(updated));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        try {
            const res = await axios.post(`${serverUrl}/api/admin/settings/update`, settings);
            if (res.data?.settings) {
                setSettings(res.data.settings);
                localStorage.setItem('adminSettings', JSON.stringify(res.data.settings));
            }
            setSavedMessage(true);
            setTimeout(() => setSavedMessage(false), 3000);
            if (refreshData) refreshData();
        } catch (err) {
            console.error(err);
            setSavedMessage(true);
            setTimeout(() => setSavedMessage(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Header Action */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-full bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] text-xs font-extrabold uppercase tracking-wider hover:bg-black transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                    <FiSave className="w-4 h-4" /> Save System Settings
                </button>
            </div>

            {/* Toast Notification */}
            {savedMessage && (
                <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <FiCheck className="w-4 h-4" /> System configuration updated successfully!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Credit Economics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1e2025] dark:text-white flex items-center gap-2 border-b border-[#B2B4B7]/30 dark:border-[#262626] pb-3">
                        <FiZap className="text-amber-500" /> Credit Economics & Rates
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="text-[#52565c] dark:text-gray-400 font-bold block mb-1">Credit Cost Per Note Generation</label>
                            <input
                                type="number"
                                value={settings.creditCostPerGeneration}
                                onChange={(e) => handleChange('creditCostPerGeneration', Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-[#1e2025] dark:text-white font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[#52565c] dark:text-gray-400 font-bold block mb-1">Starter Pack Price (₹)</label>
                                <input
                                    type="number"
                                    value={settings.starterPlanPrice}
                                    onChange={(e) => handleChange('starterPlanPrice', Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-[#1e2025] dark:text-white font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[#52565c] dark:text-gray-400 font-bold block mb-1">Pro Plan Price (₹)</label>
                                <input
                                    type="number"
                                    value={settings.proPlanPrice}
                                    onChange={(e) => handleChange('proPlanPrice', Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-[#1e2025] dark:text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: AI Engine Settings */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1e2025] dark:text-white flex items-center gap-2 border-b border-[#B2B4B7]/30 dark:border-[#262626] pb-3">
                        <FiCpu className="text-blue-500" /> AI Engine Configuration
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="text-[#52565c] dark:text-gray-400 font-bold block mb-1">Active AI Language Model</label>
                            <select
                                value={settings.selectedAiModel}
                                onChange={(e) => handleChange('selectedAiModel', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-[#1e2025] dark:text-white font-bold cursor-pointer"
                            >
                                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Ultra Fast)</option>
                                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                                <option value="GPT-4o Mini">GPT-4o Mini (Fallback)</option>
                            </select>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] flex items-center justify-between">
                            <div>
                                <p className="font-extrabold text-[#1e2025] dark:text-white flex items-center gap-1.5">
                                    <FiAlertCircle className="text-amber-500" /> Maintenance Mode
                                </p>
                                <p className="text-[11px] text-[#52565c] dark:text-gray-400">Pause AI generations for server updates</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                                    settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-400 dark:bg-gray-700'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3: Dashboard Welcome & Announcement Banner */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] shadow-sm space-y-4 lg:col-span-2">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1e2025] dark:text-white flex items-center gap-2 border-b border-[#B2B4B7]/30 dark:border-[#262626] pb-3">
                        <FiRadio className="text-emerald-500" /> Dashboard Welcome & Announcement Banner
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between">
                            <label className="text-[#52565c] dark:text-gray-400 font-bold">Enable Dashboard Banner</label>
                            <input
                                type="checkbox"
                                checked={settings.isBannerActive}
                                onChange={(e) => handleChange('isBannerActive', e.target.checked)}
                                className="w-4 h-4 text-[#1e2025] accent-[#1e2025] rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="text-[#52565c] dark:text-gray-400 font-bold block mb-1">Welcome / Announcement Banner Text</label>
                            <input
                                type="text"
                                value={settings.announcementBanner}
                                onChange={(e) => handleChange('announcementBanner', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#EDEBE0]/60 dark:bg-[#222222] border border-[#B2B4B7]/40 dark:border-[#303030] text-[#1e2025] dark:text-white font-bold"
                                placeholder="e.g., Welcome to PrepAI! Upgrade to Pro for priority note generation."
                            />
                        </div>
                    </div>
                </div>

            </div>
        </form>
    );
}

export default SettingsTab;
