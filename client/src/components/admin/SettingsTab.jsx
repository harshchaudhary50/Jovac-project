import React, { useState, useEffect } from 'react';
import { FiCheck, FiSave, FiCpu, FiZap, FiAlertCircle, FiRadio } from 'react-icons/fi';
import axios from 'axios';
import { serverUrl } from '../../App';

const DEFAULTS = {
    creditCostPerGeneration: 10,
    starterPlanPrice: 49,
    proPlanPrice: 199,
    maintenanceMode: false,
    selectedAiModel: 'Gemini 2.5 Flash',
    announcementBanner: 'Welcome to NoteX! Upgrade to Pro for priority note generation.',
    isBannerActive: true
};

function SettingsTab({ initialSettings, refreshData }) {
    const [settings, setSettings] = useState(() => {
        const savedLocal = localStorage.getItem('adminSettings');
        if (savedLocal) {
            try { 
                const parsed = JSON.parse(savedLocal);
                return {
                    ...DEFAULTS,
                    ...parsed,
                    creditCostPerGeneration: Number(parsed.creditCostPerGeneration) || DEFAULTS.creditCostPerGeneration,
                    starterPlanPrice: Number(parsed.starterPlanPrice) || DEFAULTS.starterPlanPrice,
                    proPlanPrice: Number(parsed.proPlanPrice) || DEFAULTS.proPlanPrice,
                };
            } catch (e) {}
        }
        return {
            ...DEFAULTS,
            ...(initialSettings || {})
        };
    });

    const [savedMessage, setSavedMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    // Allow backspace to completely clear the box while typing
    const handleNumberChange = (field, rawVal) => {
        if (rawVal === '') {
            setSettings(prev => ({ ...prev, [field]: '' }));
            return;
        }
        // Remove leading zeroes
        const clean = rawVal.replace(/^0+(?=\d)/, '');
        const val = clean === '' ? '' : Math.max(0, parseInt(clean, 10));
        setSettings(prev => ({ ...prev, [field]: isNaN(val) ? '' : val }));
    };

    // On blur, if empty or invalid, fallback to healthy default
    const handleNumberBlur = (field, defaultVal) => {
        const currentVal = settings[field];
        if (currentVal === '' || currentVal === null || currentVal === undefined || Number(currentVal) <= 0) {
            const updated = { ...settings, [field]: defaultVal };
            setSettings(updated);
            localStorage.setItem('adminSettings', JSON.stringify(updated));
        } else {
            const updated = { ...settings, [field]: Number(currentVal) };
            setSettings(updated);
            localStorage.setItem('adminSettings', JSON.stringify(updated));
        }
    };

    const handleChange = (field, value) => {
        const updated = { ...settings, [field]: value };
        setSettings(updated);
        localStorage.setItem('adminSettings', JSON.stringify(updated));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...settings,
            creditCostPerGeneration: Number(settings.creditCostPerGeneration) || DEFAULTS.creditCostPerGeneration,
            starterPlanPrice: Number(settings.starterPlanPrice) || DEFAULTS.starterPlanPrice,
            proPlanPrice: Number(settings.proPlanPrice) || DEFAULTS.proPlanPrice,
        };

        setSettings(payload);
        localStorage.setItem('adminSettings', JSON.stringify(payload));

        try {
            const res = await axios.post(`${serverUrl}/api/admin/settings/update`, payload);
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

    const preventNegativeKey = (e) => {
        if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
            e.preventDefault();
        }
    };

    const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-hidden focus:border-[#C85A32] dark:focus:border-white transition-colors placeholder:text-gray-400";

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Header Action */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-full bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#B24B27] dark:hover:bg-gray-100 text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                    <FiSave className="w-4 h-4" /> Save System Settings
                </button>
            </div>

            {/* Toast Notification */}
            {savedMessage && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8DFD5] dark:border-[#2e2e2e] text-[#1E2224] dark:text-white text-xs font-semibold flex items-center gap-3 shadow-xs animate-fade-in">
                    <div className="w-6 h-6 rounded-full bg-[#FAF0DC] dark:bg-[#252525] border border-[#DA9B42]/30 dark:border-[#333333] flex items-center justify-center text-[#B86337] dark:text-[#E6E2D3] shrink-0">
                        <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>System configuration updated successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Card 1: Credit Economics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1E2224] dark:text-white flex items-center gap-2 border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                        <FiZap className="text-[#DA9B42] dark:text-amber-400" /> Credit Economics & Rates
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="text-[#5C6468] dark:text-gray-400 font-bold block mb-1">Credit Cost Per Note Generation</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="10"
                                value={settings.creditCostPerGeneration}
                                onChange={(e) => handleNumberChange('creditCostPerGeneration', e.target.value)}
                                onBlur={() => handleNumberBlur('creditCostPerGeneration', 10)}
                                onKeyDown={preventNegativeKey}
                                onWheel={(e) => e.currentTarget.blur()}
                                className={inputClasses}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 font-bold block mb-1">Starter Pack Price (₹)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="49"
                                    value={settings.starterPlanPrice}
                                    onChange={(e) => handleNumberChange('starterPlanPrice', e.target.value)}
                                    onBlur={() => handleNumberBlur('starterPlanPrice', 49)}
                                    onKeyDown={preventNegativeKey}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="text-[#5C6468] dark:text-gray-400 font-bold block mb-1">Pro Plan Price (₹)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="199"
                                    value={settings.proPlanPrice}
                                    onChange={(e) => handleNumberChange('proPlanPrice', e.target.value)}
                                    onBlur={() => handleNumberBlur('proPlanPrice', 199)}
                                    onKeyDown={preventNegativeKey}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: AI Engine Settings */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1E2224] dark:text-white flex items-center gap-2 border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                        <FiCpu className="text-[#2B5866] dark:text-blue-400" /> AI Engine Configuration
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="text-[#5C6468] dark:text-gray-400 font-bold block mb-1">Active AI Language Model</label>
                            <select
                                value={settings.selectedAiModel}
                                onChange={(e) => handleChange('selectedAiModel', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold cursor-pointer"
                            >
                                <option value="Ollama Local (llama3.2:3b)">Ollama Local (llama3.2:3b - 100% Offline Dev Mode)</option>
                                <option value="Groq Fast (GPT-OSS 120B / Llama)">Groq Fast (GPT-OSS 120B / Llama - 0.2s Ultra Fast)</option>
                                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Google AI Studio - Deep Reasoning)</option>
                            </select>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-between">
                            <div>
                                <p className="font-extrabold text-[#1E2224] dark:text-white flex items-center gap-1.5">
                                    <FiAlertCircle className="text-[#DA9B42]" /> Maintenance Mode
                                </p>
                                <p className="text-[11px] text-[#5C6468] dark:text-gray-400">Pause AI generations for server updates</p>
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
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] shadow-sm space-y-4 lg:col-span-2">
                    <h3 className="text-base font-extrabold font-serif-title text-[#1E2224] dark:text-white flex items-center gap-2 border-b border-[#E8DFD5] dark:border-[#262626] pb-3">
                        <FiRadio className="text-[#6B7B52] dark:text-emerald-400" /> Dashboard Welcome & Announcement Banner
                    </h3>

                    <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between">
                            <label className="text-[#5C6468] dark:text-gray-400 font-bold">Enable Dashboard Banner</label>
                            <input
                                type="checkbox"
                                checked={settings.isBannerActive}
                                onChange={(e) => handleChange('isBannerActive', e.target.checked)}
                                className="w-4 h-4 text-[#C85A32] accent-[#C85A32] rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="text-[#5C6468] dark:text-gray-400 font-bold block mb-1">Welcome / Announcement Banner Text</label>
                            <input
                                type="text"
                                value={settings.announcementBanner}
                                onChange={(e) => handleChange('announcementBanner', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white font-bold"
                                placeholder="e.g., Welcome to NoteX! Upgrade to Pro for priority note generation."
                            />
                        </div>
                    </div>
                </div>

            </div>
        </form>
    );
}

export default SettingsTab;
