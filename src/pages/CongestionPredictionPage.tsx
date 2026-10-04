import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { fetchCongestionPrediction, fetchDashboardData } from '../services/api';
import { CongestionData } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const CongestionPredictionPage: React.FC = () => {
  const [congestion, setCongestion] = useState<CongestionData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const cong = await fetchCongestionPrediction();
      setCongestion(cong);

      const dash = await fetchDashboardData();
      const rawTrends = dash.trendData || [];

      // Create projection points
      const projection = [];
      const lastPoint = rawTrends[rawTrends.length - 1] || { throughput: 16, timestamp: 'Now' };
      const slope = cong.slope || 0.2;

      for (let i = 1; i <= 6; i++) {
        projection.push({
          timestamp: `+${i * 2.5}m`,
          throughput: null,
          projectedThroughput: parseFloat(Math.max(5, (lastPoint.throughput || 16) + slope * (i * 2.5)).toFixed(1)),
          threshold: 80
        });
      }

      setHistoricalData([
        ...rawTrends.map((t: any) => ({ ...t, projectedThroughput: null, threshold: 80 })),
        ...projection
      ]);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !congestion) {
    return <div className="p-8 text-center text-xs text-slate-500">Evaluating buffer queues and historical trend models...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Forecasting Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Predictive Network Congestion & Queue Saturation Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Analyzes moving-window channel throughput gradients and Kleinrock M/M/1 queuing curves to anticipate FastEthernet / Gigabit link saturation before frame drops occur.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Status</span>
              <span className={`text-xs font-bold font-mono ${
                congestion.status === 'Healthy' ? 'text-emerald-400' : (congestion.status === 'Warning' ? 'text-amber-400' : 'text-rose-400')
              }`}>
                {congestion.status}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Risk Index</span>
              <span className="text-sm font-bold font-mono text-white tabular-nums">{congestion.riskScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Current Channel Utilization</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {congestion.currentUtilizationPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">100 Mbps FastEthernet Link Cap</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Forecast 15-Min Bandwidth</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {congestion.predictedBandwidthMbps} <span className="text-xs font-normal text-slate-400">Mbps</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Linear trend projection</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Buffer Queue Pressure</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
            {congestion.bufferQueuePressurePct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Switch output queue occupancy</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Traffic Growth Vector</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums capitalize">
            {congestion.trend}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Slope: {congestion.slope} Mbps/step</div>
        </div>
      </div>

      {/* Predictive Traffic Curve Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Historical Telemetry vs. Predictive Congestion Curve</h3>
            <p className="text-xs text-slate-400">Observed traffic paired with regression trajectory forward in time</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Observed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Projected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-amber-400" />
              80% Warning Limit
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="throughput" stroke="#06b6d4" strokeWidth={2} dot={false} name="Actual Bandwidth (Mbps)" />
              <Line type="monotone" dataKey="projectedThroughput" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={true} name="Predicted Bandwidth (Mbps)" />
              <Line type="monotone" dataKey="threshold" stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" dot={false} name="QoS Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Action & Queuing Theory Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Automated Recommendation Engine</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            {congestion.recommendedAction}
          </p>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Recommended Cisco IOS command: <code className="font-mono text-cyan-300">random-detect</code> on interface GigabitEthernet0/0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>TCP Window Scaling (RFC 7323) should be engaged on server SRV1</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Computer Networks Theory: Kleinrock M/M/1 Queue</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            In packet switching networks, as channel utilization <span className="font-mono text-cyan-300">ρ = λ / μ</span> approaches 1.0 (100%), average queuing delay explodes asymptotically according to the formula:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-center text-cyan-300">
            Delay T = 1 / (μ - λ) = 1 / (μ · (1 - ρ))
          </div>
          <p className="text-slate-400">
            SmartNet AI continuously estimates the parameter <span className="font-mono text-white">ρ</span> to alert network engineers well before the exponential delay knee is reached.
          </p>
        </div>
      </div>
    </div>
  );
};
