export type NavigationPage = 
  | 'dashboard'
  | 'live-monitor'
  | 'packet-analyzer'
  | 'anomaly-detection'
  | 'congestion-prediction'
  | 'protocol-analysis'
  | 'network-topology'
  | 'security-alerts'
  | 'performance-analytics'
  | 'cisco-pt'
  | 'documentation';

export interface TrafficRecord {
  id: number;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: string;
  packet_size: number;
  flags: string;
  latency: number;
  bandwidth_mbps: number;
  is_anomaly: number;
  anomaly_score: number;
  scenario: string;
}

export interface SecurityAlert {
  id: number;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  recommended_action: string;
  status: 'unresolved' | 'resolved';
  anomaly_score?: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: 'router' | 'switch' | 'pc' | 'server';
  role: string;
  status: 'online' | 'degraded' | 'offline';
  connected_to: string;
  subnet: string;
  packets_sent: number;
  packets_recv: number;
}

export interface TopologyLink {
  source: string;
  target: string;
  bandwidth: string;
  interface: string;
  status: 'up' | 'down';
}

export interface CongestionData {
  status: 'Healthy' | 'Warning' | 'Critical';
  riskScore: number;
  trend: string;
  forecastMinutes: number;
  currentUtilizationPct: number;
  predictedBandwidthMbps: number;
  bufferQueuePressurePct: number;
  recommendedAction: string;
  slope: number;
}

export interface DashboardMetrics {
  totalPacketsAnalyzed: number;
  incomingPackets: number;
  outgoingPackets: number;
  currentBandwidthMbps: number;
  averageLatencyMs: number;
  packetLossPercentage: number;
  networkHealthScore: number;
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
  totalAnomaliesDetected: number;
  unresolvedAlerts: number;
  packetRate: number;
}
