import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, Search, Shield, FileText, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const ThoughtStream = ({ thoughts }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        if (visibleIndex < thoughts.length) {
            const timer = setTimeout(() => {
                setVisibleIndex(prev => prev + 1);
            }, thoughts[visibleIndex].duration);
            return () => clearTimeout(timer);
        }
    }, [visibleIndex, thoughts]);

    const getIcon = (stage) => {
        switch (stage) {
            case 'PERCEIVE': return <Search size={14} />;
            case 'REASON': return <Brain size={14} />;
            case 'DECIDE': return <Shield size={14} />;
            case 'ACT': return <Cpu size={14} />;
            default: return <FileText size={14} />;
        }
    };

    return (
        <div className="bg-black/90 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto border border-gray-800 shadow-inner">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 font-bold tracking-wider">COGNITIVE STREAM</span>
            </div>

            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {thoughts.slice(0, visibleIndex + 1).map((thought, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "flex gap-3 items-start",
                                idx === visibleIndex ? "opacity-100" : "opacity-50"
                            )}
                        >
                            <div className={clsx(
                                "mt-0.5 p-1 rounded",
                                thought.stage === 'PERCEIVE' && "text-blue-400 bg-blue-900/20",
                                thought.stage === 'REASON' && "text-purple-400 bg-purple-900/20",
                                thought.stage === 'DECIDE' && "text-yellow-400 bg-yellow-900/20",
                                thought.stage === 'ACT' && "text-emerald-400 bg-emerald-900/20"
                            )}>
                                {getIcon(thought.stage)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-300">{thought.action}</span>
                                    <span className="text-[10px] text-gray-600">{thought.duration}ms</span>
                                </div>
                                <div className="text-gray-500 mt-0.5">{thought.detail}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {visibleIndex === thoughts.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-green-500 mt-4 border-t border-gray-800 pt-2"
                    >
                        -- END OF STREAM --
                    </motion.div>
                )}
            </div>
        </div>
    );
};
