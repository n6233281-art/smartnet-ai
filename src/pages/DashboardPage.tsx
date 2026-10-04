import React from 'react';
import { 
  Activity, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wifi, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  HeartPulse,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { DashboardMetrics, CongestionData, SecurityAlert, NavigationPage } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardPageProps {
  metrics: DashboardMetrics;
  trendData: Array<{
    timestamp: string;
    throughput: number;
    latency: number;
    packetLoss: number;
    packetRate: number;
    health: number;
  }>;
  protocolDistribution: Array<{
    protocol: string;
    count: number;
    percentage: number;
  }>;
  recentAlerts: SecurityAlert[];
  congestion: CongestionData;
  onNavigate: (page: NavigationPage) => void;
  onSelectScenario: (scenario: 'normal' | 'high' | 'congestion' | 'anomaly') => void;
  currentScenario: string;
}

const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  trendData,
  protocolDistribution,
  recentAlerts,
  congestion,
  onNavigate,
  onSelectScenario,
  currentScenario
}) => {
  return (
    <div className="space-y-6">
      {/* Scenario Banner with Quick Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Simulation Status</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300">Cisco Packet Tracer Subnet <code className="font-mono text-cyan-300">192.168.1.0/24</code></span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate laboratory traffic scenarios to test ML anomaly triggers, QoS latency spikes, and buffer congestion.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          {(['normal', 'high', 'congestion', 'anomaly'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => onSelectScenario(sc)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                currentScenario === sc
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Network Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Packets Analyzed"
          value={metrics.totalPacketsAnalyzed.toLocaleString()}
          unit="pkts"
          subtext={`${metrics.packetRate} pps current rate`}
          icon={Activity}
          accentColor="cyan"
          tooltip="Total Layer 3/4 frames processed by inspection engine"
        />

        <MetricCard
          title="Current Bandwidth"
          value={metrics.currentBandwidthMbps.toFixed(1)}
          unit="Mbps"
          subtext="FastEthernet link capacity"
          icon={Wifi}
          accentColor="blue"
          tooltip="Current aggregated throughput across Router R1 interfaces"
        />

        <MetricCard
          title="Average Latency & Loss"
          value={metrics.averageLatencyMs.toFixed(1)}
          unit="ms"
          subtext={`${metrics.packetLossPercentage.toFixed(2)}% drop rate`}
          icon={Clock}
          accentColor={metrics.averageLatencyMs > 40 ? 'rose' : 'emerald'}
          tooltip="Round trip time (RTT) calculated from TCP handshake timing"
        />

        <MetricCard
          title="Network Health Score"
          value={`${metrics.networkHealthScore}/100`}
          unit={metrics.healthStatus}
          subtext={`${metrics.totalAnomaliesDetected} anomalies detected`}
          icon={HeartPulse}
          accentColor={metrics.healthStatus === 'Healthy' ? 'emerald' : (metrics.healthStatus === 'Warning' ? 'amber' : 'rose')}
          tooltip="Calculated dynamically based on packet loss, latency, and active anomalies"
        />
      </div>

      {/* Secondary Traffic Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Inbound External Traffic</div>
            <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
              {metrics.incomingPackets.toLocaleString()} <span className="text-xs font-normal text-slate-400">pkts</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ingress via R1 Gig0/0 Gateway</div>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Outbound LAN Traffic</div>
            <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
              {metrics.outgoingPackets.toLocaleString()} <span className="text-xs font-normal text-slate-400">pkts</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Egress from 192.168.1.0/24 hosts</div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Unresolved Incidents</div>
            <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
              {metrics.unresolvedAlerts} <span className="text-xs font-normal text-slate-400">alerts</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Requires ACL / Port review</div>
          </div>
          <div className={`p-2.5 rounded-lg ${metrics.unresolvedAlerts > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bandwidth & Throughput Over Time (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Bandwidth Utilization & Telemetry Trend</h3>
              <p className="text-xs text-slate-400">Real-time throughput (Mbps) against baseline link capacity</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Throughput</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Latency</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="bandwidthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="throughput" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#bandwidthGrad)" name="Throughput (Mbps)" />
                  <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#latencyGrad)" name="Latency (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Awaiting telemetry stream...
              </div>
            )}
          </div>
        </div>

        {/* Protocol Distribution Breakdown (1 col) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Protocol Distribution</h3>
                <p className="text-xs text-slate-400">Transport & Application Layers</p>
              </div>
              <button
                onClick={() => onNavigate('protocol-analysis')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Inspect
              </button>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocolDistribution}
                    dataKey="count"
                    nameKey="protocol"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {protocolDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2 border-t border-slate-800 pt-3">
            {protocolDistribution.slice(0, 4).map((p, idx) => (
              <div key={p.protocol} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300 font-medium">{p.protocol}</span>
                </div>
                <div className="text-slate-400 font-mono tabular-nums">
                  {p.count} pkts <span className="text-slate-500">({p.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Congestion Risk Forecast & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Congestion Forecast Quick Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">AI Congestion Prediction</h3>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                congestion.status === 'Healthy' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : (congestion.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30')
              }`}>
                {congestion.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {congestion.recommendedAction}
            </p>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Congestion Risk</span>
                <div className="text-base font-bold text-white mt-0.5 tabular-nums">{congestion.riskScore}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Forecast Bandwidth</span>
                <div className="text-base font-bold text-cyan-400 mt-0.5 tabular-nums">{congestion.predictedBandwidthMbps} Mbps</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Buffer Pressure</span>
                <div className="text-base font-bold text-blue-400 mt-0.5 tabular-nums">{congestion.bufferQueuePressurePct}%</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Least-squares regression (15-min projection)</span>
            <button
              onClick={() => onNavigate('congestion-prediction')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Detailed Forecast →
            </button>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">Recent Security & Anomaly Alerts</h3>
              </div>
              <button
                onClick={() => onNavigate('security-alerts')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {recentAlerts.length > 0 ? (
                recentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] uppercase font-semibold ${
                          alert.severity === 'critical' ? 'text-rose-400' : (alert.severity === 'high' ? 'text-amber-400' : 'text-blue-400')
                        }`}>
                          [{alert.severity}]
                        </span>
                        <span className="text-slate-200 font-medium">{alert.category}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-1">{alert.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                        {alert.timestamp ? alert.timestamp.split('T')[1]?.slice(0, 8) : ''}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  No active security alerts. Network is operating within nominal baselines.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Cisco Packet Tracer Access Control Rules Active</span>
            <button
              onClick={() => onNavigate('cisco-pt')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Topology Guide →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
