import React, { useState, useEffect } from 'react';
import { Layers, PieChart as PieIcon, ArrowUpDown, Filter, ShieldCheck, Activity } from 'lucide-react';
import { fetchProtocols } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const PROTO_COLORS: Record<string, string> = {
  TCP: '#06b6d4',
  UDP: '#3b82f6',
  ICMP: '#f59e0b',
  DNS: '#10b981',
  HTTP: '#8b5cf6',
  HTTPS: '#ec4899'
};

export const ProtocolAnalysisPage: React.FC = () => {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [topPorts, setTopPorts] = useState<any[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'count' | 'bytes' | 'latency'>('count');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProtocols().then((data) => {
      setProtocols(data.protocols || []);
      setTopPorts(data.topPorts || []);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const sortedProtocols = [...protocols].sort((a, b) => {
    if (sortBy === 'count') return b.packetCount - a.packetCount;
    if (sortBy === 'bytes') return b.totalBytes - a.totalBytes;
    return b.avgLatency - a.avgLatency;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Layer 4 Transport & Layer 7 Application Protocol Breakdown
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Granular inspection of packet headers, socket ports, and byte volumes across TCP, UDP, ICMP, DNS, HTTP, and HTTPS streams traversing the LAN switch fabric.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono">
              {(['count', 'bytes', 'latency'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors ${
                    sortBy === s ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedProtocols.map((p) => {
          const color = PROTO_COLORS[p.protocol] || '#06b6d4';
          const isSelected = selectedProtocol === p.protocol;
          return (
            <div
              key={p.protocol}
              onClick={() => setSelectedProtocol(isSelected ? null : p.protocol)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-bold text-white font-mono">{p.protocol}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {p.packetCount.toLocaleString()} pkts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Bytes Transferred</span>
                  <div className="text-slate-200 font-semibold mt-0.5 tabular-nums">
                    {(p.totalBytes / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Avg Latency</span>
                  <div className="text-cyan-400 font-semibold mt-0.5 tabular-nums">
                    {p.avgLatency} ms
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Volume Comparison & Top Port Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Packet Volume */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-1">Packet Count by Protocol</h3>
          <p className="text-xs text-slate-400 mb-4">Comparative transmission density</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedProtocols}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="protocol" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="packetCount" name="Packets" radius={[4, 4, 0, 0]}>
                  {sortedProtocols.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PROTO_COLORS[entry.protocol] || '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Active Destination Ports */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-1">Most Active Destination Ports</h3>
          <p className="text-xs text-slate-400 mb-4">Standard service endpoints vs suspicious scans</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPorts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="port" type="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Hits" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Protocol Reference Table for Computer Networks Students */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white">Computer Networks Protocol Reference Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-mono font-bold">TCP (Transmission Control Protocol)</div>
            <p className="text-slate-400 leading-relaxed">
              Connection-oriented, reliable byte stream delivery using 3-way handshake (`SYN`, `SYN-ACK`, `ACK`), sequence numbers, flow control (sliding window), and error recovery via retransmissions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-blue-400 font-mono font-bold">UDP (User Datagram Protocol)</div>
            <p className="text-slate-400 leading-relaxed">
              Connectionless, lightweight datagram service without handshakes, ordering, or flow control. Minimal 8-byte header overhead; ideal for DNS queries, VoIP, and real-time streaming.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-amber-400 font-mono font-bold">ICMP (Internet Control Message Protocol)</div>
            <p className="text-slate-400 leading-relaxed">
              Network-layer diagnostics protocol. Used by `ping` (Echo Request Type 8 / Echo Reply Type 0) and `traceroute` (Time Exceeded Type 11) to verify route paths and host reachability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
