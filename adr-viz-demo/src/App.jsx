import React, { useState, useEffect } from 'react';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { SealedManifest } from './components/SealedManifest';
import { ManualReviewQueue } from './components/ManualReviewQueue';
import { ExceptionDetailModal } from './components/ExceptionDetailModal';
import { PolicyControlPanel } from './components/PolicyControlPanel';
import TimelineView from './components/TimelineView';
import { ClusterMapView } from './components/ClusterMapView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { generateException, generateSignal, advanceException, rollbackException, INDUSTRIES, STATES, LAYERS, PATTERNS } from './lib/simulation';
import { THEMES, applyTheme } from './lib/themes';
import { Play, Pause, Plus, Sun, Moon, ShieldAlert, LayoutGrid, Calendar, PieChart, BarChart, Palette } from 'lucide-react';

function App() {
  const [exceptions, setExceptions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  const [selectedException, setSelectedException] = useState(null);
  const [viewMode, setViewMode] = useState('spatial'); // 'spatial' | 'temporal' | 'cluster' | 'dashboard'
  const [policyConfig, setPolicyConfig] = useState({ approvalThreshold: 10000 });
  const [currentTheme, setCurrentTheme] = useState(THEMES.DEFAULT);

  // Apply theme side-effect
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Toggle Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setExceptions(prev => {
        // 1. Advance existing exceptions
        let next = prev.map(e => {
          // 30% chance to advance in each tick
          if (Math.random() > 0.7 && e.status !== STATES.COMPLETED && e.status !== STATES.MANUAL_HOLD) {
            return advanceException(e, killSwitch, policyConfig);
          }
          return e;
        });

        // 2. Remove completed ones after a while
        next = next.filter(e => !(e.status === STATES.COMPLETED && Math.random() > 0.9));

        // 3. Randomly generate Pre-Dispute Signals (L-1)
        if (Math.random() > 0.85) { // 15% chance per tick
          const industries = Object.values(INDUSTRIES);
          const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
          next.push(generateSignal(randomIndustry));
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, killSwitch, policyConfig]);

  const addException = (industry, priority = null) => {
    setExceptions(prev => [...prev, generateException(industry, priority)]);
  };

  const handleApprove = (id) => {
    setExceptions(prev => prev.map(e => {
      if (e.id === id) {
        // Move to ACT phase
        const next = { ...e };
        next.status = STATES.ACT;
        next.layer = LAYERS.L6;
        next.data.decision = "APPROVED (MANUAL)";

        if (!next.logs) next.logs = [];
        next.logs.push({
          timestamp: new Date().toISOString(),
          message: "Manual Approval by Human Operator.",
          type: 'success',
          agent: "Human Operator",
          pattern: PATTERNS.P7
        });
        return next;
      }
      return e;
    }));
  };

  const handleReject = (id) => {
    setExceptions(prev => prev.map(e => {
      if (e.id === id) {
        // Move to COMPLETED (Rejected)
        const next = { ...e };
        next.status = STATES.COMPLETED;
        next.layer = LAYERS.L0;
        next.data.decision = "REJECTED (MANUAL)";

        if (!next.logs) next.logs = [];
        next.logs.push({
          timestamp: new Date().toISOString(),
          message: "Manual Rejection by Human Operator.",
          type: 'error',
          agent: "Human Operator",
          pattern: PATTERNS.P7
        });
        return next;
      }
      return e;
    }));
  };

  const handleRollback = (id, stepIndex) => {
    setExceptions(prev => prev.map(e => {
      if (e.id === id) {
        const rolledBack = rollbackException(e, stepIndex);
        // Also update selectedException if it's the one being rolled back
        if (selectedException && selectedException.id === id) {
          setSelectedException(rolledBack);
        }
        return rolledBack;
      }
      return e;
    }));
  };

  const handleNodeClick = (exception) => {
    setSelectedException(exception);
  };

  // Helper to get dynamic classes based on theme
  const getThemeClasses = () => {
    const t = currentTheme.colors;
    // Map abstract color names to specific Tailwind shades for the main background
    const bgMap = {
      gray: 'bg-gray-50 dark:bg-neutral-950',
      slate: 'bg-slate-50 dark:bg-slate-950',
      stone: 'bg-stone-50 dark:bg-stone-950',
      neutral: 'bg-neutral-50 dark:bg-neutral-950'
    };
    return bgMap[t.bg] || bgMap.gray;
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} text-gray-900 dark:text-white p-4 lg:p-8 transition-colors duration-300 ${currentTheme.font} ${currentTheme.radius || 'rounded-lg'}`}>
      <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div className="flex items-center gap-6 lg:gap-8 w-full xl:w-auto">
          <img src="/logo.svg" alt="ADR Platform Logo" className="h-10 lg:h-12 w-auto object-contain shrink-0 mr-4" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight truncate">Autonomous Dispute Resolution</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-gray-500 dark:text-neutral-400 text-xs font-mono tracking-wide truncate">SYSTEM ONLINE • v3.3.1</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between w-full xl:w-auto">
          {/* Policy Tuner */}
          <PolicyControlPanel config={policyConfig} onConfigChange={setPolicyConfig} />

          <div className="h-12 w-px bg-gray-300 dark:bg-neutral-800 mx-2 hidden xl:block"></div>

          <div className="flex gap-4 items-center flex-wrap">
            {/* View Switcher */}
            <div className="flex bg-gray-200 dark:bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('spatial')}
                className={`p-2 rounded-md transition-all ${viewMode === 'spatial' ? 'bg-white dark:bg-neutral-700 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}
                title="Spatial View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('temporal')}
                className={`p-2 rounded-md transition-all ${viewMode === 'temporal' ? 'bg-white dark:bg-neutral-700 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}
                title="Temporal View"
              >
                <Calendar size={18} />
              </button>
              <button
                onClick={() => setViewMode('cluster')}
                className={`p-2 rounded-md transition-all ${viewMode === 'cluster' ? 'bg-white dark:bg-neutral-700 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}
                title="Analytics View"
              >
                <PieChart size={18} />
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`p-2 rounded-md transition-all ${viewMode === 'dashboard' ? 'bg-white dark:bg-neutral-700 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}
                title="Analytics Dashboard"
              >
                <BarChart size={18} />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-neutral-800 mx-2 hidden sm:block"></div>

            <div className="flex gap-2 items-center">
              {/* Add Exception Buttons */}
              <button onClick={() => addException(INDUSTRIES.HEALTHCARE)} className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50 hidden lg:block">+ Healthcare</button>
              <button onClick={() => addException(INDUSTRIES.FINANCE)} className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 hidden lg:block">+ Finance</button>
              <button onClick={() => addException(INDUSTRIES.RETAIL)} className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 hidden lg:block">+ Retail</button>
              <button onClick={() => addException(INDUSTRIES.FINANCE, 'HIGH')} className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-xs font-medium transition-all hidden xl:flex">
                <ShieldAlert size={14} /> High Priority
              </button>

              <div className="h-8 w-px bg-gray-300 dark:bg-neutral-800 mx-2 hidden lg:block"></div>

              {/* Theme Selector */}
              <div className="relative group">
                <button className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors" title="Select Skin">
                  <Palette size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-800 overflow-hidden z-50 hidden group-hover:block">
                  {Object.values(THEMES).map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setCurrentTheme(theme)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-2 ${currentTheme.id === theme.id ? 'font-bold text-cyan-600' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-${theme.colors.primary}-500`}></div>
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setKillSwitch(!killSwitch)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${killSwitch ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-gray-200 dark:bg-neutral-800 border-transparent hover:bg-gray-300 dark:hover:bg-neutral-700'}`}
                title="Global Kill Switch"
              >
                <ShieldAlert size={16} />
                <span className="text-xs font-bold hidden sm:inline">{killSwitch ? 'KILL SWITCH ACTIVE' : 'SAFE MODE'}</span>
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg border border-gray-300 dark:border-neutral-700 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
        <div className="lg:col-span-2 h-full flex flex-col min-h-0">
          {viewMode === 'spatial' && (
            <ArchitectureDiagram exceptions={exceptions} onNodeClick={handleNodeClick} />
          )}
          {viewMode === 'temporal' && (
            <TimelineView exceptions={exceptions} onExceptionClick={handleNodeClick} />
          )}
          {viewMode === 'cluster' && (
            <ClusterMapView exceptions={exceptions} onExceptionClick={handleNodeClick} />
          )}
          {viewMode === 'dashboard' && (
            <AnalyticsDashboard exceptions={exceptions} />
          )}
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto min-h-0">
          <SealedManifest exceptions={exceptions} />
          <ManualReviewQueue exceptions={exceptions} onApprove={handleApprove} onReject={handleReject} />
        </div>
      </main>

      {selectedException && (
        <ExceptionDetailModal
          exception={selectedException}
          onClose={() => setSelectedException(null)}
          onRollback={handleRollback}
        />
      )}
    </div>
  );
}

export default App;
