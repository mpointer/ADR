import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRIES } from '../lib/simulation';
import clsx from 'clsx';
import { Activity, Heart, DollarSign, ShoppingBag, AlertTriangle } from 'lucide-react';

export const ClusterMapView = ({ exceptions, onExceptionClick }) => {
    // Group exceptions by Industry
    const clusters = useMemo(() => {
        const groups = {
            [INDUSTRIES.HEALTHCARE]: [],
            [INDUSTRIES.FINANCE]: [],
            [INDUSTRIES.RETAIL]: [],
            'Unknown': []
        };

        exceptions.forEach(e => {
            const key = e.industry || 'Unknown';
            if (groups[key]) groups[key].push(e);
            else groups['Unknown'].push(e);
        });

        return groups;
    }, [exceptions]);

    const getIcon = (industry) => {
        switch (industry) {
            case INDUSTRIES.HEALTHCARE: return <Heart size={24} />;
            case INDUSTRIES.FINANCE: return <DollarSign size={24} />;
            case INDUSTRIES.RETAIL: return <ShoppingBag size={24} />;
            default: return <Activity size={24} />;
        }
    };

    const getColor = (industry) => {
        switch (industry) {
            case INDUSTRIES.HEALTHCARE: return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300';
            case INDUSTRIES.FINANCE: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
            case INDUSTRIES.RETAIL: return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300';
            default: return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="h-full w-full p-8 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                {Object.entries(clusters).map(([industry, items]) => {
                    if (items.length === 0) return null;

                    return (
                        <motion.div
                            key={industry}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={clsx(
                                "relative rounded-2xl border-2 p-6 flex flex-col gap-4 transition-colors duration-500",
                                getColor(industry)
                            )}
                        >
                            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                                        {getIcon(industry)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{industry}</h3>
                                        <p className="text-xs opacity-70 font-mono">{items.length} Active Cases</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-black opacity-20">
                                    {Math.round((items.length / exceptions.length) * 100)}%
                                </div>
                            </div>

                            <div className="flex-1 relative">
                                <div className="flex flex-wrap gap-2 content-start">
                                    <AnimatePresence>
                                        {items.map(e => (
                                            <motion.div
                                                key={e.id}
                                                layoutId={e.id}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                onClick={() => onExceptionClick(e)}
                                                className={clsx(
                                                    "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:scale-110 transition-transform border-2",
                                                    e.priority === 'HIGH' ? "bg-red-500 border-red-600 text-white animate-pulse" : "bg-white dark:bg-black/40 border-current"
                                                )}
                                                title={`${e.type} - ${e.status}`}
                                            >
                                                {e.priority === 'HIGH' ? (
                                                    <AlertTriangle size={16} />
                                                ) : (
                                                    <span className="text-[10px] font-bold opacity-70">{e.id.substring(0, 2)}</span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
