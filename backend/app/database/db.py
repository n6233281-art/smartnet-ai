import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'smartnet.sqlite')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS traffic_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            src_ip TEXT,
            dst_ip TEXT,
            src_port INTEGER,
            dst_port INTEGER,
            protocol TEXT,
            packet_size INTEGER,
            flags TEXT,
            latency REAL,
            bandwidth_mbps REAL,
            is_anomaly INTEGER DEFAULT 0,
            anomaly_score REAL DEFAULT 0,
            scenario TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            src_ip TEXT,
            dst_ip TEXT,
            category TEXT,
            severity TEXT,
            reason TEXT,
            recommended_action TEXT,
            status TEXT DEFAULT 'unresolved',
            anomaly_score REAL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metrics_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            throughput_mbps REAL,
            latency_ms REAL,
            packet_loss_pct REAL,
            packet_rate INTEGER,
            active_connections INTEGER,
            health_score INTEGER
        )
    """)
    conn.commit()
    conn.close()
