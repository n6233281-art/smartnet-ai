import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime
from app.ai.isolation_forest import NetworkIsolationForest
from app.ai.congestion_model import CongestionPredictor
from app.database.db import get_db_connection, init_db
from app.simulator.traffic_generator import generate_traffic_batch

app = Flask(__name__)
CORS(app)

# Initialize Database and ML models
init_db()
iso_forest = NetworkIsolationForest()
iso_forest.load_or_train()
congestion_predictor = CongestionPredictor()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "service": "SmartNet AI Python ML Backend",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query summary metrics
    total_packets = cursor.execute("SELECT COUNT(*) FROM traffic_records").fetchone()[0]
    total_anomalies = cursor.execute("SELECT COUNT(*) FROM traffic_records WHERE is_anomaly = 1").fetchone()[0]
    unresolved_alerts = cursor.execute("SELECT COUNT(*) FROM alerts WHERE status = 'unresolved'").fetchone()[0]
    
    # Protocol distribution
    proto_rows = cursor.execute("""
        SELECT protocol, COUNT(*) as cnt 
        FROM traffic_records 
        GROUP BY protocol 
        ORDER BY cnt DESC
    """).fetchall()
    
    grand_total = max(1, sum([r['cnt'] for r in proto_rows]))
    protocols = [
        {"protocol": r['protocol'], "count": r['cnt'], "percentage": round((r['cnt'] / grand_total) * 100, 1)}
        for r in proto_rows
    ]
    
    # Recent alerts
    alerts_rows = cursor.execute("""
        SELECT id, timestamp, src_ip, dst_ip, category, severity, reason, status
        FROM alerts ORDER BY id DESC LIMIT 5
    """).fetchall()
    
    conn.close()
    
    return jsonify({
        "metrics": {
            "totalPacketsAnalyzed": total_packets,
            "totalAnomaliesDetected": total_anomalies,
            "unresolvedAlerts": unresolved_alerts,
            "currentBandwidthMbps": 16.4,
            "averageLatencyMs": 9.2,
            "packetLossPercentage": 0.12,
            "networkHealthScore": 96,
            "healthStatus": "Healthy"
        },
        "protocolDistribution": protocols,
        "recentAlerts": [dict(r) for r in alerts_rows]
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json or {}
    packet_size = float(data.get('packetSize', 512))
    protocol = str(data.get('protocol', 'TCP'))
    src_port = int(data.get('srcPort', 49152))
    dst_port = int(data.get('dstPort', 80))
    packet_rate = float(data.get('packetRate', 45))
    flow_duration = float(data.get('flowDuration', 200))
    bytes_transferred = float(data.get('bytesTransferred', 2048))
    
    prediction = iso_forest.predict_single({
        'packet_size': packet_size,
        'protocol': protocol,
        'src_port': src_port,
        'dst_port': dst_port,
        'packet_rate': packet_rate,
        'flow_duration': flow_duration,
        'bytes_transferred': bytes_transferred
    })
    
    return jsonify(prediction)

@app.route('/api/congestion/predict', methods=['GET'])
def congestion_predict():
    conn = get_db_connection()
    result = congestion_predictor.predict(conn)
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    print("[SmartNet AI] Standalone Python Backend running on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
