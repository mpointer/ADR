import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LAYERS } from '../lib/simulation';
import { Clock, ZoomIn, ZoomOut } from 'lucide-react';

const LAYER_COLORS = {
    [LAYERS.L0]: 'bg-slate-500',
    [LAYERS.L1]: 'bg-blue-500',
    [LAYERS.L1_5]: 'bg-indigo-500',
    [LAYERS.L2]: 'bg-purple-500',
    [LAYERS.L3A]: 'bg-pink-500',
    [LAYERS.L3B]: 'bg-rose-500',
    [LAYERS.L6]: 'bg-emerald-500',
    [LAYERS.L5]: 'bg-cyan-500',
};

const TimelineView = ({ exceptions, onExceptionClick }) => {
    // Calculate timeline range
    const { minTime, maxTime, totalDuration } = useMemo(() => {
        if (exceptions.length === 0) return { minTime: Date.now(), maxTime: Date.now(), totalDuration: 1000 };

        let min = Infinity;
        let max = -Infinity;

        exceptions.forEach(ex => {
            const start = new Date(ex.timestamp).getTime();
            // Use current time for active exceptions, or last history item for completed
            const lastUpdate = ex.history.length > 0
                ? new Date(ex.history[ex.history.length - 1].timestamp).getTime()
                : start;
            const end = ex.status === 'COMPLETED' ? lastUpdate : Date.now();

            if (start < min) min = start;
            if (end > max) max = end;
        });

        // Add some padding
        return { minTime: min, maxTime: max, totalDuration: max - min };
    }, [exceptions]);

    const getLeft = (time) => {
        const t = new Date(time).getTime();
        return `${((t - minTime) / totalDuration) * 100}%`;
    };

    const getWidth = (start, end) => {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        return `${((e - s) / totalDuration) * 100}%`;
    };

    return (
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-slate-100">Temporal Execution Timeline</h2>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 relative">
                {/* Time Grid Lines (Simplified) */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-4 opacity-10">
                    {[0, 25, 50, 75, 100].map(p => (
                        <div key={p} className="h-full w-px bg-slate-100" style={{ left: `${p}%` }} />
                    ))}
                </div>

                {exceptions.map(ex => {
                    // Construct segments from history
                    const segments = [];
                    const history = [...ex.history, { ...ex, timestamp: new Date().toISOString() }]; // Add current state as final point

                    for (let i = 0; i < history.length - 1; i++) {
                        const current = history[i];
                        const next = history[i + 1];
                        segments.push({
                            layer: current.layer,
                            start: current.timestamp,
                            end: next.timestamp,
                            status: current.status
                        });
                    }

                    return (
                        <motion.div
                            key={ex.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative h-12 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
                            onClick={() => onExceptionClick(ex)}
                        >
                            {/* Exception Label */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 pointer-events-none">
                                <span className="text-xs font-mono text-slate-400">{ex.id.split('-')[0]}</span>
                                <span className="text-xs font-medium text-slate-200">{ex.type}</span>
                            </div>

                            {/* Timeline Bars */}
                            <div className="absolute inset-y-2 left-32 right-4 bg-slate-900/50 rounded overflow-hidden">
                                {segments.map((seg, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute h-full ${LAYER_COLORS[seg.layer] || 'bg-slate-600'} opacity-80 hover:opacity-100 transition-opacity`}
                                        style={{
                                            left: getLeft(seg.start),
                                            width: getWidth(seg.start, seg.end),
                                            minWidth: '4px' // Ensure visibility for fast steps
                                        }}
                                        title={`${seg.layer}: ${seg.status}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                {exceptions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Clock className="w-12 h-12 mb-2 opacity-20" />
                        <p>No active timeline data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelineView;
