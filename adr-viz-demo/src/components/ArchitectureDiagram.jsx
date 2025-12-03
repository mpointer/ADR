import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LAYERS, STATES } from '../lib/simulation';
import clsx from 'clsx';
import { Activity, Database, Server, Shield, Brain, Cpu, Network, FileText, Heart, DollarSign, ShoppingBag } from 'lucide-react';

const Layer = ({ id, title, children, isActive, color = "border-gray-200 dark:border-gray-700" }) => {
    return (
        <div className={clsx(
            "relative p-4 border-2 rounded-lg transition-all duration-500",
            "bg-white/50 dark:bg-black/40 backdrop-blur-md",
            isActive ? "border-cyan-500 dark:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.3)]" : color,
            "min-h-[100px] flex flex-col justify-center"
        )}>
            <h3 className="absolute top-2 left-3 text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</h3>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {children}
            </div>
        </div>
    );
};

const ExceptionNode = ({ exception, onClick }) => {
    const getIcon = (industry) => {
        switch (industry) {
            case 'Healthcare': return <Heart size={14} />;
            case 'Finance': return <DollarSign size={14} />;
            case 'Retail': return <ShoppingBag size={14} />;
            default: return <Activity size={14} />;
        }
    };

    return (
        <motion.div
            layoutId={exception.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
                console.log("ExceptionNode clicked:", exception.id);
                onClick && onClick(exception);
            }}
            className={clsx(
                "w-32 p-2 rounded border text-xs font-mono shadow-lg relative overflow-hidden cursor-pointer hover:scale-105 transition-transform z-50",
                exception.industry === 'Healthcare' && "bg-emerald-100 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100",
                exception.industry === 'Finance' && "bg-blue-100 dark:bg-blue-900/80 border-blue-300 dark:border-blue-500 text-blue-800 dark:text-blue-100",
                exception.industry === 'Retail' && "bg-purple-100 dark:bg-purple-900/80 border-purple-300 dark:border-purple-500 text-purple-800 dark:text-purple-100",
                !exception.industry && "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            )}
        >
            <div className="flex items-center gap-2 mb-1">
                {getIcon(exception.industry)}
                <div className="font-bold truncate flex-1">{exception.type}</div>
            </div>
            <div className="text-[10px] opacity-70">{exception.status}</div>

            <div className="flex flex-wrap gap-1 mt-1">
                {exception.agent && (
                    <div className="text-[9px] bg-black/5 dark:bg-black/30 rounded px-1 py-0.5 inline-block border border-black/5 dark:border-white/10">
                        🤖 {exception.agent}
                    </div>
                )}
                {exception.activePattern && (
                    <div className="text-[9px] bg-white/50 dark:bg-white/20 rounded px-1 py-0.5 inline-block font-bold border border-white/20">
                        {exception.activePattern}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const ArchitectureDiagram = ({ exceptions, onNodeClick }) => {
    // Group exceptions by layer for visualization
    const getExceptionsForLayer = (layerKey) => exceptions.filter(e => e.layer === LAYERS[layerKey]);

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto p-8 font-sans">

            {/* L0: Sources */}
            <Layer id="L0" title="L0: Sources (ERPs, Email, APIs)" isActive={getExceptionsForLayer('L0').length > 0}>
                <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono">Kafka / EventBridge</div>
                <AnimatePresence>
                    {getExceptionsForLayer('L0').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                </AnimatePresence>
            </Layer>

            {/* L1: Ingestion */}
            <Layer id="L1" title="L1: Ingestion & Normalization" isActive={getExceptionsForLayer('L1').length > 0}>
                <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono">MuleSoft / Camel</div>
                <AnimatePresence>
                    {getExceptionsForLayer('L1').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                </AnimatePresence>
            </Layer>

            {/* L1.5: Privacy */}
            <Layer id="L1_5" title="L1.5: Data Minimization (Redaction)" isActive={getExceptionsForLayer('L1_5').length > 0} color="border-red-200 dark:border-red-900/50">
                <div className="absolute top-2 right-2 text-[10px] text-red-400 font-mono">OPA + Presidio</div>
                <AnimatePresence>
                    {getExceptionsForLayer('L1_5').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                </AnimatePresence>
            </Layer>

            <div className="grid grid-cols-2 gap-4">
                {/* L2: Orchestration */}
                <div className="col-span-2">
                    <Layer id="L2" title="L2: Orchestration (Traffic Controller)" isActive={getExceptionsForLayer('L2').length > 0} color="border-yellow-200 dark:border-yellow-900/50">
                        <div className="absolute top-2 right-2 text-[10px] text-yellow-500 font-mono">Temporal.io</div>
                        <AnimatePresence>
                            {getExceptionsForLayer('L2').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                        </AnimatePresence>
                    </Layer>
                </div>

                {/* L3.a: Cognitive */}
                <Layer id="L3A" title="L3.a: Cognitive Plane (Reasoning)" isActive={getExceptionsForLayer('L3A').length > 0} color="border-purple-200 dark:border-purple-900/50">
                    <div className="absolute top-2 right-2 text-[10px] text-purple-400 font-mono">LangGraph + MCP</div>
                    <AnimatePresence>
                        {getExceptionsForLayer('L3A').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                    </AnimatePresence>
                </Layer>

                {/* L3.b: Control */}
                <Layer id="L3B" title="L3.b: Control Plane (Gatekeeper)" isActive={getExceptionsForLayer('L3B').length > 0} color="border-blue-200 dark:border-blue-900/50">
                    <div className="absolute top-2 right-2 text-[10px] text-blue-400 font-mono">OPA + XState</div>
                    <AnimatePresence>
                        {getExceptionsForLayer('L3B').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                    </AnimatePresence>
                </Layer>
            </div>

            {/* L6: Connectivity */}
            <Layer id="L6" title="L6: Connectivity (Write Back)" isActive={getExceptionsForLayer('L6').length > 0}>
                <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono">MuleSoft / Workato</div>
                <AnimatePresence>
                    {getExceptionsForLayer('L6').map(e => <ExceptionNode key={e.id} exception={e} onClick={onNodeClick} />)}
                </AnimatePresence>
            </Layer>
        </div>
    );
};
