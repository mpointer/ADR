import React, { useState } from 'react';
import { X, FileJson, Activity, Database, ShieldCheck, History, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExceptionDetailModal = ({ exception, onClose, onRollback }) => {
    const [activeTab, setActiveTab] = useState('business');

    if (!exception) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-950">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{exception.type}</h2>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${exception.priority === 'HIGH'
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {exception.priority}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                            ID: {exception.id} • {exception.sourceSystem}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-neutral-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('business')}
                        className={`flex-1 min-w-[100px] py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'business' ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
                    >
                        <Database size={14} /> Business Data
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 min-w-[100px] py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
                    >
                        <History size={14} /> History & Rollback
                    </button>
                    <button
                        onClick={() => setActiveTab('manifest')}
                        className={`flex-1 min-w-[100px] py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'manifest' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
                    >
                        <ShieldCheck size={14} /> Sealed Manifest
                    </button>
                    <button
                        onClick={() => setActiveTab('json')}
                        className={`flex-1 min-w-[100px] py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'json' ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
                    >
                        <FileJson size={14} /> Raw JSON
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-neutral-900">
                    {activeTab === 'business' && (
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(exception.data).map(([key, value]) => (
                                <div key={key} className="p-3 bg-gray-50 dark:bg-neutral-800 rounded border border-gray-100 dark:border-neutral-700">
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-bold">
                                        {key.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-sm font-mono text-gray-800 dark:text-gray-200 break-words">
                                        {value === null ? 'N/A' : value.toString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Transaction History</h3>
                                <span className="text-xs text-gray-500">{exception.history.length} snapshots available</span>
                            </div>

                            <div className="relative border-l-2 border-gray-200 dark:border-neutral-800 ml-3 space-y-6">
                                {exception.history.map((snapshot, index) => (
                                    <div key={index} className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs font-bold text-gray-900 dark:text-white uppercase">{snapshot.status}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{new Date(snapshot.timestamp).toLocaleTimeString()}</div>
                                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                    Layer: {snapshot.layer}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRollback(exception.id, index)}
                                                className="flex items-center gap-1 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                                            >
                                                <RotateCcw size={10} /> Rollback
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {exception.history.length === 0 && (
                                    <div className="pl-6 text-xs text-gray-500 italic">No history available (Initial State)</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'manifest' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase">Cryptographic Chain</h3>
                                <div className="space-y-2">
                                    {exception.manifest.hashes.map((hash, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-mono">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 p-2 bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800 flex justify-between">
                                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{hash.step}</span>
                                                <span className="text-slate-400">{hash.hash}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {exception.manifest.hashes.length === 0 && (
                                        <div className="text-center text-gray-400 italic">No hashes generated yet.</div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase">Bill of Materials (BOM)</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(exception.manifest.bom).map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-1 last:border-0">
                                            <span className="text-slate-500">{k}</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'json' && (
                        <pre className="text-[10px] font-mono bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(exception, null, 2)}
                        </pre>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
