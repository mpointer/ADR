import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { STATES } from '../lib/simulation';

export const ManualReviewQueue = ({ exceptions, onApprove, onReject }) => {
    const pendingExceptions = exceptions.filter(e => e.status === STATES.MANUAL_HOLD);

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4 h-96 flex flex-col font-sans transition-colors duration-300">
            <h3 className="text-sm font-bold text-gray-500 dark:text-neutral-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                Manual Review Queue
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full">
                    {pendingExceptions.length}
                </span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence>
                    {pendingExceptions.map(e => (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-3 rounded border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{e.type}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{e.id.split('-')[0]} • {e.industry}</div>
                                </div>
                                {e.priority === 'HIGH' && (
                                    <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                                        HIGH
                                    </span>
                                )}
                            </div>

                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-3 bg-white/50 dark:bg-black/20 p-2 rounded">
                                <span className="font-semibold">AI Proposal:</span> {e.data.ai_proposal || "Review Required"}
                                <br />
                                <span className="font-semibold">Confidence:</span> {e.data.confidence ? (e.data.confidence * 100).toFixed(1) + '%' : 'N/A'}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onApprove(e.id)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 py-1.5 rounded shadow-sm text-xs font-bold transition-all transform hover:scale-[1.02]"
                                >
                                    <Check size={12} /> Approve
                                </button>
                                <button
                                    onClick={() => onReject(e.id)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-1.5 rounded text-xs font-medium transition-colors"
                                >
                                    <X size={12} /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {pendingExceptions.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-neutral-600 mt-10 text-xs">
                        No items pending review.
                    </div>
                )}
            </div>
        </div>
    );
};
