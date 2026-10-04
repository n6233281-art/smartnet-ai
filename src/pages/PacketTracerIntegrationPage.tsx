import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Server, 
  Monitor, 
  Router as RouterIcon,
  HelpCircle,
  Download
} from 'lucide-react';

export const PacketTracerIntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'router_ios' | 'switch_ios' | 'guide'>('topology');
  const [copied, setCopied] = useState(false);

  const ROUTER_IOS_CONFIG = `! Cisco 2911 Router Startup Configuration
enable
configure terminal
hostname R1-Gateway

interface GigabitEthernet0/0
 description Link to SW1 (Sales LAN)
 ip address 192.168.1.1 255.255.255.0
 duplex auto
 speed auto
 no shutdown
 exit

interface GigabitEthernet0/1
 description Link to SW2 (Servers & Eng)
 ip address 192.168.2.1 255.255.255.0
 duplex auto
 speed auto
 no shutdown
 exit

ip routing

! DHCP Configuration for Client Workstations
ip dhcp excluded-address 192.168.1.1 192.168.1.9
ip dhcp excluded-address 192.168.1.100

ip dhcp pool SMARTNET_SALES
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 192.168.1.100
 exit

! Access Control List for Threat Mitigation
access-list 101 permit tcp any any established
access-list 101 permit ip 192.168.1.0 0.0.0.255 any
access-list 101 deny tcp host 45.33.32.156 any
access-list 101 permit icmp any any echo-reply
end
write memory`;

  const SWITCH_IOS_CONFIG = `! Cisco Catalyst 2960 Switch Configuration (SW1)
enable
configure terminal
hostname SW1-Sales

interface FastEthernet0/1
 description Workstation PC1 Link
 switchport mode access
 switchport port-security
 switchport port-security maximum 1
 switchport port-security violation restrict
 spanning-tree portfast
 no shutdown
 exit

interface FastEthernet0/2
 description Workstation PC2 Link
 switchport mode access
 switchport port-security
 spanning-tree portfast
 no shutdown
 exit

interface GigabitEthernet0/1
 description Uplink to R1 Gateway
 switchport mode access
 no shutdown
 exit

end
write memory`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Cisco Packet Tracer Simulation & Lab Evaluation Suite
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Complete blueprint, Cisco IOS configuration scripts, and IP addressing table to recreate and verify the SmartNet AI network simulation in Cisco Packet Tracer v7.x / v8.x+.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'topology' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Addressing Table
            </button>
            <button
              onClick={() => setActiveTab('router_ios')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'router_ios' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Router IOS
            </button>
            <button
              onClick={() => setActiveTab('switch_ios')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'switch_ios' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Switch IOS
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Evaluation Guide
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Addressing Table & Topology Spec */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Network Device Addressing & Interface Matrix</h3>
              <span className="text-xs font-mono text-cyan-400">Class C Subnet 192.168.1.0/24</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Device</th>
                    <th className="px-4 py-2.5">PT Hardware Model</th>
                    <th className="px-4 py-2.5">Interface</th>
                    <th className="px-4 py-2.5">IP Address</th>
                    <th className="px-4 py-2.5">Subnet Mask</th>
                    <th className="px-4 py-2.5">Default Gateway</th>
                    <th className="px-4 py-2.5">Role / VLAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">R1-Gateway</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">Cisco 2911</td>
                    <td className="px-4 py-2.5 text-cyan-300">Gig0/0</td>
                    <td className="px-4 py-2.5 text-cyan-400 font-bold">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-500">N/A (Gateway)</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Inter-VLAN & NAT Router</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">SW1-Sales</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">Catalyst 2960</td>
                    <td className="px-4 py-2.5 text-cyan-300">VLAN 1</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.2</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Access Switch 1</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">SW2-Servers</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">Catalyst 2960</td>
                    <td className="px-4 py-2.5 text-cyan-300">VLAN 1</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.3</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Server Farm Switch</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">PC1</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">PC-PT</td>
                    <td className="px-4 py-2.5 text-cyan-300">FastEthernet0</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.10</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Sales Workstation</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">PC2</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">PC-PT</td>
                    <td className="px-4 py-2.5 text-cyan-300">FastEthernet0</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.11</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Sales Workstation</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">PC3</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">PC-PT</td>
                    <td className="px-4 py-2.5 text-cyan-300">FastEthernet0</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.20</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Engineering Client</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">PC4</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">PC-PT</td>
                    <td className="px-4 py-2.5 text-cyan-300">FastEthernet0</td>
                    <td className="px-4 py-2.5 text-slate-200">192.168.1.21</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">Auditor Host</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-emerald-300">SRV1</td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">Server-PT</td>
                    <td className="px-4 py-2.5 text-cyan-300">Gig0</td>
                    <td className="px-4 py-2.5 text-emerald-400 font-bold">192.168.1.100</td>
                    <td className="px-4 py-2.5 text-slate-400">255.255.255.0</td>
                    <td className="px-4 py-2.5 text-slate-400">192.168.1.1</td>
                    <td className="px-4 py-2.5 text-emerald-300 font-sans">Web / DNS / FTP Server</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Router IOS Config */}
      {activeTab === 'router_ios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Cisco 2911 Router IOS Commands</span>
            </div>
            <button
              onClick={() => handleCopy(ROUTER_IOS_CONFIG)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy IOS Config'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {ROUTER_IOS_CONFIG}
          </pre>
        </div>
      )}

      {/* Tab 3: Switch IOS Config */}
      {activeTab === 'switch_ios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Cisco Catalyst 2960 Switch Port Security Commands</span>
            </div>
            <button
              onClick={() => handleCopy(SWITCH_IOS_CONFIG)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy IOS Config'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {SWITCH_IOS_CONFIG}
          </pre>
        </div>
      )}

      {/* Tab 4: Step-by-Step Evaluation Guide */}
      {activeTab === 'guide' && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs leading-relaxed text-slate-300">
          <h3 className="text-sm font-semibold text-white">How to Demonstrate this in Viva & Lab Exam:</h3>
          
          <div className="space-y-3 pl-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-cyan-400 mb-1">Step 1: Open Cisco Packet Tracer</div>
              <p className="text-slate-400">
                Drag 1 Router (2911), 2 Switches (2960), 4 PCs, and 1 Server. Connect with Copper Straight-Through cables according to the table above.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-cyan-400 mb-1">Step 2: Apply Interface Configurations</div>
              <p className="text-slate-400">
                Paste the Router IOS configuration into the Router CLI tab, and paste the Switch configuration into SW1 and SW2.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-cyan-400 mb-1">Step 3: Test ICMP Ping & Web Traffic</div>
              <p className="text-slate-400">
                On PC1, execute <code className="font-mono text-cyan-300">ping 192.168.1.100</code> to verify 4 packets delivered with 0% loss. Open PC1 web browser and enter <code className="font-mono text-cyan-300">http://192.168.1.100</code>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-cyan-400 mb-1">Step 4: Demonstrate SmartNet AI Machine Learning Ingestion</div>
              <p className="text-slate-400">
                In Packet Tracer Simulation Mode, capture the PDU list. In SmartNet AI, navigate to <strong>Packet Analyzer</strong> and upload the CSV to show the Isolation Forest detecting anomalous probes!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
