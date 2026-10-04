import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'isolation_forest_model.joblib')

class NetworkIsolationForest:
    def __init__(self, n_estimators=100, contamination=0.08, random_state=42):
        self.n_estimators = n_estimators
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            n_estimators=self.n_estimators,
            contamination=self.contamination,
            random_state=self.random_state
        )
        self.is_trained = False

    def _vectorize(self, df):
        # Feature columns: packet_size, proto_encoded, src_port, dst_port, packet_rate, flow_duration, bytes_transferred
        proto_map = {'ICMP': 1, 'TCP': 6, 'UDP': 17}
        proto_enc = df['protocol'].map(lambda p: proto_map.get(str(p).upper(), 6)).fillna(6)
        
        features = np.column_stack([
            df['packet_size'].fillna(512),
            proto_enc,
            df['src_port'].fillna(49152),
            df['dst_port'].fillna(80),
            df['packet_rate'].fillna(40),
            df['flow_duration'].fillna(150),
            df['bytes_transferred'].fillna(1024)
        ])
        return features

    def train_on_synthetic_baseline(self):
        np.random.seed(42)
        n_samples = 1500
        
        # Normal traffic generation
        packet_sizes = np.random.normal(512, 180, n_samples).clip(64, 1518)
        protocols = np.random.choice(['TCP', 'UDP', 'ICMP'], size=n_samples, p=[0.7, 0.25, 0.05])
        src_ports = np.random.randint(1024, 65535, n_samples)
        dst_ports = np.random.choice([80, 443, 53, 22, 8080], size=n_samples, p=[0.45, 0.35, 0.12, 0.05, 0.03])
        packet_rates = np.random.normal(35, 12, n_samples).clip(5, 90)
        flow_durations = np.random.exponential(180, n_samples).clip(20, 1000)
        bytes_transferred = packet_sizes * np.random.uniform(1.2, 5.0, n_samples)

        df = pd.DataFrame({
            'packet_size': packet_sizes,
            'protocol': protocols,
            'src_port': src_ports,
            'dst_port': dst_ports,
            'packet_rate': packet_rates,
            'flow_duration': flow_durations,
            'bytes_transferred': bytes_transferred
        })

        X = self._vectorize(df)
        self.model.fit(X)
        self.is_trained = True
        try:
            joblib.dump(self.model, MODEL_PATH)
        except Exception as e:
            pass

    def load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.is_trained = True
                return
            except Exception:
                pass
        self.train_on_synthetic_baseline()

    def predict_single(self, packet_dict):
        if not self.is_trained:
            self.load_or_train()

        df = pd.DataFrame([packet_dict])
        X = self._vectorize(df)
        
        # Isolation forest decision function: negative means outlier, positive inlier
        raw_score = -self.model.decision_function(X)[0]
        # Normalize into [0, 1] range
        normalized_score = float(np.clip((raw_score + 0.3) / 0.6, 0.05, 0.98))
        
        is_anomaly = normalized_score >= 0.60
        
        if normalized_score > 0.78:
            classification = "Potential Network Anomaly"
            severity = "critical" if packet_dict.get('packet_rate', 0) > 400 else "high"
            reason = "Significant structural deviation detected across multi-dimensional flow metrics"
        elif normalized_score >= 0.50:
            classification = "Suspicious Traffic"
            severity = "medium"
            reason = "Uncommon port or burst frequency divergence from nominal profile"
        else:
            classification = "Normal Traffic"
            severity = "low"
            reason = "Flow features conform to trained baseline behavior"

        return {
            'isAnomaly': is_anomaly,
            'classification': classification,
            'anomalyScore': round(normalized_score, 3),
            'severity': severity,
            'reason': reason
        }
