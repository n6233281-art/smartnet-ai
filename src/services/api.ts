export async function fetchDashboardData() {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchTrafficRecords(params: {
  limit?: number;
  offset?: number;
  protocol?: string;
  isAnomaly?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.offset) query.set('offset', params.offset.toString());
  if (params.protocol) query.set('protocol', params.protocol);
  if (params.isAnomaly) query.set('isAnomaly', params.isAnomaly);
  if (params.search) query.set('search', params.search);

  const res = await fetch(`/api/traffic?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch traffic records');
  return res.json();
}

export async function uploadTrafficFile(fileContent: string, filename: string, format: 'csv' | 'pcap') {
  const res = await fetch('/api/traffic/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileContent, filename, format })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload traffic log');
  }
  return res.json();
}

export async function toggleSimulation(start: boolean, scenario?: string) {
  const endpoint = start ? '/api/simulation/start' : '/api/simulation/stop';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  });
  if (!res.ok) throw new Error('Failed to toggle simulation');
  return res.json();
}

export async function switchScenario(scenario: 'normal' | 'high' | 'congestion' | 'anomaly') {
  const res = await fetch('/api/simulation/scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  });
  if (!res.ok) throw new Error('Failed to switch scenario');
  return res.json();
}

export async function fetchAnomalies() {
  const res = await fetch('/api/anomalies');
  if (!res.ok) throw new Error('Failed to fetch anomalies');
  return res.json();
}

export async function analyzePacket(packet: {
  packetSize: number;
  protocol: string;
  srcPort: number;
  dstPort: number;
  packetRate: number;
  flowDuration: number;
  bytesTransferred: number;
}) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(packet)
  });
  if (!res.ok) throw new Error('Failed to analyze packet');
  return res.json();
}

export async function fetchCongestionPrediction() {
  const res = await fetch('/api/congestion/predict');
  if (!res.ok) throw new Error('Failed to fetch congestion prediction');
  return res.json();
}

export async function fetchProtocols() {
  const res = await fetch('/api/protocols');
  if (!res.ok) throw new Error('Failed to fetch protocol breakdown');
  return res.json();
}

export async function fetchTopology() {
  const res = await fetch('/api/topology');
  if (!res.ok) throw new Error('Failed to fetch network topology');
  return res.json();
}

export async function testPing(sourceId: string, targetId: string) {
  const res = await fetch('/api/topology/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceId, targetId })
  });
  if (!res.ok) throw new Error('Failed to run ping test');
  return res.json();
}

export async function fetchAlerts(severity?: string, status?: string) {
  const query = new URLSearchParams();
  if (severity) query.set('severity', severity);
  if (status) query.set('status', status);

  const res = await fetch(`/api/alerts?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function resolveAlert(alertId: number) {
  const res = await fetch(`/api/alerts/${alertId}/resolve`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Failed to resolve alert');
  return res.json();
}

export async function requestAIDiagnosis(currentMetrics: any, alertContext: any) {
  const res = await fetch('/api/ai/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentMetrics, alertContext })
  });
  if (!res.ok) throw new Error('Failed to request AI diagnosis');
  return res.json();
}
