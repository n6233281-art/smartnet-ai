import React from 'react';
import { RefreshCw, Download, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { NavigationPage } from '../types';

interface TopBarProps {
  currentPage: NavigationPage;
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
  healthScore: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenQuickGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  healthStatus,
  healthScore,
  onRefresh,
  isRefreshing,
  onOpenQuickGuide
}) => {
  const getPageTitle = (page: NavigationPage) => {
    switch (page) {
      case 'dashboard': return 'Operational Dashboard';
      case 'live-monitor': return 'Real-Time Telemetry & Socket Monitor';
      case 'packet-analyzer': return 'Deep Packet Inspection & File Parser';
      case 'anomaly-detection': return 'AI Isolation Forest Anomaly Engine';
      case 'congestion-prediction': return 'Predictive Congestion Forecaster';
      case 'protocol-analysis': return 'Layer 4 / Layer 7 Protocol Breakdown';
      case 'network-topology': return 'Cisco Packet Tracer LAN Topology';
      case 'security-alerts': return 'Incident Triage & Mitigation Center';
      case 'performance-analytics': return 'Computer Networks QoS Performance';
      case 'cisco-pt': return 'Cisco Packet Tracer Setup & IOS Configs';
      case 'documentation': return 'College Project Report & Viva Voce Guide';
      default: return 'SmartNet System';
    }
  };

  const getHealthBadge = () => {
    if (healthStatus === 'Healthy') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-medium">Network Healthy</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono tabular-nums">{healthScore}/100</span>
        </div>
      );
    }
    if (healthStatus === 'Warning') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">Network Warning</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono tabular-nums">{healthScore}/100</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs text-rose-400">
        <AlertOctagon className="w-3.5 h-3.5" />
        <span className="font-medium">Critical State</span>
        <span className="text-slate-500">·</span>
        <span className="font-mono tabular-nums">{healthScore}/100</span>
      </div>
    );
  };

  const handleDownloadDataset = () => {
    window.open('/datasets/sample_traffic.csv', '_blank');
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Zone 1: Contextual Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">SmartNet</span>
        <span className="text-slate-600">/</span>
        <h1 className="text-sm font-semibold text-slate-100 tracking-tight whitespace-nowrap">
          {getPageTitle(currentPage)}
        </h1>
      </div>

      {/* Zone 2 & 3: Telemetry Health & Action Controls */}
      <div className="flex items-center gap-4">
        {/* Health status unboxed metadata */}
        <div className="hidden sm:block">
          {getHealthBadge()}
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* Quick Sample Dataset link */}
        <button
          onClick={handleDownloadDataset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors whitespace-nowrap"
          title="Download Sample Packet Dataset (.CSV)"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Sample CSV</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Quick Viva / Help button */}
        <button
          onClick={onOpenQuickGuide}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          title="Evaluation Guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
