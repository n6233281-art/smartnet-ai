import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  Upload, 
  Download, 
  Filter, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { fetchTrafficRecords, uploadTrafficFile } from '../services/api';
import { TrafficRecord } from '../types';

export const PacketAnalyzerPage: React.FC = () => {
  const [records, setRecords] = useState<TrafficRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('ALL');
  const [anomalyFilter, setAnomalyFilter] = useState('ALL');
  const [pageOffset, setPageOffset] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<TrafficRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPackets = async () => {
    try {
      const isAnom = anomalyFilter === 'ANOMALY' ? 'true' : (anomalyFilter === 'NORMAL' ? 'false' : undefined);
      const data = await fetchTrafficRecords({
        limit: 50,
        offset: pageOffset,
        protocol: selectedProtocol !== 'ALL' ? selectedProtocol : undefined,
        isAnomaly: isAnom,
        search: searchTerm || undefined
      });
      setRecords(data.records || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPackets();
  }, [pageOffset, selectedProtocol, anomalyFilter, searchTerm]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const isPcap = file.name.endsWith('.pcap');
    const reader = new FileReader();

    if (isPcap) {
      reader.onload = async (event) => {
        try {
          const arrayBuf = event.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuf);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          const result = await uploadTrafficFile(base64, file.name, 'pcap');
          setUploadMessage(`Success: Imported ${result.parsedRowsCount} frames (${result.anomaliesFound} anomalies identified)`);
          loadPackets();
        } catch (err: any) {
          setUploadMessage(`Upload failed: ${err.message}`);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          const result = await uploadTrafficFile(text, file.name, 'csv');
          setUploadMessage(`Success: Processed ${result.parsedRowsCount} packets from CSV (${result.anomaliesFound} anomalies)`);
          loadPackets();
        } catch (err: any) {
          setUploadMessage(`Upload failed: ${err.message}`);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSampleDataset = async (type: 'wireshark' | 'cisco') => {
    setIsUploading(true);
    setUploadMessage(null);
    try {
      const url = type === 'cisco' ? '/datasets/cisco_pt_capture.csv' : '/datasets/sample_traffic.csv';
      const res = await fetch(url);
      const csvText = await res.text();
      const result = await uploadTrafficFile(csvText, type === 'cisco' ? 'cisco_pt_capture.csv' : 'sample_traffic.csv', 'csv');
      setUploadMessage(`Loaded sample dataset: ${result.parsedRowsCount} packets injected into SQLite database.`);
      loadPackets();
    } catch (err: any) {
      setUploadMessage(`Failed to load sample: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['id,timestamp,src_ip,dst_ip,src_port,dst_port,protocol,packet_size,flags,latency,is_anomaly,anomaly_score'];
    const rows = records.map(r => 
      `${r.id},"${r.timestamp}","${r.src_ip}","${r.dst_ip}",${r.src_port},${r.dst_port},"${r.protocol}",${r.packet_size},"${r.flags}",${r.latency},${r.is_anomaly},${r.anomaly_score}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartnet_filtered_packets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Packet Analyzer & Deep Frame Inspection</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Parse Wireshark PCAPs and Cisco Packet Tracer PDU CSV exports with automated field extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,.pcap" 
            className="hidden" 
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-sm disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Parsing File...' : 'Upload PCAP / CSV'}</span>
          </button>

          <button
            onClick={() => handleLoadSampleDataset('cisco')}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Cisco PT Sample</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {uploadMessage && (
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
          <button onClick={() => setUploadMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by IP, port, or TCP flag..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageOffset(0);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 text-xs font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Protocol:</span>
            <select
              value={selectedProtocol}
              onChange={(e) => {
                setSelectedProtocol(e.target.value);
                setPageOffset(0);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Protocols</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={anomalyFilter}
              onChange={(e) => {
                setAnomalyFilter(e.target.value);
                setPageOffset(0);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Flows</option>
              <option value="NORMAL">Normal Only</option>
              <option value="ANOMALY">Anomalies Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Packet Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Showing <span className="font-mono text-white font-semibold">{records.length}</span> of <span className="font-mono text-white font-semibold">{totalCount}</span> total records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageOffset(Math.max(0, pageOffset - 50))}
              disabled={pageOffset === 0}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
            >
              Previous
            </button>
            <button
              onClick={() => setPageOffset(pageOffset + 50)}
              disabled={pageOffset + records.length >= totalCount}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">ID</th>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Source Socket</th>
                <th className="px-4 py-2.5">Destination Socket</th>
                <th className="px-4 py-2.5">Protocol</th>
                <th className="px-4 py-2.5">Payload</th>
                <th className="px-4 py-2.5">Flags / Info</th>
                <th className="px-4 py-2.5">Anomaly Score</th>
                <th className="px-4 py-2.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {records.length > 0 ? (
                records.map((r) => {
                  const isAnom = r.is_anomaly === 1;
                  return (
                    <tr 
                      key={r.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${isAnom ? 'bg-rose-500/5' : ''}`}
                    >
                      <td className="px-4 py-2 text-slate-500">#{r.id}</td>
                      <td className="px-4 py-2 text-slate-400">
                        {r.timestamp ? r.timestamp.split('T')[1]?.slice(0, 8) : ''}
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        <span>{r.src_ip}</span>
                        <span className="text-slate-500">:{r.src_port}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        <span>{r.dst_ip}</span>
                        <span className="text-slate-500">:{r.dst_port}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-slate-300 font-semibold">{r.protocol}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-300">
                        {r.packet_size} B
                      </td>
                      <td className="px-4 py-2 text-slate-400 font-sans max-w-xs truncate">
                        {r.flags || 'ACK'}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`font-mono text-xs font-semibold ${
                          r.anomaly_score > 0.75 ? 'text-rose-400' : (r.anomaly_score > 0.5 ? 'text-amber-400' : 'text-emerald-400')
                        }`}>
                          {r.anomaly_score ? r.anomaly_score.toFixed(3) : '0.120'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => setSelectedPacket(r)}
                          className="p-1 text-slate-400 hover:text-cyan-300 rounded transition-colors"
                          title="Inspect Packet Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 font-sans">
                    No packet records matched the selected query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packet Inspection Modal / Drawer */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Packet Frame #{selectedPacket.id} Deep Inspector</h3>
              </div>
              <button 
                onClick={() => setSelectedPacket(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* OSI Layer Breakdown */}
              <div className="space-y-2">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">OSI Layer Decomposition</div>
                
                {/* Layer 2 */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-slate-200">Layer 2: Data Link Layer (Ethernet II)</div>
                  <div className="text-slate-400 font-mono text-[11px] mt-1">
                    Frame Size: {selectedPacket.packet_size} bytes · Type: IPv4 (0x0800)
                  </div>
                </div>

                {/* Layer 3 */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-slate-200">Layer 3: Network Layer (IPv4)</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px] mt-1">
                    <div>Source IP: <span className="text-cyan-300">{selectedPacket.src_ip}</span></div>
                    <div>Destination IP: <span className="text-cyan-300">{selectedPacket.dst_ip}</span></div>
                    <div>TTL: 64 hops</div>
                    <div>Protocol ID: {selectedPacket.protocol === 'TCP' ? '6 (TCP)' : (selectedPacket.protocol === 'UDP' ? '17 (UDP)' : '1 (ICMP)')}</div>
                  </div>
                </div>

                {/* Layer 4 */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-slate-200">Layer 4: Transport Layer ({selectedPacket.protocol})</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px] mt-1">
                    <div>Source Port: <span className="text-slate-200">{selectedPacket.src_port}</span></div>
                    <div>Destination Port: <span className="text-slate-200">{selectedPacket.dst_port}</span></div>
                    <div>Control Flags: <span className="text-amber-300">{selectedPacket.flags || 'ACK'}</span></div>
                    <div>Measured Latency: <span className="text-slate-200">{selectedPacket.latency} ms</span></div>
                  </div>
                </div>
              </div>

              {/* AI Anomaly Assessment */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                  AI Model Assessment (Isolation Forest)
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Anomaly Score:</span>
                  <span className={`font-mono font-bold ${
                    selectedPacket.anomaly_score > 0.75 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedPacket.anomaly_score} / 1.000
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-300 font-medium">Classification:</span>
                  <span className="font-semibold text-white">
                    {selectedPacket.is_anomaly ? 'Potential Network Anomaly' : 'Normal Operational Flow'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedPacket(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
