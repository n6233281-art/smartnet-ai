import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchAnomalies, analyzePacket } from '../services/api';
import { TrafficRecord } from '../types';

export const AnomalyDetectionPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<TrafficRecord[]>([]);
  const [modelMeta, setModelMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Test Form State
  const [testForm, setTestForm] = useState({
    packetSize: 512,
    protocol: 'TCP',
    srcPort: 49152,
    dstPort: 80,
    packetRate: 45,
    flowDuration: 200,
    bytesTransferred: 2048
  });

  const [testResult, setTestResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchAnomalies().then((data) => {
      setAnomalies(data.anomalies || []);
      setModelMeta(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const res = await analyzePacket(testForm);
      setTestResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadPreset = (preset: 'normal' | 'scan' | 'flood' | 'backdoor') => {
    if (preset === 'normal') {
      setTestForm({
        packetSize: 512,
        protocol: 'TCP',
        srcPort: 49152,
        dstPort: 443,
        packetRate: 35,
        flowDuration: 220,
        bytesTransferred: 2048
      });
    } else if (preset === 'scan') {
      setTestForm({
        packetSize: 60,
        protocol: 'TCP',
        srcPort: 54120,
        dstPort: 22,
        packetRate: 450,
        flowDuration: 40,
        bytesTransferred: 600
      });
    } else if (preset === 'flood') {
      setTestForm({
        packetSize: 1024,
        protocol: 'UDP',
        srcPort: 60231,
        dstPort: 53,
        packetRate: 850,
        flowDuration: 30,
        bytesTransferred: 850000
      });
    } else {
      setTestForm({
        packetSize: 420,
        protocol: 'TCP',
        srcPort: 51000,
        dstPort: 4444,
        packetRate: 50,
        flowDuration: 120,
        bytesTransferred: 1200
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">AI Isolation Forest Anomaly Detection Engine</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Unsupervised tree-based anomaly isolation (<code className="text-cyan-300 font-mono">iForest-Network-v2</code>). Normal instances require many recursive feature partitions to isolate, while zero-day attacks and abnormal telemetry isolate rapidly near the root of the tree.
            </p>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Ensemble Trees</span>
              <span className="text-white font-bold">{modelMeta?.nTrees || 30} iTrees</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Subsample Size</span>
              <span className="text-white font-bold">{modelMeta?.subsampleSize || 80} vectors</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Threshold</span>
              <span className="text-cyan-400 font-bold">s ≥ 0.600</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance & Model Weights */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { name: 'Packet Size (Bytes)', weight: '22%', desc: '64 - 1518 B MTU Bounds' },
          { name: 'Transport Protocol', weight: '15%', desc: 'TCP (6) vs UDP (17) vs ICMP (1)' },
          { name: 'Destination Port', weight: '24%', desc: 'Well-Known vs Backdoor Ports' },
          { name: 'Packet Frequency', weight: '28%', desc: 'Packets per second (pps)' },
          { name: 'Flow Duration', weight: '11%', desc: 'Connection persistence (ms)' }
        ].map((f) => (
          <div key={f.name} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-medium">
              <span className="truncate">{f.name}</span>
              <span className="font-mono text-cyan-400 font-semibold">{f.weight}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Live Model Interactive Sandbox & Calculator */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Interactive Flow Inference Sandbox</h3>
            <p className="text-xs text-slate-400">Tune transmission characteristics to test the live ML model scoring in real time.</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400">Presets:</span>
            <button
              onClick={() => handleLoadPreset('normal')}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              Normal
            </button>
            <button
              onClick={() => handleLoadPreset('scan')}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              Port Scan
            </button>
            <button
              onClick={() => handleLoadPreset('flood')}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              UDP Flood
            </button>
            <button
              onClick={() => handleLoadPreset('backdoor')}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              Backdoor 4444
            </button>
          </div>
        </div>

        <form onSubmit={handleRunTest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Payload Size (Bytes)</label>
            <input
              type="number"
              value={testForm.packetSize}
              onChange={(e) => setTestForm({ ...testForm, packetSize: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Protocol</label>
            <select
              value={testForm.protocol}
              onChange={(e) => setTestForm({ ...testForm, protocol: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
            >
              <option value="TCP">TCP (6)</option>
              <option value="UDP">UDP (17)</option>
              <option value="ICMP">ICMP (1)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Destination Port</label>
            <input
              type="number"
              value={testForm.dstPort}
              onChange={(e) => setTestForm({ ...testForm, dstPort: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Packet Rate (pps)</label>
            <input
              type="number"
              value={testForm.packetRate}
              onChange={(e) => setTestForm({ ...testForm, packetRate: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-4">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? 'Calculating Isolation Depth...' : 'Run Isolation Forest Inference'}
            </button>
          </div>
        </form>

        {/* Inference Output Result Box */}
        {testResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  testResult.classification === 'Normal Traffic'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : (testResult.classification === 'Suspicious Traffic' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30')
                }`}>
                  {testResult.classification}
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  Score: <strong className="text-white">{testResult.anomalyScore}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Analyzed at {new Date(testResult.analyzedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="text-xs text-slate-300">
              <strong>Flagging Reason:</strong> {testResult.reason}
            </div>
          </div>
        )}
      </div>

      {/* Flagged Anomalies Log */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Detected Anomalous Network Instances ({anomalies.length})</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Filtered by Isolation Forest (score ≥ 0.60)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Source IP</th>
                <th className="px-4 py-2.5">Destination IP</th>
                <th className="px-4 py-2.5">Dst Port</th>
                <th className="px-4 py-2.5">Protocol</th>
                <th className="px-4 py-2.5">Size</th>
                <th className="px-4 py-2.5">Anomaly Score</th>
                <th className="px-4 py-2.5">Trigger Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {anomalies.length > 0 ? (
                anomalies.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2 text-slate-400">
                      {a.timestamp ? a.timestamp.split('T')[1]?.slice(0, 8) : ''}
                    </td>
                    <td className="px-4 py-2 text-rose-300 font-semibold">{a.src_ip}</td>
                    <td className="px-4 py-2 text-slate-200">{a.dst_ip}</td>
                    <td className="px-4 py-2 text-amber-300">{a.dst_port}</td>
                    <td className="px-4 py-2 text-slate-300">{a.protocol}</td>
                    <td className="px-4 py-2 text-slate-400">{a.packet_size} B</td>
                    <td className="px-4 py-2">
                      <span className="font-bold text-rose-400">{a.anomaly_score.toFixed(3)}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-400 capitalize">{a.scenario || 'Synthetic Attack'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-sans">
                    No anomalies recorded. All evaluated network frames align with nominal traffic parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
