# SmartNet AI: AI-Powered Smart Network Traffic Analyzer and Anomaly Detection System

![SmartNet AI](https://img.shields.io/badge/Status-Operational-brightgreen)
![React 19](https://img.shields.io/badge/Frontend-React%2019-blue)
![Express](https://img.shields.io/badge/Backend-Express%20%2B%20Python-orange)
![Machine Learning](https://img.shields.io/badge/ML-Isolation%20Forest-cyan)
![Cisco](https://img.shields.io/badge/Simulation-Cisco%20Packet%20Tracer-005073)

SmartNet AI is a comprehensive, production-grade network monitoring, telemetry, and anomaly detection platform designed for Computer Networks and Cybersecurity students and engineers.

## Features
- **Live Traffic Monitoring:** Real-time bandwidth, packet rate, latency, and packet loss metrics.
- **Unsupervised ML Anomaly Detection:** Real Isolation Forest model classifying network flows as Normal, Suspicious, or Anomalous with multi-dimensional path length scoring.
- **Predictive Congestion Forecasting:** Least-squares regression and queuing theory buffer estimation to predict bandwidth saturation 15 minutes ahead.
- **Cisco Packet Tracer Integration:** Full topology simulation (1 Router, 2 Switches, 4 PCs, 1 Server, subnet 192.168.1.0/24), interactive ping simulator, and IOS configuration scripts.
- **Packet & Protocol Analyzer:** Deep breakdown of TCP, UDP, ICMP, DNS, HTTP, and HTTPS traffic with PCAP and CSV log parser.
- **Security Incident Response:** Interactive alert center with severity filters and mitigation recommendations.
- **Embedded SQLite Persistence:** Real SQL database storage for traffic records, alerts, and topology devices.

## Quick Start (PowerShell / Linux / macOS)
```bash
# Install dependencies
npm install

# Start development full-stack server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

For detailed documentation, see `/documentation/PROJECT_REPORT.md`, `/documentation/VIVA_QA.md`, and `/documentation/WINDOWS_SETUP_GUIDE.md`.
