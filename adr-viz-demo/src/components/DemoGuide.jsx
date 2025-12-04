import React from 'react';
import { X, ArrowRight, Activity, Shield, Zap, BarChart, Layers } from 'lucide-react';

export function DemoGuide({ isOpen, onClose, onStartTour }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-neutral-800">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-950">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to ADR Platform</h2>
                        <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">Autonomous Dispute Resolution • v3.3.1</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                            The Future of Exception Handling
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                            Experience a fully autonomous system that predicts, prevents, and resolves disputes before they impact your bottom line.
                        </p>
                    </div>

                    {/* Key Concepts Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                                <Activity size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">L-1: Pre-Dispute Radar</h3>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                AI models analyze transaction patterns to predict potential disputes <strong>before</strong> they occur, allowing for proactive intervention.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Autonomous Resolution</h3>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                Smart policies automatically approve or reject exceptions based on risk scores and dynamic thresholds, reducing manual workload by 90%.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Thought Streaming</h3>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                Watch the AI "think" in real-time. See the logic, confidence scores, and reasoning behind every automated decision.
                            </p>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 text-cyan-500"><Layers size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Interactive Policy Tuner</h4>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">Adjust the <strong>Approval Threshold</strong> slider to instantly see how risk tolerance affects automation rates and manual review volume.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 text-cyan-500"><BarChart size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">God Mode Analytics</h4>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">Switch to <strong>Cluster View</strong> or <strong>Dashboard</strong> to visualize patterns, identify high-risk clusters, and track business value generated.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 font-medium transition-colors"
                    >
                        Explore Manually
                    </button>
                    <button
                        onClick={() => { onClose(); onStartTour(); }}
                        className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105"
                    >
                        Start Interactive Tour <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
