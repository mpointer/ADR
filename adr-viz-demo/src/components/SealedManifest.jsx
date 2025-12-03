import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const LogEntry = ({ log }) => {
    const getStyle = (type) => {
        switch (type) {
            case 'warning': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'error': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'success': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            case 'control': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'ai': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
            case 'security': return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono';
            default: return 'text-gray-600 dark:text-gray-400 bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded border mb-2 text-xs ${getStyle(log.type)}`}
        >
            <div className="flex justify-between items-start mb-1">
                <span className="opacity-50 font-mono text-[10px]">{log.timestamp.split('T')[1].split('.')[0]}</span>
                {log.pattern && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold">
                        {log.pattern.id}: {log.pattern.name}
                    </span>
                )}
            </div>
            <div className="font-medium">{log.message}</div>
            {log.agent && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] opacity-75">
                    <span>🤖 {log.agent}</span>
                </div>
            )}
        </motion.div>
    );
};

export const SealedManifest = ({ exceptions }) => {
    const scrollRef = useRef(null);

    // Flatten all logs from all exceptions and sort by timestamp (newest first)
    const allLogs = exceptions.flatMap(e =>
        (e.logs || []).map(log => ({ ...log, exceptionId: e.id, exceptionType: e.type }))
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4 h-96 flex flex-col font-mono text-xs transition-colors duration-300">
            <h3 className="text-sm font-bold text-gray-500 dark:text-neutral-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sealed Manifest Stream
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {allLogs.map((log, i) => (
                        <LogEntry key={`${log.exceptionId}-${i}`} log={log} />
                    ))}
                </AnimatePresence>
                {allLogs.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-neutral-600 mt-10">Waiting for signals...</div>
                )}
            </div>
        </div>
    );
};
