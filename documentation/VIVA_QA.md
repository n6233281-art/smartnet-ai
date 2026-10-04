# SmartNet AI: Comprehensive Viva Voce Questions & Answers
## Computer Networks & Machine Learning Examination Preparation

---

### Q1: What is the primary difference between a Router and a Switch in your topology?
**Answer:** A switch (e.g., Catalyst 2960) operates at **Layer 2 (Data Link Layer)** and forwards frames using hardware MAC address tables via packet switching within the same local broadcast domain. A router (e.g., Cisco 2911/1941) operates at **Layer 3 (Network Layer)** and forwards packets based on IP addresses, connecting different subnets, maintaining routing tables, and serving as the default gateway (`192.168.1.1`).

### Q2: Why did you choose Isolation Forest instead of supervised classifiers like Random Forest or SVM for anomaly detection?
**Answer:** In real-world enterprise network security, anomaly data is highly asymmetric—true cyber attacks and zero-day deviations represent less than 1% of total traffic and new attack vectors do not possess pre-existing labels. Supervised models suffer from severe class imbalance and fail against unobserved attack signatures. **Isolation Forest** is an unsupervised algorithm that detects anomalies purely by their susceptibility to isolation in few recursive feature cuts, making it ideal for zero-day threat detection.

### Q3: How is the Anomaly Score mathematically computed in your Isolation Forest engine?
**Answer:** The score is defined as $s(\mathbf{x}, n) = 2^{-\frac{E(h(\mathbf{x}))}{c(n)}}$, where $E(h(\mathbf{x}))$ is the average path length taken to isolate point $\mathbf{x}$ across all isolation trees, and $c(n)$ is the average path length of an unsuccessful search in a binary search tree built on $n$ samples. If a packet is isolated at very shallow depths (low path length), the ratio $\frac{E(h)}{c(n)} \to 0$, causing $s(\mathbf{x}, n)$ to approach $1.0$, indicating a high probability of anomaly.

### Q4: Explain the 3-Way Handshake in TCP observed in your packet analyzer.
**Answer:** When PC1 accesses Server SRV1 via HTTP:
1. **SYN:** Client sends a segment with `SYN=1`, random Initial Sequence Number (ISN).
2. **SYN-ACK:** Server acknowledges with `SYN=1`, `ACK=1`, `ack_number = client_isn + 1`, and its own ISN.
3. **ACK:** Client completes the handshake with `ACK=1`, `ack_number = server_isn + 1`. The socket connection is now in the `ESTABLISHED` state.

### Q5: How does your congestion prediction model forecast bottlenecks before they cause packet drops?
**Answer:** Rather than reacting after packet loss occurs, our algorithm samples moving-window throughput and calculates its first derivative (slope) via least-squares linear regression. Concurrently, it models M/M/1 queuing delay: $W_q = \frac{\rho}{\mu (1 - \rho)}$. When projected link utilization $\rho \to 85\%$, delay increases exponentially. The model computes a risk index and alerts the network administrator to apply Random Early Detection (RED) or adjust TCP window scaling.

### Q6: What addressing scheme is implemented in your Cisco Packet Tracer network?
**Answer:** We implemented a Class C private network `192.168.1.0/24` with subnet mask `255.255.255.0`:
- Network ID: `192.168.1.0`
- Usable Host Range: `192.168.1.1` to `192.168.1.254` (Total 254 usable host addresses)
- Broadcast Address: `192.168.1.255`
- Default Gateway: `192.168.1.1` configured on Router Interface Gig0/0.

### Q7: What is the significance of the TTL (Time To Live) field in the IP header during ping tests?
**Answer:** TTL is an 8-bit counter decremented by 1 at every router hop. If TTL reaches 0 before reaching the destination, the router drops the packet and transmits an ICMP Type 11 (Time Exceeded) message back to the sender. This prevents packets from looping infinitely in routing loops.

### Q8: How can this system be tested without physical hardware?
**Answer:** The project features three testing modes:
1. Built-in synthetic traffic simulator with 4 controllable scenarios (Normal, High Load, Congestion, Port Scan / DDoS).
2. Cisco Packet Tracer simulation mode PDU capture exported to CSV.
3. Wireshark PCAP / CSV file drag-and-drop import.
