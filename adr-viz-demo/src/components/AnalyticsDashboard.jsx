import React, { useMemo } from 'react';
import { calculateStats } from '../lib/simulation';
import { DollarSign, Clock, Zap, Shield, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm flex items-start justify-between"
    >
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
            {subtext && <p className={`text-xs font-bold mt-2 ${color}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
            <Icon size={24} className={color} />
        </div>
    </motion.div>
);

export const AnalyticsDashboard = ({ exceptions }) => {
    const stats = useMemo(() => calculateStats(exceptions), [exceptions]);

    return (
        <div className="h-full w-full p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="text-cyan-500" />
                    Business Impact Dashboard
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time value realization from the Autonomous Dispute Resolution system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Est. Cost Savings"
                    value={`$${stats.costSavings.toLocaleString()}`}
                    subtext="+12% vs Last Month"
                    icon={DollarSign}
                    color="text-emerald-500"
                    delay={0.1}
                />
                <StatCard
                    title="Hours Saved"
                    value={stats.timeSavedHours.toLocaleString()}
                    subtext={`${(stats.timeSavedHours * 60).toFixed(0)} mins total`}
                    icon={Clock}
                    color="text-blue-500"
                    delay={0.2}
                />
                <StatCard
                    title="Automation Rate"
                    value={`${stats.automationRate}%`}
                    subtext={`${stats.resolvedCount} Cases Closed`}
                    icon={Zap}
                    color="text-purple-500"
                    delay={0.3}
                />
                <StatCard
                    title="Risk Avoided"
                    value={stats.avoidedCount}
                    subtext="L-1 Signals Mitigated"
                    icon={Shield}
                    color="text-orange-500"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Efficiency Trend</h3>
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded text-gray-500">24h</span>
                            <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded font-bold">Live</span>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {/* Mock Chart Bars - In a real app, use Recharts or similar */}
                        {[...Array(20)].map((_, i) => {
                            const height = 30 + Math.random() * 60;
                            return (
                                <div key={i} className="w-full bg-gray-100 dark:bg-neutral-800 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 w-full bg-cyan-500/50 hover:bg-cyan-500 transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-mono">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>Now</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">System Health</h3>
                        <p className="text-indigo-200 text-sm mb-6">All systems operational.</p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                    <span>API Latency</span>
                                    <span>45ms</span>
                                </div>
                                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-1/4"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                    <span>Model Confidence</span>
                                    <span>94%</span>
                                </div>
                                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[94%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                    <span>Error Rate</span>
                                    <span>0.01%</span>
                                </div>
                                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[1%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-200">Proj. Annual Savings</p>
                                    <p className="font-bold text-xl">$1.2M</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
