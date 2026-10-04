import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  HelpCircle, 
  Activity, 
  Wifi, 
  Clock, 
  Layers, 
  TrendingUp, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { fetchDashboardData } from '../services/api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const PerformanceAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>('bandwidth');

  useEffect(() => {
    fetchDashboardData().then(setData).catch(console.error);
    const interval = setInterval(() => {
      fetchDashboardData().then(setData).catch(console.error);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = data?.metrics || {
    currentBandwidthMbps: 14.8,
    averageLatencyMs: 8.5,
    packetLossPercentage: 0.1,
    packetRate: 42,
    networkHealthScore: 96,
    incomingPackets: 450,
    outgoingPackets: 620
  };

  const trends = data?.trendData || [];

  const CONCEPTS = {
    bandwidth: {
      title: 'Bandwidth vs. Throughput',
      unit: 'Mbps (Megabits per second)',
      definition: 'Bandwidth is the maximum theoretical data transmission capacity of a network link (e.g. 100 Mbps FastEthernet). Throughput is the actual rate of successful data delivery over the channel per unit of time, throttled by protocol overhead, congestion, and propagation delays.'
    },
    latency: {
      title: 'Latency & Jitter (Round-Trip Time)',
      unit: 'Milliseconds (ms)',
      definition: 'Latency represents the time taken for a data packet to travel from source to destination and return (RTT). It comprises nodal processing delay, queuing delay at switch buffers, transmission delay, and physical propagation delay across copper or optical cables.'
    },
    packetloss: {
      title: 'Packet Loss & Bit Errors',
      unit: 'Percentage (%)',
      definition: 'Occurs when one or more packets traversing a computer network fail to reach their destination. Predominantly caused by buffer exhaustion during network congestion, link layer FCS crc errors, or router drop policies (e.g. Tail Drop or RED).'
    },
    tcp_flow: {
      title: 'TCP Sliding Window & Congestion Control',
      unit: 'Segments / RFC 5681',
      definition: 'TCP ensures reliability via positive acknowledgments (ACKs) and adapts transmission rate using additive-increase multiplicative-decrease (AIMD), slow start thresholds (ssthresh), and fast retransmit algorithms upon detecting duplicate ACKs.'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            Quality of Service (QoS) & Network Performance Telemetry
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          In-depth telemetry analytics for Computer Networks laboratory evaluation: bandwidth capacity, latency distributions, packet loss margins, and transport efficiency.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedConcept('bandwidth')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Throughput Rate</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {metrics.currentBandwidthMbps.toFixed(1)} <span className="text-xs font-normal text-slate-400">Mbps</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Capacity Headroom: {(100 - metrics.currentBandwidthMbps).toFixed(1)} Mbps
          </div>
        </div>

        <div 
          onClick={() => setSelectedConcept('latency')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Latency</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {metrics.averageLatencyMs.toFixed(1)} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Jitter Variance: ±{(metrics.averageLatencyMs * 0.15).toFixed(1)} ms
          </div>
        </div>

        <div 
          onClick={() => setSelectedConcept('packetloss')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Packet Loss Ratio</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {metrics.packetLossPercentage.toFixed(2)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            QoS Grade: {metrics.packetLossPercentage < 1.0 ? 'Tier-1 Optimal' : 'Degraded Buffer'}
          </div>
        </div>

        <div 
          onClick={() => setSelectedConcept('tcp_flow')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Network Availability</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            99.94%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Gateway Uptime: 99.98%
          </div>
        </div>
      </div>

      {/* Concept Tooltip Card */}
      {selectedConcept && (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-1">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <Info className="w-4 h-4" />
            <span>Computer Networks Concept: {CONCEPTS[selectedConcept as keyof typeof CONCEPTS]?.title}</span>
            <span className="text-slate-400 font-mono text-[11px]">({CONCEPTS[selectedConcept as keyof typeof CONCEPTS]?.unit})</span>
          </div>
          <p className="text-slate-300 leading-relaxed pl-6">
            {CONCEPTS[selectedConcept as keyof typeof CONCEPTS]?.definition}
          </p>
        </div>
      )}

      {/* Latency vs. Throughput Correlation Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-1">Latency vs. Bandwidth Throughput Correlation</h3>
        <p className="text-xs text-slate-400 mb-4">Validating queuing delay increase under heavy FastEthernet traffic</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="throughput" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Throughput (Mbps)" />
              <Area type="monotone" dataKey="latency" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Latency (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
