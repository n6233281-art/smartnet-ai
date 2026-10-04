import random
from datetime import datetime

def generate_traffic_batch(count=10, scenario='normal'):
    records = []
    pcs = ['192.168.1.10', '192.168.1.11', '192.168.1.20', '192.168.1.21']
    server = '192.168.1.100'
    
    for _ in range(count):
        src_ip = random.choice(pcs)
        dst_ip = server
        if scenario == 'normal':
            protocol = random.choice(['TCP', 'TCP', 'UDP', 'ICMP'])
            dst_port = 443 if protocol == 'TCP' else (53 if protocol == 'UDP' else 0)
            packet_size = random.randint(200, 1400) if protocol == 'TCP' else 84
            packet_rate = random.randint(20, 60)
            is_anomaly = 0
            score = 0.15
        elif scenario == 'anomaly':
            src_ip = '45.33.32.156'
            protocol = 'TCP'
            dst_port = random.randint(1, 1024)
            packet_size = 60
            packet_rate = random.randint(300, 600)
            is_anomaly = 1
            score = 0.88
        else: # congestion
            protocol = 'TCP'
            dst_port = 8080
            packet_size = 1460
            packet_rate = random.randint(250, 450)
            is_anomaly = 0
            score = 0.35

        records.append({
            'timestamp': datetime.now().isoformat(),
            'src_ip': src_ip,
            'dst_ip': dst_ip,
            'src_port': random.randint(1024, 65000),
            'dst_port': dst_port,
            'protocol': protocol,
            'packet_size': packet_size,
            'flags': 'ACK' if protocol == 'TCP' else 'NONE',
            'latency': round(random.uniform(5, 25), 2),
            'bandwidth_mbps': round(random.uniform(10, 40), 2),
            'is_anomaly': is_anomaly,
            'anomaly_score': score,
            'scenario': scenario
        })
    return records
