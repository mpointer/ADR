import React from 'react';
import { Settings, ShieldCheck, AlertTriangle } from 'lucide-react';

export const PolicyControlPanel = ({ config, onConfigChange }) => {
    const handleChange = (e) => {
        onConfigChange({
            ...config,
            approvalThreshold: parseInt(e.target.value, 10)
        });
    };

    const getRiskLevel = (val) => {
        if (val < 5000) return { label: 'CONSERVATIVE', color: 'text-emerald-500' };
        if (val < 20000) return { label: 'BALANCED', color: 'text-blue-500' };
        return { label: 'AGGRESSIVE', color: 'text-orange-500' };
    };

    const risk = getRiskLevel(config.approvalThreshold);

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-100 dark:border-neutral-800 pb-2">
                <Settings size={16} className="text-gray-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Policy Tuner (L3.b)</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-500 font-medium">Auto-Approval Threshold</label>
                        <div className="text-right">
                            <div className="font-mono font-bold text-lg text-cyan-600 dark:text-cyan-400">
                                ${config.approvalThreshold.toLocaleString()}
                            </div>
                            <div className={`text-[10px] font-bold ${risk.color}`}>
                                {risk.label} RISK
                            </div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={config.approvalThreshold}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700 accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                        <span>$0</span>
                        <span>$25k</span>
                        <span>$50k</span>
                    </div>
                </div>

                <div className="text-[10px] text-gray-500 bg-gray-50 dark:bg-neutral-800 p-2 rounded border border-gray-100 dark:border-neutral-700 flex gap-2 items-start">
                    <ShieldCheck size={14} className="mt-0.5 text-gray-400" />
                    <p>
                        Exceptions below this amount are automatically approved by the <strong>Policy Enforcer</strong> agent.
                        Higher values increase automation but raise risk.
                    </p>
                </div>
            </div>
        </div>
    );
};
