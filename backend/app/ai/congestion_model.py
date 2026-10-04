import numpy as np

class CongestionPredictor:
    def __init__(self, link_capacity_mbps=100.0):
        self.link_capacity = link_capacity_mbps

    def predict(self, conn):
        cursor = conn.cursor()
        rows = cursor.execute("""
            SELECT throughput_mbps, latency_ms, packet_loss_pct, packet_rate
            FROM metrics_history
            ORDER BY id DESC LIMIT 25
        """).fetchall()

        if len(rows) < 3:
            return {
                "status": "Healthy",
                "riskScore": 12,
                "trend": "stable",
                "forecastMinutes": 15,
                "currentUtilizationPct": 16.5,
                "predictedBandwidthMbps": 18.0,
                "bufferQueuePressurePct": 14,
                "recommendedAction": "Traffic levels are nominal. Ample bandwidth margin available."
            }

        throughputs = [r[0] for r in rows][::-1]
        latencies = [r[1] for r in rows][::-1]
        losses = [r[2] for r in rows][::-1]

        # Calculate linear regression slope
        x = np.arange(len(throughputs))
        y = np.array(throughputs)
        slope, intercept = np.polyfit(x, y, 1)

        current_tp = throughputs[-1]
        current_lat = latencies[-1]
        current_loss = losses[-1]

        predicted_tp = max(5.0, float(current_tp + slope * 15))
        utilization = (current_tp / self.link_capacity) * 100.0
        predicted_util = (predicted_tp / self.link_capacity) * 100.0

        risk_score = (predicted_util / 100.0) * 55.0
        if current_lat > 45:
            risk_score += 25.0
        if current_loss > 1.5:
            risk_score += 20.0
        risk_score = int(np.clip(risk_score, 5, 99))

        trend = "stable"
        if slope > 0.8:
            trend = "surging"
        elif slope < -0.8:
            trend = "decreasing"

        if risk_score >= 75 or predicted_util > 80:
            status = "Critical"
            action = "High traffic growth detected. Congestion risk is imminent. Activate RED (Random Early Detection) and limit high-throughput UDP buffers."
        elif risk_score >= 45 or predicted_util > 60:
            status = "Warning"
            action = "Traffic expansion observed. Monitor queue lengths and prepare QoS prioritization for latency-sensitive traffic."
        else:
            status = "Healthy"
            action = "Optimal condition. Queue latency is low and channel utilization has sufficient headroom."

        return {
            "status": status,
            "riskScore": risk_score,
            "trend": trend,
            "forecastMinutes": 15,
            "currentUtilizationPct": round(utilization, 1),
            "predictedBandwidthMbps": round(predicted_tp, 1),
            "bufferQueuePressurePct": int(min(100, (current_lat / 150.0) * 100)),
            "recommendedAction": action,
            "slope": round(float(slope), 3)
        }
