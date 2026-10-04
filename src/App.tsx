/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { NavigationPage } from './types';
import { fetchDashboardData, toggleSimulation, switchScenario } from './services/api';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { PacketAnalyzerPage } from './pages/PacketAnalyzerPage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { CongestionPredictionPage } from './pages/CongestionPredictionPage';
import { ProtocolAnalysisPage } from './pages/ProtocolAnalysisPage';
import { NetworkTopologyPage } from './pages/NetworkTopologyPage';
import { SecurityAlertsPage } from './pages/SecurityAlertsPage';
import { PerformanceAnalyticsPage } from './pages/PerformanceAnalyticsPage';
import { PacketTracerIntegrationPage } from './pages/PacketTracerIntegrationPage';
import { DocumentationPage } from './pages/DocumentationPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<'normal' | 'high' | 'congestion' | 'anomaly'>('normal');
  const [isSimRunning, setIsSimRunning] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      if (data.simulation) {
        setIsSimRunning(data.simulation.isRunning);
        setCurrentScenario(data.simulation.scenario);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboard();
    // Poll dashboard every 2.5s for live telemetry
    const interval = setInterval(loadDashboard, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboard();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleToggleSimulation = async () => {
    const nextState = !isSimRunning;
    setIsSimRunning(nextState);
    try {
      await toggleSimulation(nextState, currentScenario);
      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectScenario = async (scenario: 'normal' | 'high' | 'congestion' | 'anomaly') => {
    setCurrentScenario(scenario);
    try {
      await switchScenario(scenario);
      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const metrics = dashboardData?.metrics || {
    totalPacketsAnalyzed: 0,
    incomingPackets: 0,
    outgoingPackets: 0,
    currentBandwidthMbps: 14.2,
    averageLatencyMs: 8.4,
    packetLossPercentage: 0.1,
    networkHealthScore: 98,
    healthStatus: 'Healthy',
    totalAnomaliesDetected: 0,
    unresolvedAlerts: 0,
    packetRate: 42
  };

  const trendData = dashboardData?.trendData || [];
  const protocolDistribution = dashboardData?.protocolDistribution || [];
  const recentAlerts = dashboardData?.recentAlerts || [];
  const congestion = dashboardData?.congestion || {
    status: 'Healthy',
    riskScore: 12,
    trend: 'stable',
    forecastMinutes: 15,
    currentUtilizationPct: 14.2,
    predictedBandwidthMbps: 16.5,
    bufferQueuePressurePct: 12,
    recommendedAction: 'Operating normally. Headroom is adequate.',
    slope: 0.1
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        unresolvedAlertsCount={metrics.unresolvedAlerts}
        isSimRunning={isSimRunning}
        currentScenario={currentScenario}
        onToggleSim={handleToggleSimulation}
        onSelectScenario={handleSelectScenario}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          currentPage={currentPage}
          healthStatus={metrics.healthStatus}
          healthScore={metrics.networkHealthScore}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          onOpenQuickGuide={() => setCurrentPage('documentation')}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#030712] relative">
          <div className="max-w-7xl mx-auto pb-12">
            {currentPage === 'dashboard' && (
              <DashboardPage
                metrics={metrics}
                trendData={trendData}
                protocolDistribution={protocolDistribution}
                recentAlerts={recentAlerts}
                congestion={congestion}
                onNavigate={setCurrentPage}
                onSelectScenario={handleSelectScenario}
                currentScenario={currentScenario}
              />
            )}

            {currentPage === 'live-monitor' && <LiveMonitorPage />}

            {currentPage === 'packet-analyzer' && <PacketAnalyzerPage />}

            {currentPage === 'anomaly-detection' && <AnomalyDetectionPage />}

            {currentPage === 'congestion-prediction' && <CongestionPredictionPage />}

            {currentPage === 'protocol-analysis' && <ProtocolAnalysisPage />}

            {currentPage === 'network-topology' && <NetworkTopologyPage />}

            {currentPage === 'security-alerts' && <SecurityAlertsPage />}

            {currentPage === 'performance-analytics' && <PerformanceAnalyticsPage />}

            {currentPage === 'cisco-pt' && <PacketTracerIntegrationPage />}

            {currentPage === 'documentation' && <DocumentationPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
