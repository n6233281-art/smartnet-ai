# Cisco Packet Tracer Topology & Demonstration Guide
## SmartNet AI: AI-Powered Smart Network Traffic Analyzer

This guide explains how to construct and verify the SmartNet AI network topology inside **Cisco Packet Tracer (v7.x, v8.x, or later)** for college laboratory evaluation and viva demonstrations.

---

## 1. Network Topology Specifications

| Device Type | Packet Tracer Model | Device Name | Interface | Connected To | IP Address / Subnet | Default Gateway |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Router** | Cisco 2911 or 1941 | `R1-Gateway` | Gig0/0 | SW1 (Gig0/1) | `192.168.1.1/24` | N/A (Gateway) |
| **Switch 1** | Catalyst 2960-24TT | `SW1-Sales` | Fa0/1, Fa0/2 | PC1, PC2 | `192.168.1.2/24` (Mgmt) | `192.168.1.1` |
| **Switch 2** | Catalyst 2960-24TT | `SW2-Servers` | Fa0/1, Fa0/2, Gig0/2 | PC3, PC4, SRV1 | `192.168.1.3/24` (Mgmt) | `192.168.1.1` |
| **PC 1** | Standard PC-PT | `PC1` | FastEthernet0 | SW1 (Fa0/1) | `192.168.1.10/24` | `192.168.1.1` |
| **PC 2** | Standard PC-PT | `PC2` | FastEthernet0 | SW1 (Fa0/2) | `192.168.1.11/24` | `192.168.1.1` |
| **PC 3** | Standard PC-PT | `PC3` | FastEthernet0 | SW2 (Fa0/1) | `192.168.1.20/24` | `192.168.1.1` |
| **PC 4** | Standard PC-PT | `PC4` | FastEthernet0 | SW2 (Fa0/2) | `192.168.1.21/24` | `192.168.1.1` |
| **Server** | Server-PT | `SRV1` | Gig0 or Fa0 | SW2 (Gig0/2) | `192.168.1.100/24` | `192.168.1.1` |

---

## 2. Step-by-Step Packet Tracer Recreation

### Step 1: Place Hardware Components
1. Drag **1x Router (2911 or 1941)** onto the workspace canvas.
2. Drag **2x Switches (Catalyst 2960)**.
3. Drag **4x End Devices (PC)** and **1x End Device (Server)**.

### Step 2: Cable Connections (Copper Straight-Through)
- Connect `R1 Gig0/0` to `SW1 Gig0/1`.
- Connect `SW1 Gig0/2` or `R1 Gig0/1` to `SW2 Gig0/1`.
- Connect `PC1` and `PC2` to `SW1 FastEthernet0/1` and `Fa0/2`.
- Connect `PC3` and `PC4` to `SW2 FastEthernet0/1` and `Fa0/2`.
- Connect `SRV1` to `SW2 Gig0/2`.

### Step 3: IP Configuration
On each PC (Desktop -> IP Configuration):
- Set IPv4 Address, Subnet Mask `255.255.255.0`, and Default Gateway `192.168.1.1`.
- Set DNS Server to `192.168.1.100`.

On Server SRV1:
- Services tab -> HTTP: Ensure HTTP and HTTPS services are `ON`.
- Services tab -> DNS: Add record `cisco.smartnet.local` -> `192.168.1.100`.

---

## 3. Demonstration Scenarios for Evaluation

### Scenario A: Verifying Baseline Connectivity (ICMP Ping)
Open PC1 Command Prompt:
```shell
ping 192.168.1.1
ping 192.168.1.100
```
Expected Output: `4 packets transmitted, 4 received, 0% packet loss`.

### Scenario B: HTTP Web Traffic Generation
On PC2:
- Open Web Browser application.
- Enter URL `http://192.168.1.100` or `http://cisco.smartnet.local`.
- Observe 3-Way TCP Handshake `[SYN, SYN-ACK, ACK]` and HTTP GET payload exchange in Packet Tracer **Simulation Mode (Shift + S)**.

### Scenario C: Simulating Network Failure & Convergence
- In Packet Tracer, click on the link between SW1 and R1 and press `Delete` (or issue `shutdown` on interface `Gig0/0`).
- Attempt ping from PC1 to PC3: Packet will fail with `Destination Host Unreachable`.
- Restore the interface (`no shutdown`): Spanning Tree Protocol (STP) will transition from Amber (Listening/Learning) to Green (Forwarding) within 30-50 seconds.

### Scenario D: Exporting Packet Tracer Logs to SmartNet AI
1. In Cisco Packet Tracer, switch to **Simulation Mode**.
2. Run event playback (Capture / Forward).
3. Open Event List -> Copy PDU summary or export as CSV format.
4. Open the **SmartNet AI Web Application** -> Navigate to **Packet Analyzer** -> Upload the captured file to run Isolation Forest Anomaly Detection!
