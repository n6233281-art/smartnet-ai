import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Router as RouterIcon, 
  Server, 
  Monitor, 
  Layers, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Radio,
  Play
} from 'lucide-react';
import { fetchTopology, testPing } from '../services/api';
import { NetworkDevice, TopologyLink } from '../types';

export const NetworkTopologyPage: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<TopologyLink[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  // Ping Test State
  const [pingSource, setPingSource] = useState('PC1');
  const [pingTarget, setPingTarget] = useState('SRV1');
  const [pingResult, setPingResult] = useState<any | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    fetchTopology().then((data) => {
      setNodes(data.nodes || []);
      setLinks(data.links || []);
      if (data.nodes && data.nodes.length > 0) {
        setSelectedDevice(data.nodes[0]);
      }
    }).catch(console.error);
  }, []);

  const handleRunPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await testPing(pingSource, pingTarget);
      setPingResult(res);
    } catch (err: any) {
      setPingResult({ error: err.message });
    } finally {
      setIsPinging(false);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'router': return RouterIcon;
      case 'server': return Server;
      case 'switch': return Layers;
      default: return Monitor;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Topology Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Cisco Packet Tracer Enterprise LAN Topology (192.168.1.0/24)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Standard hierarchical local area network: Gateway Router R1, dual Catalyst 2960 access switches (SW1 & SW2), four client workstations, and enterprise datacenter Server SRV1.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Packet Switching Active</span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative min-h-[480px] flex flex-col justify-between overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Level 1: Core Router */}
        <div className="relative z-10 flex justify-center pt-2">
          {nodes.filter(n => n.id === 'R1').map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedDevice(node)}
              className={`p-4 rounded-xl cursor-pointer transition-all border flex flex-col items-center gap-2 w-56 ${
                selectedDevice?.id === node.id 
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <RouterIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">{node.name}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{node.ip}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Gig0/0 & Gig0/1</div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Connecting Lines (Level 1 to Level 2) */}
        <div className="relative z-0 flex justify-around my-2 px-24">
          <div className="h-10 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 animate-pulse" />
          <div className="h-10 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 animate-pulse" />
        </div>

        {/* Level 2: Distribution Switches */}
        <div className="relative z-10 grid grid-cols-2 gap-12 max-w-2xl mx-auto w-full">
          {nodes.filter(n => n.type === 'switch').map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedDevice(node)}
              className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-center gap-3 ${
                selectedDevice?.id === node.id 
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{node.name}</div>
                <div className="text-[10px] font-mono text-blue-400">{node.ip}</div>
                <div className="text-[10px] text-slate-400 truncate">{node.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Connecting Lines (Level 2 to Level 3) */}
        <div className="relative z-0 grid grid-cols-2 gap-12 max-w-2xl mx-auto w-full px-8 my-2">
          <div className="flex justify-around">
            <div className="h-8 w-0.5 bg-slate-700" />
            <div className="h-8 w-0.5 bg-slate-700" />
          </div>
          <div className="flex justify-around">
            <div className="h-8 w-0.5 bg-slate-700" />
            <div className="h-8 w-0.5 bg-slate-700" />
            <div className="h-8 w-0.5 bg-emerald-500/80 animate-pulse" />
          </div>
        </div>

        {/* Level 3: End Devices (PCs & Server) */}
        <div className="relative z-10 grid grid-cols-5 gap-3 max-w-4xl mx-auto w-full pb-2">
          {/* Workstations PC1, PC2, PC3, PC4 */}
          {nodes.filter(n => n.type === 'pc').map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedDevice(node)}
              className={`p-3 rounded-lg cursor-pointer transition-all border text-center flex flex-col items-center gap-1.5 ${
                selectedDevice?.id === node.id 
                  ? 'bg-slate-900 border-cyan-400 shadow-md' 
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Monitor className="w-4 h-4 text-slate-300" />
              <div className="text-[11px] font-semibold text-white">{node.name.split(' ')[0]}</div>
              <div className="text-[10px] font-mono text-slate-400">{node.ip}</div>
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                Fa0/1
              </span>
            </div>
          ))}

          {/* Server SRV1 */}
          {nodes.filter(n => n.type === 'server').map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedDevice(node)}
              className={`p-3 rounded-lg cursor-pointer transition-all border text-center flex flex-col items-center gap-1.5 ${
                selectedDevice?.id === node.id 
                  ? 'bg-slate-900 border-emerald-400 shadow-md shadow-emerald-500/10' 
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <div className="text-[11px] font-semibold text-emerald-300">{node.name.split(' ')[0]}</div>
              <div className="text-[10px] font-mono text-emerald-400">{node.ip}</div>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                Web/DNS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Device Inspector Card & Interactive Ping Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Details Inspector */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-white">Device Hardware & Interface Profile</h3>
            <span className="text-xs font-mono text-cyan-400">
              {selectedDevice?.name || 'Select a node'}
            </span>
          </div>

          {selectedDevice ? (
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">IP Address</span>
                <div className="text-white font-semibold mt-0.5">{selectedDevice.ip}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Subnet Mask</span>
                <div className="text-white font-semibold mt-0.5">255.255.255.0 (/24)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Hardware Role</span>
                <div className="text-slate-200 mt-0.5 font-sans truncate">{selectedDevice.role}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Connected Uplink</span>
                <div className="text-cyan-400 mt-0.5 font-sans truncate">{selectedDevice.connectedTo?.join(', ') || 'Backbone'}</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-6 text-center">
              Click any device in the network diagram above to inspect hardware attributes.
            </div>
          )}
        </div>

        {/* Interactive ICMP Ping Simulator */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">ICMP Echo Request (Ping) Simulator</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">RFC 792 ICMP</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Source Node:</label>
              <select
                value={pingSource}
                onChange={(e) => setPingSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono"
              >
                <option value="PC1">PC1 (192.168.1.10)</option>
                <option value="PC2">PC2 (192.168.1.11)</option>
                <option value="PC3">PC3 (192.168.1.20)</option>
                <option value="PC4">PC4 (192.168.1.21)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target Node:</label>
              <select
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono"
              >
                <option value="SRV1">SRV1 Server (192.168.1.100)</option>
                <option value="R1">Router R1 (192.168.1.1)</option>
                <option value="PC3">PC3 (192.168.1.20)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunPing}
            disabled={isPinging}
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPinging ? 'Transmitting 4 Echo PDUs...' : `Send ICMP Ping (${pingSource} → ${pingTarget})`}</span>
          </button>

          {pingResult && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-cyan-400 font-semibold">Ping Statistics for {pingResult.target}:</div>
              <div>Packets: Sent = {pingResult.packetsTransmitted}, Received = {pingResult.packetsReceived}, Lost = {pingResult.packetLossPct}%</div>
              <div>RTT Times: {pingResult.rttTimesMs?.join('ms, ')}ms (Average = {pingResult.averageRttMs}ms)</div>
              <div className="text-emerald-400">{pingResult.status}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
