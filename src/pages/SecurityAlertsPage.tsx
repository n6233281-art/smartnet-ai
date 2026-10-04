import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  AlertOctagon, 
  ShieldAlert, 
  ExternalLink,
  X
} from 'lucide-react';
import { fetchAlerts, resolveAlert, requestAIDiagnosis } from '../services/api';
import { SecurityAlert } from '../types';

export const SecurityAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // AI Diagnostics Modal
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts(
        selectedSeverity !== 'all' ? selectedSeverity : undefined,
        selectedStatus !== 'all' ? selectedStatus : undefined
      );
      setAlerts(data.alerts || []);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [selectedSeverity, selectedStatus]);

  const handleResolve = async (id: number) => {
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAIDiagnosis = async (alert: SecurityAlert) => {
    setIsGeneratingAI(true);
    setAiReport(null);
    try {
      const res = await requestAIDiagnosis(
        { bandwidth: 78, latency: 45, packetLoss: 1.8 },
        alert
      );
      setAiReport(res);
    } catch (err: any) {
      setAiReport({ diagnosis: 'Heuristic review: Check router access lists and switch port security.' });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Security Incident & Anomaly Triage Center
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Lab-safe detection of volumetric spikes, sequential port scanning, suspicious sockets, and anomalous host behaviors flagged by the Isolation Forest engine.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Total Unresolved:</span>
            <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold tabular-nums">
              {alerts.filter(a => a.status === 'unresolved').length} Alerts
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Severity:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono">
            {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Status:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono">
            {['all', 'unresolved', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  selectedStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';
            const isResolved = alert.status === 'resolved';

            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved 
                    ? 'bg-slate-950/50 border-slate-800 opacity-60' 
                    : (isCritical 
                        ? 'bg-rose-950/10 border-rose-500/30' 
                        : (isHigh ? 'bg-amber-950/10 border-amber-500/30' : 'bg-slate-900/60 border-slate-800'))
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                      isCritical ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      (isHigh ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30')
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm font-semibold text-white tracking-tight">{alert.category}</span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="font-mono text-xs text-slate-400">
                      {alert.src_ip} → {alert.dst_ip}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      {alert.timestamp ? alert.timestamp.replace('T', ' ').slice(0, 19) : ''}
                    </span>
                    {!isResolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-medium transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    {isResolved && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
                  {alert.reason}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Recommended Action:</strong> {alert.recommended_action}
                  </div>
                  <button
                    onClick={() => handleRunAIDiagnosis(alert)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium shrink-0 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Diagnosis</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
            {isLoading ? 'Querying alert repository...' : 'No security incidents found for the selected filter.'}
          </div>
        )}
      </div>

      {/* AI Diagnosis Modal */}
      {aiReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">AI Network Security Specialist Diagnosis</h3>
              </div>
              <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 whitespace-pre-wrap font-sans">
                {aiReport.diagnosis}
              </div>

              {aiReport.recommendedActions && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Immediate Remediation Checklist:</div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-mono text-[11px]">
                    {aiReport.recommendedActions.map((act: string, i: number) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setAiReport(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close Diagnosis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
