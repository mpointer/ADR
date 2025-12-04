import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle, CheckCircle, FileText, Activity, Shield, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { ThoughtStream } from './ThoughtStream';

export const ExceptionDetailModal = ({ exception, onClose, onRollback }) => {
    const [activeTab, setActiveTab] = useState('details');

    if (!exception) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-neutral-800"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-start bg-gray-50 dark:bg-neutral-950/50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={clsx(
                                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                    exception.industry === 'Healthcare' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                                    exception.industry === 'Finance' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                    exception.industry === 'Retail' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                )}>
                                    {exception.industry}
                                </span>
                                <span className="text-gray-400 text-xs font-mono">{exception.id}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exception.type}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-neutral-800">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={clsx(
                                "flex-1 py-3 text-sm font-medium transition-colors relative",
                                activeTab === 'details' ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                        >
                            Details
                            {activeTab === 'details' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('thought_stream')}
                            className={clsx(
                                "flex-1 py-3 text-sm font-medium transition-colors relative",
                                activeTab === 'thought_stream' ? "text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                        >
                            AI Reasoning
                            {activeTab === 'thought_stream' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={clsx(
                                "flex-1 py-3 text-sm font-medium transition-colors relative",
                                activeTab === 'history' ? "text-orange-600 dark:text-orange-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                        >
                            History & Rollback
                            {activeTab === 'history' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('json')}
                            className={clsx(
                                "flex-1 py-3 text-sm font-medium transition-colors relative",
                                activeTab === 'json' ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            )}
                        >
                            Raw JSON
                            {activeTab === 'json' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Status Card */}
                                <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "p-2 rounded-full",
                                            exception.status === 'COMPLETED' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                                        )}>
                                            {exception.status === 'COMPLETED' ? <CheckCircle size={24} /> : <Activity size={24} />}
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                                            <div className="font-bold text-lg">{exception.status}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Active Agent</div>
                                        <div className="font-mono text-sm bg-black/5 dark:bg-white/10 px-2 py-1 rounded mt-1">
                                            {exception.agent || 'None'}
                                        </div>
                                    </div>
                                </div>

                                {/* Business Data Grid */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Business Context</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(exception.data).map(([key, value]) => (
                                            <div key={key} className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-3 rounded hover:border-cyan-500/30 transition-colors">
                                                <div className="text-xs text-gray-400 font-mono mb-1 uppercase">{key.replace(/_/g, ' ')}</div>
                                                <div className="font-medium truncate" title={String(value)}>{String(value)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'thought_stream' && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Live Reasoning Trace</h3>
                                {exception.thoughtStream ? (
                                    <ThoughtStream thoughts={exception.thoughtStream} />
                                ) : (
                                    <div className="text-center text-gray-500 py-8 italic">No reasoning trace available for this exception.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Time Travel & Snapshots</h3>
                                {exception.history && exception.history.length > 0 ? (
                                    <div className="relative border-l-2 border-gray-200 dark:border-neutral-700 ml-3 space-y-6">
                                        {exception.history.map((snapshot, idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-600 border-2 border-white dark:border-neutral-900" />
                                                <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded border border-gray-200 dark:border-neutral-700">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-sm">{snapshot.status}</span>
                                                        <span className="text-xs text-gray-500 font-mono">{new Date(snapshot.timestamp).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                                                        Agent: <span className="font-mono">{snapshot.agent || 'None'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => onRollback(exception.id, idx)}
                                                        className="flex items-center gap-1.5 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1.5 rounded hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors w-full justify-center font-bold"
                                                    >
                                                        <RotateCcw size={12} />
                                                        Rollback to this State
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8 italic">No history available yet.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'json' && (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                {JSON.stringify(exception, null, 2)}
                            </pre>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
