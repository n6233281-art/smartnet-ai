import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  FileSearch, 
  ShieldAlert, 
  TrendingUp, 
  Layers, 
  Network, 
  AlertTriangle, 
  Gauge, 
  Cpu, 
  BookOpen,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { NavigationPage } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  unresolvedAlertsCount: number;
  isSimRunning: boolean;
  currentScenario: string;
  onToggleSim: () => void;
  onSelectScenario: (scenario: 'normal' | 'high' | 'congestion' | 'anomaly') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  unresolvedAlertsCount,
  isSimRunning,
  currentScenario,
  onToggleSim,
  onSelectScenario
}) => {
  const navItems: { id: NavigationPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitor', label: 'Live Traffic Monitor', icon: Activity },
    { id: 'packet-analyzer', label: 'Packet Analyzer', icon: FileSearch },
    { id: 'anomaly-detection', label: 'AI Anomaly Detection', icon: ShieldAlert },
    { id: 'congestion-prediction', label: 'Congestion Prediction', icon: TrendingUp },
    { id: 'protocol-analysis', label: 'Protocol Analysis', icon: Layers },
    { id: 'network-topology', label: 'Network Topology', icon: Network },
    { id: 'security-alerts', label: 'Security Alerts', icon: AlertTriangle, badge: unresolvedAlertsCount },
    { id: 'performance-analytics', label: 'Performance Analytics', icon: Gauge },
    { id: 'cisco-pt', label: 'Packet Tracer Lab', icon: Cpu },
    { id: 'documentation', label: 'Documentation & Viva', icon: BookOpen }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Zone */}
      <div>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>SmartNet</span>
              <span className="text-cyan-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/50">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Enterprise Network Telemetry</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="font-mono text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded-full tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Simulator Control Dock */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className={`w-2 h-2 rounded-full ${isSimRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            <span>Traffic Generator</span>
          </div>
          <button
            onClick={onToggleSim}
            className={`p-1.5 rounded-md transition-colors ${
              isSimRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
            }`}
            title={isSimRunning ? 'Pause Simulator' : 'Start Simulator'}
          >
            {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="text-[11px] text-slate-400 mb-2">Simulation Scenario</div>
        <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
          {(['normal', 'high', 'congestion', 'anomaly'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => onSelectScenario(sc)}
              className={`px-2 py-1 rounded text-center capitalize transition-colors truncate border ${
                currentScenario === sc
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
