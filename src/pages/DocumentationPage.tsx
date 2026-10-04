import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Terminal, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'report' | 'viva' | 'powershell'>('report');
  const [searchViva, setSearchViva] = useState('');
  const [openVivaId, setOpenVivaId] = useState<number | null>(1);
  const [copied, setCopied] = useState(false);

  const VIVA_QUESTIONS = [
    {
      id: 1,
      q: 'What is the fundamental difference between a Router and a Switch in this architecture?',
      a: 'A switch operates at Layer 2 (Data Link) and forwards Ethernet frames within a local broadcast domain using MAC address lookup tables. A router operates at Layer 3 (Network Layer) and routes packets between distinct subnets (like 192.168.1.0/24 and 192.168.2.0/24) using IP routing tables, serving as the default gateway.'
    },
    {
      id: 2,
      q: 'Why did you select Isolation Forest for network anomaly detection instead of a supervised classifier?',
      a: 'Supervised classifiers require balanced labeled datasets with examples of every cyberattack. In real enterprise networks, novel zero-day attacks and stealth scans are unlabelled, and normal traffic constitutes >99% of data. Isolation Forest is unsupervised and isolates anomalies rapidly via random binary splits without requiring pre-labeled training data.'
    },
    {
      id: 3,
      q: 'Explain the mathematical basis of the Anomaly Score in Isolation Forest.',
      a: 'The anomaly score s(x, n) = 2^(-E(h(x)) / c(n)), where E(h(x)) is the average path length taken to isolate sample x across the ensemble of iTrees, and c(n) is the average path length of an unsuccessful search in a BST of n nodes. Samples isolated at shallow depths yield s approaching 1.0, signifying an anomaly.'
    },
    {
      id: 4,
      q: 'How does the congestion prediction model use queuing theory (M/M/1)?',
      a: 'The model calculates channel throughput trend slope via least-squares linear regression and evaluates Kleinrock queuing delay: Wq = ρ / [μ(1 - ρ)]. As utilization ρ approaches 85%, buffer queue pressure escalates non-linearly. The model alerts operators before buffer drops occur.'
    },
    {
      id: 5,
      q: 'What is the role of the 3-way TCP handshake observed during the HTTP connection?',
      a: 'The 3-way handshake synchronizes sequence numbers and establishes a reliable stateful connection: SYN from client, SYN-ACK from server, and ACK from client. This sets window parameters and ensures both sockets are ready for bidirectional data transfer.'
    },
    {
      id: 6,
      q: 'What IP addressing scheme was implemented, and what is the usable host count?',
      a: 'Class C private subnet 192.168.1.0/24 with subnet mask 255.255.255.0. It provides 254 usable host addresses (192.168.1.1 through 192.168.1.254), reserving 192.168.1.0 as the Network ID and 192.168.1.255 as the Broadcast Address.'
    },
    {
      id: 7,
      q: 'What does TTL (Time To Live) signify in the IP header?',
      a: 'TTL is an 8-bit counter decremented by 1 at each router hop. When it reaches 0, the packet is discarded and an ICMP Time Exceeded (Type 11) is sent back to the source, preventing packets from looping indefinitely during routing loops.'
    }
  ];

  const filteredViva = VIVA_QUESTIONS.filter(
    v => v.q.toLowerCase().includes(searchViva.toLowerCase()) || v.a.toLowerCase().includes(searchViva.toLowerCase())
  );

  const POWERSHELL_CMDS = `# SmartNet AI - Windows PowerShell Execution Commands
# 1. Clone or open the repository folder
cd C:\\path\\to\\smartnet-ai

# 2. Install all node dependencies
npm install

# 3. Launch the unified Full-Stack Web Application (Port 3000)
npm run dev

# (Optional) To run the standalone Python Machine Learning backend:
cd backend
python -m venv venv
.\\venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python run.py`;

  const handleCopyCmds = () => {
    navigator.clipboard.writeText(POWERSHELL_CMDS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Project Documentation, Viva Voce Q&A & PowerShell Guide
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Complete college-grade technical deliverables: academic project report, examiner viva questions with answers, and Windows execution scripts.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'report' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Academic Report
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'viva' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Viva Questions ({VIVA_QUESTIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('powershell')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'powershell' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PowerShell Guide
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Academic Report */}
      {activeTab === 'report' && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">1. Project Abstract</h3>
            <p>
              SmartNet AI addresses the vulnerability of static threshold network monitoring tools by unifying Cisco Packet Tracer local area network topologies with unsupervised Machine Learning (Isolation Forest) and predictive congestion queuing theory. It analyzes packet sizes, transport protocols, port dynamics, and latency gradients to classify traffic and forecast saturation points before frame drops manifest.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">2. System Architecture & Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Module 1: Cisco LAN Simulation</div>
                <p className="text-slate-400">
                  Constructs a standardized 192.168.1.0/24 topology featuring 1 Router, 2 Switches, 4 PCs, and 1 Server, demonstrating TCP/UDP traffic and ping reachability.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Module 2: Isolation Forest Anomaly Detection</div>
                <p className="text-slate-400">
                  Evaluates 7-dimensional network vectors without labeled attack data, flagging port scans, SYN floods, and abnormal socket attempts.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Module 3: Congestion Prediction</div>
                <p className="text-slate-400">
                  Calculates linear regression throughput trends and M/M/1 queuing pressure to project bandwidth exhaustion 15 minutes ahead.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Module 4: SQLite Telemetry Repository</div>
                <p className="text-slate-400">
                  Maintains relational traffic records, incident states, and network performance metrics with full ACID compliance.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">3. Hardware & Software Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Operating System:</strong> Windows 10/11, Linux Ubuntu 22.04+, or macOS</li>
              <li><strong>Runtime:</strong> Node.js v18+ & Python 3.10+</li>
              <li><strong>Simulation Platform:</strong> Cisco Packet Tracer v7.x / v8.x</li>
              <li><strong>ML Libraries:</strong> Scikit-Learn, Pandas, NumPy, Joblib</li>
              <li><strong>Frontend:</strong> React 19, Tailwind CSS, Recharts, Lucide Icons</li>
            </ul>
          </section>
        </div>
      )}

      {/* Tab 2: Viva Voce Q&A */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Viva questions or networking keywords..."
              value={searchViva}
              onChange={(e) => setSearchViva(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs font-mono"
            />
          </div>

          <div className="space-y-2.5">
            {filteredViva.map((v) => {
              const isOpen = openVivaId === v.id;
              return (
                <div 
                  key={v.id}
                  className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenVivaId(isOpen ? null : v.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-semibold text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">Q{v.id}.</span>
                      <span>{v.q}</span>
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/60">
                      <strong className="text-emerald-400 block mb-1">Examiner Answer:</strong>
                      {v.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Windows PowerShell Execution Guide */}
      {activeTab === 'powershell' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Windows PowerShell Setup Script</span>
            </div>
            <button
              onClick={handleCopyCmds}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {POWERSHELL_CMDS}
          </pre>
        </div>
      )}
    </div>
  );
};
