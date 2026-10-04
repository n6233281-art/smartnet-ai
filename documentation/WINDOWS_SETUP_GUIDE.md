# Windows PowerShell Installation & Execution Guide
## SmartNet AI: End-to-End Execution Instructions

Follow these clear, step-by-step instructions to run the application on Microsoft Windows 10/11 using PowerShell.

---

### Prerequisites
1. **Node.js (v18.x or v20.x+)**: [https://nodejs.org](https://nodejs.org)
2. **Python (v3.10 or v3.11+)**: [https://python.org](https://python.org) (Ensure "Add python.exe to PATH" is checked)
3. **Cisco Packet Tracer (v8.x+)**: Optional for visual topology simulation.

---

### Method 1: Running the Complete Full-Stack Web Application (Recommended)

In Windows PowerShell, navigate to the project directory:

```powershell
# 1. Open PowerShell as Administrator or standard user
cd C:\path\to\smartnet-ai

# 2. Install Node.js dependencies
npm install

# 3. Start the unified Full-Stack Server (Express API + Vite React UI on Port 3000)
npm run dev
```

Now open your web browser and visit:
👉 **`http://localhost:3000`**

The server automatically initializes the SQLite database (`smartnet.sqlite`), starts the live traffic engine, and mounts all REST APIs!

---

### Method 2: Running the Standalone Python AI/ML Backend

If you wish to run the standalone Flask backend alongside the app:

```powershell
# 1. Open a new PowerShell window in the project root
cd C:\path\to\smartnet-ai\backend

# 2. Create and activate a Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# (If PowerShell blocks script execution, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass)

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start the Python Flask REST API
python run.py
```

The Python service will start on **`http://127.0.0.1:5000`**.

---

### Method 3: Importing Sample Packet Traces

1. Open the web interface at `http://localhost:3000`.
2. Navigate to **Packet Analyzer** from the sidebar.
3. Click **"Load Preloaded Sample CSV"** or drag and drop `datasets/sample_traffic.csv` or `datasets/cisco_pt_capture.csv`.
4. Observe the Isolation Forest model classifying packets in real-time.
