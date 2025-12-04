import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LAYERS, STATES } from '../lib/simulation';
import clsx from 'clsx';
import { Activity, Database, Server, Shield, Brain, Cpu, Network, FileText, Heart, DollarSign, ShoppingBag, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const Layer = ({ id, title, tech, children, isActive, color = "border-gray-200 dark:border-gray-700" }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const count = React.Children.count(children.props?.children); // Count children inside AnimatePresence

    return (
        <div className={clsx(
            "relative flex flex-col border-2 rounded-lg transition-all duration-500 overflow-hidden",
            "bg-white/50 dark:bg-black/40 backdrop-blur-md",
            isActive ? "border-cyan-500 dark:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.3)]" : color,
            isCollapsed ? "min-h-[50px]" : "min-h-[120px]"
        )}>
            {/* Header */}
            <div
                className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-2">
                    {isCollapsed ? <ChevronRight size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                    <h3 className="text-xs font-mono text-gray-600 dark:text-gray-300 uppercase tracking-widest font-bold">{title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    {isCollapsed && count > 0 && (
                        <span className="text-[10px] font-bold bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full">
                            {count} Active
                        </span>
                    )}
                    {tech && <div className="text-[10px] text-gray-500 font-mono text-right">{tech}</div>}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex-1 p-4 flex flex-wrap gap-3 justify-center items-center content-center"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ExceptionNode = ({ exception, onClick }) => {
    const getIcon = (industry) => {
        switch (industry) {
            case 'Healthcare': return <Heart size={16} />;
            case 'Finance': return <DollarSign size={16} />;
            case 'Retail': return <ShoppingBag size={16} />;
            default: return <Activity size={16} />;
        }
    };

    return (
        <motion.div
            layoutId={exception.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={(e) => {
                e.stopPropagation(); // Prevent layer collapse when clicking node
                console.log("ExceptionNode clicked:", exception.id);
                onClick && onClick(exception);
            }}
            className={clsx(
                "w-40 p-3 rounded-lg border text-xs font-mono shadow-lg relative overflow-hidden cursor-pointer hover:scale-105 transition-transform z-50",
                exception.industry === 'Healthcare' && "bg-emerald-100 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100",
                exception.industry === 'Finance' && "bg-blue-100 dark:bg-blue-900/80 border-blue-300 dark:border-blue-500 text-blue-800 dark:text-blue-100",
                exception.industry === 'Retail' && "bg-purple-100 dark:bg-purple-900/80 border-purple-300 dark:border-purple-500 text-purple-800 dark:text-purple-100",
                !exception.industry && "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            )}
        >
            <div className="flex items-center gap-2 mb-2">
                {getIcon(exception.industry)}
                <div className="font-bold truncate flex-1 text-sm">{exception.type}</div>
            </div>
            <div className="text-[11px] opacity-80 mb-2">{exception.status}</div>

            <div className="flex flex-wrap gap-1.5">
                {exception.agent && (
                    <div className="text-[10px] bg-black/5 dark:bg-black/30 rounded px-1.5 py-0.5 inline-block border border-black/5 dark:border-white/10">
                        🤖 {exception.agent}
                    </div>
                )}
                {exception.activePattern && (
                    <div className="text-[10px] bg-white/50 dark:bg-white/20 rounded px-1.5 py-0.5 inline-block font-bold border border-white/20">
                        {exception.activePattern}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const ArchitectureDiagram = React.forwardRef(({ exceptions, onNodeClick }, ref) => {
    // Group exceptions by layer for visualization
    const getExceptionsForLayer = (layerKey) => exceptions.filter(e => e.layer === LAYERS[layerKey]);

    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    const handleReset = () => setScale(1);

    // Expose zoom control to parent
    React.useImperativeHandle(ref, () => ({
        zoomTo: (level) => setScale(level),
        resetZoom: () => setScale(1)
    }));

    return (
        <div className="relative h-full flex flex-col overflow-hidden">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 shadow-xl">
                <button onClick={handleZoomIn} className="p-1.5 hover:bg-white/20 rounded text-gray-300 hover:text-white transition-colors" title="Zoom In">
                    <ZoomIn size={18} />
                </button>
                <button onClick={handleZoomOut} className="p-1.5 hover:bg-white/20 rounded text-gray-300 hover:text-white transition-colors" title="Zoom Out">
                    <ZoomOut size={18} />
                </button>
                <button onClick={handleReset} className="p-1.5 hover:bg-white/20 rounded text-gray-300 hover:text-white transition-colors" title="Reset View">
                    <Maximize size={18} />
                </button>
            </div>

            {/* Diagram Container */}
            <div className="flex-1 overflow-auto p-8" ref={containerRef}>
                <motion.div
                    className="flex flex-col gap-4 max-w-5xl mx-auto origin-top-center"
                    animate={{ scale }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >

                    {/* L-1: Pre-Dispute Radar */}
                    <Layer id="L_MINUS_1" title="L-1: Pre-Dispute Radar" tech="Predictive Engine" isActive={getExceptionsForLayer('L_MINUS_1').length > 0} color="border-amber-200 dark:border-amber-900/50">
                        <AnimatePresence>
                            {getExceptionsForLayer('L_MINUS_1').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>

                    {/* L0: Sources */}
                    <Layer id="L0" title="L0: Sources" tech="Kafka / EventBridge" isActive={getExceptionsForLayer('L0').length > 0}>
                        <AnimatePresence>
                            {getExceptionsForLayer('L0').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>

                    {/* L1: Ingestion */}
                    <Layer id="L1" title="L1: Ingestion" tech="MuleSoft / Camel" isActive={getExceptionsForLayer('L1').length > 0}>
                        <AnimatePresence>
                            {getExceptionsForLayer('L1').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>

                    {/* L1.5: Privacy */}
                    <Layer id="L1_5" title="L1.5: Data Minimization" tech="OPA + Presidio" isActive={getExceptionsForLayer('L1_5').length > 0} color="border-red-200 dark:border-red-900/50">
                        <AnimatePresence>
                            {getExceptionsForLayer('L1_5').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>

                    <div className="grid grid-cols-2 gap-4">
                        {/* L2: Orchestration */}
                        <div className="col-span-2">
                            <Layer id="L2" title="L2: Orchestration" tech="Temporal.io" isActive={getExceptionsForLayer('L2').length > 0} color="border-yellow-200 dark:border-yellow-900/50">
                                <AnimatePresence>
                                    {getExceptionsForLayer('L2').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                                </AnimatePresence>
                            </Layer>
                        </div>

                        {/* L3.a: Cognitive */}
                        <Layer id="L3A" title="L3.a: Cognitive Plane" tech="LangGraph + MCP" isActive={getExceptionsForLayer('L3A').length > 0} color="border-purple-200 dark:border-purple-900/50">
                            <AnimatePresence>
                                {getExceptionsForLayer('L3A').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                            </AnimatePresence>
                        </Layer>

                        {/* L3.b: Control */}
                        <Layer id="L3B" title="L3.b: Control Plane" tech="OPA + XState" isActive={getExceptionsForLayer('L3B').length > 0} color="border-blue-200 dark:border-blue-900/50">
                            <AnimatePresence>
                                {getExceptionsForLayer('L3B').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                            </AnimatePresence>
                        </Layer>
                    </div>

                    {/* L6: Connectivity */}
                    <Layer id="L6" title="L6: Connectivity" tech="MuleSoft / Workato" isActive={getExceptionsForLayer('L6').length > 0}>
                        <AnimatePresence>
                            {getExceptionsForLayer('L6').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>
                </motion.div>
            </div>
        </div>
    );
});
