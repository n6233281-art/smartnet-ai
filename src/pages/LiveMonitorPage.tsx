import React, { useState, useEffect } from 'react';
import { Activity, ArrowDownLeft, ArrowUpRight, ShieldCheck, AlertCircle, Play, Pause, RefreshCw, Filter } from 'lucide-react';
import { fetchTrafficRecords } from '../services/api';
import { TrafficRecord } from '../types';
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

export const LiveMonitorPage: React.FC = () => {
  const [records, setRecords] = useState<TrafficRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState('ALL');

  const loadData = async () => {
    try {
      const data = await fetchTrafficRecords({ limit: 40, protocol: selectedProtocol });
      setRecords(data.records || []);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 1500);
    return () => clearInterval(interval);
  }, [isAutoRefresh, selectedProtocol]);

  // Aggregate recent chart data
  const chartData = records.slice(0, 20).reverse().map((r) => ({
    time: r.timestamp ? r.timestamp.split('T')[1]?.slice(0, 8) : '',
    bandwidth: r.bandwidth_mbps,
    latency: r.latency,
    packetSize: r.packet_size
  }));

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Real-Time Traffic & Socket Telemetry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming live frames traversing the Cisco Gateway Router R1 and Catalyst Switches SW1/SW2.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Protocol Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {['ALL', 'TCP', 'UDP', 'ICMP'].map((proto) => (
              <button
                key={proto}
                onClick={() => setSelectedProtocol(proto)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedProtocol === proto
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          {/* Pause / Resume Live Polling */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isAutoRefresh
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isAutoRefresh ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Charts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Live Bandwidth Stream (Mbps)</h3>
              <p className="text-xs text-slate-400">High-frequency throughput sampling</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Ingress
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="liveBandwidth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="bandwidth" stroke="#06b6d4" strokeWidth={2} fill="url(#liveBandwidth)" name="Bandwidth (Mbps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Round Trip Latency (ms)</h3>
              <p className="text-xs text-slate-400">Microsecond network hop responsiveness</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              RTT Delay
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Socket & Frame Stream Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Live Packet Stream ({records.length} recent frames)</h3>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Auto-polling {isAutoRefresh ? 'Active (1.5s)' : 'Paused'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Source IP : Port</th>
                <th className="px-4 py-2.5">Destination IP : Port</th>
                <th className="px-4 py-2.5">Protocol</th>
                <th className="px-4 py-2.5">Payload Size</th>
                <th className="px-4 py-2.5">Flags / Info</th>
                <th className="px-4 py-2.5">Latency</th>
                <th className="px-4 py-2.5">AI Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {records.length > 0 ? (
                records.map((r) => {
                  const isAnom = r.is_anomaly === 1;
                  return (
                    <tr 
                      key={r.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isAnom ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      <td className="px-4 py-2 text-slate-400">
                        {r.timestamp ? r.timestamp.split('T')[1]?.slice(0, 8) : ''}
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        <span className="text-slate-100">{r.src_ip}</span>
                        <span className="text-slate-500">:{r.src_port}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        <span className="text-slate-100">{r.dst_ip}</span>
                        <span className="text-slate-500">:{r.dst_port}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          r.protocol === 'TCP' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                          (r.protocol === 'UDP' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30')
                        }`}>
                          {r.protocol}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-300">
                        {r.packet_size} <span className="text-slate-500 text-[10px]">B</span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 font-sans text-xs max-w-xs truncate">
                        {r.flags || 'ACK'}
                      </td>
                      <td className="px-4 py-2 text-slate-300">
                        {r.latency} <span className="text-slate-500 text-[10px]">ms</span>
                      </td>
                      <td className="px-4 py-2">
                        {isAnom ? (
                          <div className="flex items-center gap-1.5 text-rose-400 font-sans text-xs">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Anomaly ({r.anomaly_score})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-sans text-xs">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Nominal</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-sans">
                    {isLoading ? 'Loading packet stream...' : 'No packets recorded in current stream buffer.'}
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
